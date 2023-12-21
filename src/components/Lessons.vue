<template>
    <div>
        <div class="top_title">Lessons</div>
        <section id="lessons_app">
            <div class="search_bar">
                <input @input="handleInputChange" type="text" placeholder="Search">
            </div>
            
            <div class="container"> 
                <div class="filters">
                    <div class="filter_title">Sort By:</div>
                    <form class="filter">
                        <label>
                            <input v-model="sortBy" type="radio" name="color" value="subject" checked> Subject
                        </label>
                        <label>
                            <input v-model="sortBy" type="radio" name="color" value="location"> Location
                        </label>
                        <label>
                            <input v-model="sortBy" type="radio" name="color" value="price"> Price
                        </label>
                        <label>
                            <input v-model="sortBy" type="radio" name="color" value="spaces"> Availability
                        </label>
                    </form>
                    <form class="filter">
                        <label>
                            <input v-model="sortDirection" type="radio" name="color" value="asc" checked> Ascending
                        </label>
                        <label>
                            <input v-model="sortDirection"  type="radio" name="color" value="desc"> Descending
                        </label>
                    </form>
                </div>
        
                <div id="lessons_box">
                    <div class="lesson" v-for="lesson in sortedList" v-bind:key="lesson._id">
                        <div class="lesson_data">
                            <div class="subject">
                                <span class="title">Subject: </span>
                                <span class="content">{{ lesson.subject }}</span>
                            </div>
                            <div class="location">
                                <span class="title">Location: </span>
                                <span class="content">{{ lesson.location }}</span>
                            </div>
                            <div class="price">
                                <span class="title">Price: </span>
                                <span class="content">£{{ lesson.price }}</span>
                            </div>
                            <div class="spaces">
                                <span class="title">Spaces: </span>
                                <span class="content">{{ lesson.spaces}}</span>
                            </div>
                            <button v-bind:disabled="isDisable(lesson.spaces)" v-bind:class="{disabled: isDisable(lesson.spaces), active: !isDisable(lesson.spaces)}" v-on:click="addToCart(lesson._id)">Add to cart</button>
                        </div>
                        <div class="icon">
                            <i v-bind:class="lesson.icon"></i>
                        </div>
                    </div>
                </div>
             </div>

            <button class="cart_button right" @click="changePage()" v-bind:disabled="isCartDisable()" v-bind:class="{disabledSc: isCartDisable(), activeSc: !isCartDisable()}">
                <i class="fa-solid fa-cart-shopping"><span>Cart</span></i>
                <p class="item_in_cart">{{ cartSize }}</p>
            </button>
        </section>
    </div>
</template>


<script>
export default {
    name: "Lessons-Page",

    data() {
        return {
            sortBy: 'subject',      //Sort by. subject-default
            sortDirection: 'asc',   //Sort direction. ASC-default
        }
    },

    props: {
        cartSize: {
            type: Number
        },
        fetchData: {
            type: Function
        },
        currentPage: {
            type: Boolean,
            require: true
        },
        lessonsList: {
            type: Array,
            require: true
        },
        addToCart: {
            type: Function
        },
        changePage: {
            type: Function,
        }

    },

    computed: {
        //Sort the Rendered list
        sortedList: function() {
            let copyArray = this.lessonsList;

            return copyArray.sort((a, b) => {
                //If sort by Price, convert data to Int
                if(this.sortBy == 'price') {
                    a['price'] = parseInt(a['price'], 10);
                    b['price'] = parseInt(b['price'], 10);
                }

                //Set ASC or DESC
                if(this.sortDirection == 'asc') {
                    return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
                } else if(this.sortDirection == 'desc') {
                    return a[this.sortBy] < b[this.sortBy] ? 1: -1;
                }
           })
        }
    },

    methods: {
        handleInputChange: function(event) {
            this.fetchData();
            this.$emit('searchValueChange', event);
        },

        //Check if the lesson has more spaces
        isDisable: function(spaces) {
            return spaces == 0;
        },

        //Check if the cart button is disabled
        isCartDisable: function() {
            return this.cartSize == 0;
        }
    }
}

</script>


<style scoped>
.search_bar {
    position: relative;
    margin: 0 auto;
    top: -30px;
    width: max-content;
    touch-action: manipulation
}

.search_bar input {
    touch-action: manipulation;
    border: none;
    width: 250px;
    background-color: rgb(216, 216, 216);
    padding: 10px 10px 10px 30px;
    border-radius: 50px;
}


.container  {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.filters {
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    min-width: 300px;
    height: max-content;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.filter_title   {
    font-weight: bold;
    margin-bottom: 10px;
}

.filter {
    margin-bottom: 20px;
    display: flex;
    margin-top: 10px;
}

.filter label {
    display: block;
    margin-bottom: 5px;
    margin-left: 10px;
}



.disabled {
    background-color: rgb(206, 206, 206);
    color: gray;
}



.right {
    border-radius: 20px 0px 0px 0;
    right: 0px;
    bottom: 0px;
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

.active:hover {
    cursor: pointer;
    background-color: rgb(0, 0, 229);
}

.active {   
    background-color: rgb(90, 90, 254);
    color: white;
}

.disabledSc {
    background-color: rgb(179, 178, 178);
}


.disabledSc:hover {
    transform: none;
    background-color: rgb(179, 178, 178);
    cursor:auto;
}

</style>