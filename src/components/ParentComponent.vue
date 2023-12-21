<template>
    <div>
        <div v-if="currentPage == true">
            <Lessons :cartSize="cartSize" :currentPage="currentPage" :addToCart=" addToCart" :lessonsList="lessonsList" v-on:searchValueChange="handleSearchValueChange"  :changePage=" changePage" :fetchData="fetchData"/>
        </div>
        <div v-if="currentPage == false">
            <Checkout :shopingCart="shopingCart" :changePage="changePage" :removeItem="removeItem" :cleanShopingCart="cleanShopingCart" />
        </div>
    </div>
</template>


<script>
import Lessons from "./Lessons.vue";
import Checkout from "./Checkout.vue";

export default {
    name: "Lessons-Page",
    components: {
        Lessons,
        Checkout
    },
    data() {
        return {
            currentPage: true,
            searchValue: '',
            lessonsList: [],
            shopingCart: [],
            cartSize: 0
       
        }
    },

    mounted: function() {
        this.fetchData();
    },

    methods: {
        handleSearchValueChange: function(event) {
            let { value } = event.target;
            this.searchValue = value;

            console.log('first', this.searchValue)
        },

        //Fetch data from the database
        fetchData: async function() {
            await fetch(`https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/lessons?src=` + this.searchValue
                ).then(response => response.json()
                ).then(data => { 
                    this.lessonsList = data;
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

            //Add the item to shopping Cart Array, update the cart size
            if(item.length > 0) {
                this.shopingCart.push(...item);
                this.cartSize++;
            }
        }, 

        //Remove items from the cart
        removeItem: function(idx, id) {
            //Remove by ID
            this.shopingCart.splice(idx, 1);
            this.cartSize--;

            //Update the available spaces
            this.lessonsList.map(lesson => { 
                if(lesson._id == id && lesson.spaces < 5)  
                    lesson.spaces++;
            });
        },

        cleanShopingCart: function() {
            this.shopingCart = [];
            this.cartSize = 0;
        }
            
    }
}


</script>


<style >
* {
    touch-action: manipulation;
    margin: 0 auto;
    font-family: Arial, Helvetica, sans-serif;
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



.cart_button:hover {
    cursor: pointer;
    transition: all 0.5s;
    border: none;
}

.cart_button {
    font-size: 1.5rem;
    color: white;
    background-color: rgb(18, 18, 248);
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

.cart_button:hover {
    transform: scale(1.4);
    background-color: rgb(90, 90, 254);
}
</style>