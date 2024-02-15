<!-- Component templeate -->
<template>
    <div>
        <div id="fixHTTPbox">
            <span>HTTPS Fix: </span>
            <a v-bind:href="serverURL">Link</a>
            <button @click="deleteCaches">Delete Caches</button>
            <button @click="unregisterServiceWorkers">Unregister Service Workers</button>
            <button @click="reloadPage">Reload Page</button>
            
        </div>
        <div v-if="currentPage == true">
            <lessons-component :cartSize="cartSize" :lessonsList="lessonsList" :fetchData="fetchData" v-on:search-value-change="handleSearchValueChange" v-on:add-item-to-cart="addToCart"/>
        </div>
        <div v-if="currentPage == false">
            <checkout-component :shopingCart="shopingCart" :cleanShopingCart="cleanShopingCart" v-on:remove-item-from-cart="handleRemoveItem" />
        </div>

        <!-- Page Switch button-->
        <button class="cart_button" @click="changePage()" v-bind:disabled="isCartDisable() && currentPage" v-bind:class="{disabledSc: isCartDisable(), activeSc: !isCartDisable() || !currentPage,left: !currentPage, right: currentPage }">
            <i class="fa-solid fa-cart-shopping"><span>Cart</span></i>
            <p v-if="currentPage" class="item_in_cart">{{ cartSize }}</p>
        </button>
    </div>
</template>

<!-- Script -->
<script>
import Lessons from "./Lessons.vue";
import Checkout from "./Checkout.vue";

export default {
    name: "Parent-Component",
    components: {
        "lessons-component" : Lessons,
        "checkout-component": Checkout
    },
    data() {
        return {
            currentPage: true,  //Curent page swithcer
            searchValue: '',    //Input search value
            lessonsList: [],    //Lessons list
            shopingCart: [],    //Shoping cart list
            cartSize: 0,        //Shoping cart size
            serverURL: `https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/lessons?src=`
       
        }
    }, 

    //Get the lessons from DB on component mounted
    mounted: function() {
        this.getData();
        //this.fetchData();
    },

    methods: {
        // Handle Remove item
        handleRemoveItem: function(value) {
            let {idx, id} = value;
            this.removeItem(idx, id);
        },

        //Handle the search value update
        handleSearchValueChange: function(event) {
            let { value } = event.target;
        
            if(value == '') {
                this.searchValue = ' '
                this.fetchData();
            } else {
                this.searchValue = value;
            }
        },

        // Store App Data in the cache
        storeDataInTheCache: async function(key, data) {
            try {
                let cache = await caches.open('app-data');
                let response = new Response(JSON.stringify(data));

                await cache.put(key, response);
                console.log('Data cached', data);
            } catch(e) {
                console.log('Error saving cache', e);
            }
        }, 

        //Get App Data from cache
        getDataFromTheCache: async function(key) {
            try {
                let cache = await caches.open('app-data');
                let response = await cache.match(key);

                if(response) {
                    let data = await response.json();

                    return data;
                } 
                return null;
            } catch {
                console.log("Error getting data from the cache");
                return null;
            }
        },

        //Get App data ( from Cache or Network )
        getData: async function() {
            let dataFromCache =  await this.getDataFromTheCache('lessons');

            if(dataFromCache != null) {
                this.lessonsList = dataFromCache;

                let cartFromCache = await this.getDataFromTheCache('shopingCart');

                if(cartFromCache != null) {
                    this.shopingCart = cartFromCache;

                    let cartSizeFromCache = await this.getDataFromTheCache('cartSize');
                    this.cartSize = cartSizeFromCache;
                } else {
                    this.storeDataInTheCache("shopingCart", this.shopingCart);
                }
            } else {
                this.fetchData();
                console.log('Data fetched fro the network');
            }
        },

        //Fetch data from the database
        fetchData: async function() {
            await fetch(`https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/lessons?src=` + this.searchValue
                ).then(response => response.json()
                ).then(data => { 
                    this.lessonsList = data;
                    return this.storeDataInTheCache("lessons", data);
                }).catch(error => {

                    console.error('Error loading data:', error);
                });
        },

        //Event handler, on click go to Cart page
        changePage: function() {
            this.currentPage = !this.currentPage;
        },

        //Event handler, on button click add the item to shopping cart
        addToCart: function(id) {
            //Find the lesson by ID and update the spaces
            let item = this.lessonsList.filter(lesson => { 
                    if(lesson._id == id && lesson.spaces > 0)  {
                        lesson.spaces--;
                        return lesson;
                    }
            });

            this.storeDataInTheCache('lessons', this.lessonsList);

            //Add the item to shopping Cart Array, update the cart size
            if(item.length > 0) {
                this.shopingCart.push(...item);
                this.cartSize++;
            }

            this.storeDataInTheCache('cartSize', this.cartSize);
            this.storeDataInTheCache('shopingCart', this.shopingCart);
        }, 

        //Remove items from the cart
        removeItem: function(idx, id) {
            //Remove by ID
            this.shopingCart.splice(idx, 1);
            this.cartSize--;

            this.storeDataInTheCache('cartSize', this.cartSize);
            this.storeDataInTheCache('shopingCart', this.shopingCart);

            //Update the available spaces
            this.lessonsList.map(lesson => { 
                if(lesson._id == id && lesson.spaces < 5)  
                    lesson.spaces++;
            });

            this.storeDataInTheCache('lessons', this.lessonsList);
        },

        //Clean the shoping cart
        cleanShopingCart: function() {
            this.shopingCart = [];
            this.cartSize = 0;
            this.fetchData();
        },

        //Check if the cart button is disabled
        isCartDisable: function() {
            return this.cartSize == 0;
        },

        //Remove all caches
        deleteCaches: function() {
            caches.keys().then((names) => {
                for(let name of names) {
                    caches.delete(name);
                }
            })
        },

        //Unregistre all service workers
        unregisterServiceWorkers: function() {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for(let reg of registrations) {
                    reg.unregister()
                }
            })
        },

        //Reload Page
        reloadPage() {
            window.location.reload()
        }
    }
}
</script>

