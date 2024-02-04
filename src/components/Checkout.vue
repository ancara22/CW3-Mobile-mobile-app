<!-- Component templeate -->
<template>
    <div>
        <!-- Shoping cart box -->
        <div class="top_title">My Cart</div>
        <div class="container">
            <div id="lessons_box">
                <div class="lesson" v-for="(item, idx) in shopingCart" :key="idx">
                    <div class="lesson_data">
                        <div class="subject">
                            <span class="title">Subject: </span>
                            <span class="content">{{ item.subject }}</span>
                        </div>
                        <div class="location">
                            <span class="title">Location: </span>
                            <span class="content">{{ item.location }}</span>
                        </div>
                        <div class="price">
                            <span class="title">Price: </span>
                            <span class="content">£{{ item.price }}</span>
                        </div>
                        <div class="spaces">
                            <span class="title">Spaces: </span>
                            <span class="content">1</span>
                        </div>
                        <button class="removeBtn" v-on:click="handleRemoveItem(idx, item._id)">Remove</button>
                    </div>
                    <div class="icon">
                        <i v-bind:class="item.icon"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Checkout Box -->
        <div class="central_title">Checkout</div>
        <div class="checkout_box">
            <div class="checkout">
                <input v-model="userName" v-on:keypress="isLetter" type="text" placeholder="Name">
                <input v-model="userPhoneNr" v-on:keypress="isNumber" type="text" placeholder="Phone Nr."> 
                <button  v-bind:disabled="!activeCheckout" id="checkout_btn" v-bind:class="{ 'active_btn': activeCheckout }" v-on:click="sendOrder()">Checkout</button>
            </div>
            <span>{{ message }}</span>
        </div>
    </div>
</template>


<script>
export default {
    name: "Checkout-Page",
    props: {
        shopingCart: { type: Array },
        changePage: { type: Function },
        removeItem: { type: Function },
        cleanShopingCart: { type: Function }
    },

    data: function() {
        return {
            message: '',      //Message to dispaly after checkout
            userPhoneNr: '',  //User Phone Number
            userName: ''      //User name
        }
    },
    
    methods: {
        //Handle Remove item
        handleRemoveItem: function(idx, id) {
            let value = { idx, id }
            this.$emit('handleRemoveItem', value);
        },

        //Check if input is a number
        isNumber: function(event) {
            if (!/\d+/.test(event.key) )
                return event.preventDefault(); //Prevent typing
        },

        //Check if input is a letter
        isLetter: function(event) {
            if (!/[A-Za-z]+/.test(event.key) )
                return event.preventDefault(); //Prevent typing
        },

        //Event hadler, on click, send the order
        sendOrder: async function() {
            let itemsMap = new Map();

            //Extract the ids from the shoping cart, and count the items
            this.shopingCart.forEach(item => {
                let id = item._id;

                if(itemsMap.has(id)) {
                    itemsMap.set(id, itemsMap.get(id) + 1)
                } else {
                    itemsMap.set(id, 1);
                }
            });

            //Formate the cart result
            let itemsArray = Array.from(itemsMap.entries()).map(([id, count]) => ({
                id: id,
                count: count
            }));

            //Create the order object
            let order = {
                name: this.userName,
                phone: this.userPhoneNr,
                IDs: itemsArray
            };
        

            //Place the order
            await fetch("https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/placeorder", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(order),
                }).then((resp) => {
                    if (!resp.ok) {
                        throw new Error(`Server POST error! Status: ${resp.status}`);
                    } 
                    return resp; 
                }).then((data) => {
                    if(data.status == 200) {
                        this.message = 'Order Succes! Thank you for your order ' + this.userName;
                        this.updateTheSpaces(order.IDs);

                        this.cleanInputs();     //Clean the shoping cart
                    } else {
                        this.message = 'Error placing the order.';
                    }
                }).catch(error => {
                    console.error('Error placing order:', error);
                });
        }, 

        //Update the database
        updateTheSpaces: async function(orderIDs) {
            await fetch("https://0zr0qu3hol.execute-api.eu-north-1.amazonaws.com/prod/update-spaces", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderIDs),
            }).then((resp) => {
                if (!resp.ok) {
                    throw new Error(`Server PUT error! Status: ${resp.status}`);
                } 
                return resp; 
            }).then((data) => {
                if(data.status == 200) {
                    console.log('Database updating succes!');
                } else {
                    this.message = 'Error updating the database.';
                }
            }).catch(error => {
                console.error('Error updating the database:', error);
            });
        },

        //Clean the checkout inputs
        cleanInputs: function() {
            //Clear thecheckout inputs
            this.userName = '';
            this.userPhoneNr = '';

            //Empty the shoping cart
            this.cleanShopingCart();
            
            //Remove the messahe after timeout
            setTimeout(() => {
                this.message = '';
            }, 3000)
        },
    },

    computed: {
        //Check the checkout status
        activeCheckout: function() {
            return this.userName != '' && this.userPhoneNr != '' && this.shopingCart.length != 0 ? true : false;
        }
    },
}
</script>

<!-- Styles-->
<style scoped>
.container  {
    display: flex;
    justify-content: center;

}

.removeBtn {
    background-color: rgba(247, 97, 97, 0.965);
    color: white;

}

.removeBtn:hover {
    background-color: red;
    cursor: pointer;
}


.central_title {
    text-align: center;
    width: 80vw;
    margin-top: 100px;
    font-size: 26px;
    color: rgb(93, 93, 249);
    border-bottom: 1px solid rgba(93, 93, 249, 0.197);
    padding: 10px 0;
}

.checkout_box {
    display: flex;
    flex-direction: column;
}

.checkout_box span {
    color: rgb(22, 161, 4);
    margin-bottom: 150px;
}

.checkout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 30px;
    font-weight: bold;
    width: 100%;
}

.checkout input {
    border: 2px solid rgba(90, 90, 254, 0.835);
    margin-bottom: 10px;
    /*background-color: rgba(90, 90, 254, 0.161); */
    padding: 10px 10px 10px 25px;
    width: 200px;
    height: 20px;
}

#checkout_btn {
    margin-top: 20px;
    padding: 13px 30px;
    border: none;
}


.active_btn:hover {
    background-color: rgb(93, 93, 249);
    transform: scale(1.2);
    cursor: pointer;
    transition: all 0.5s;
}

.active_btn {
    background-color: rgb(18, 18, 248);
    color: white;
}

</style>