<!-- Styles -->
<style >
* {
    touch-action: manipulation;
    margin: 0 auto;
    font-family: Arial, Helvetica, sans-serif;
}


.right {
    border-radius: 20px 0px 0px 0;
    right: 0px;
    bottom: 0px;
}

.left {
    margin: 0;
    border-radius: 0px 20px 0px 0;
    left: 0px;
    bottom: 0px;
}

.left span {
    position: relative;
    top: -2px;
}

.item_in_cart {
    align-items: center;
    position: absolute;
    top: -5px;
    right: 87px;
    font-size: 14px;
    padding: 3px;
    color: black;
    background-color: white;
    border: 4px solid rgb(18, 18, 248);
    border-radius: 50%;
    min-width: 15px;
    display: flex;
    justify-content: center;
}


.disabledSc {
    background-color: rgb(179, 178, 178);
}


.disabledSc:hover {
    transform: none;
    background-color: rgb(179, 178, 178);
    cursor:auto;
}

.activeSc {
    background-color: rgb(18, 18, 248);
}

.activeSc:hover {
    cursor: pointer;
    transition: all 0.5s;
    border: none;
    transform: scale(1.4);
    background-color: rgb(90, 90, 254);
}

.top_title {
    text-align: center;
    width: 100vw;
    margin-bottom: 60px;
    font-size: 26px;
    background-color: rgb(93, 93, 249);
    color: rgb(255, 255, 255);
    padding: 10px 0;
}

#lessons_box  {
    display: flex;
    justify-content: center;
    width: 70%;
    flex-wrap: wrap;
    margin: 0;
    height: max-content;
}

.lesson {
    border-radius: 10px;
    min-width: 250px;
    margin: 10px;
    padding: 15px;
    background-color: white;
    border: 1px solid rgba(0, 0, 229, 0.495);
    height: 110px;
    display: flex;
    position: relative;
    transition: all 0.5s;
    text-align: left;
}

.lesson button {
    padding: 4px 12px;
    font-size: 16px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    border-radius: 10px 0px 10px 0px;
    width: max-content;
    border: none;
}

.lesson:hover {
    transform: scale(1.05);
    border: 1px solid rgba(0, 0, 229, 0.495);
    box-shadow: 1px 1px 5px rgba(0, 0, 229, 0.495);
}

.lesson_data {
    width: 170px;
}

.title {
    font-weight: bold;
}

.icon {
    width: max-content;
    text-align: center;
}

.icon i {
    width: 60px;
    font-size: 52px;
    color: rgba(0, 0, 229, 0.495);
}

.cart_button {
    font-size: 1.5rem;
    color: white;
    padding: 25px 15px 15px 15px;
    position: fixed;
    width: 100px;
    border: none;
}

.cart_button span {
    margin-left: 5px;
    font-size: 12px;
    font-weight: 100;
}

#fixHTTPbox {
    font-size: 12px;
    padding: 10px;
}

#fixHTTPbox  a {
    margin-right: 10px;
}

#fixHTTPbox button {
    cursor: pointer;
}

</style>