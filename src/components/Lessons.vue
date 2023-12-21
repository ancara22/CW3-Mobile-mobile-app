<!-- Component templeate -->
<template>
    <div>
        <div class="top_title">Lessons</div>
        <section id="lessons_app">
            <div class="search_bar">
                <input @input="handleInputChange" type="text" placeholder="Search">
            </div>

            <!-- Filters Box -->
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

                <!-- Lessons box -->
                <div id="lessons_box">
                    <div class="lesson" v-for="lesson in searchedData" v-bind:key="lesson._id">
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
                            <button v-bind:disabled="isDisable(lesson.spaces)" v-bind:class="{disabled: isDisable(lesson.spaces), active: !isDisable(lesson.spaces)}" @click="handleAddItemToCart(lesson._id)">Add to cart</button>
                        </div>
                        <div class="icon">
                            <i v-bind:class="lesson.icon"></i>
                        </div>
                    </div>
                </div>
             </div>

        </section>
    </div>
</template>

<!-- Script -->
<script>
export default {
    name: "Lessons-Page",

    data() {
        return {
            sortBy: 'subject',      //Sort by. subject-default
            sortDirection: 'asc',   //Sort direction. ASC-default
        }
    },

    //Component props
    props: {
        cartSize: { type: Number },
        fetchData: { type: Function },
        currentPage: { type: Boolean },
        lessonsList: { type: Array },
        addToCart: { type: Function },
        changePage: { type: Function }
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
        //Handle and emit to the parent the search value change
        handleInputChange: function(event) {
            this.fetchData();
            this.$emit('searchValueChange', event);
        },

        //Handle and emit to the parent the search value change
        handleAddItemToCart: function(id) {
            this.$emit('addItemToCartEvent', id);
        },

        //Check if the lesson has more spaces
        isDisable: function(spaces) {
            return spaces == 0;
        },

        //Check if the cart button is disabled
        isCartDisable: function() {
            return this.cartSize == 0;
        },

        
    }
}

</script>

<!-- Styles -->
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

.active:hover {
    cursor: pointer;
    background-color: rgb(0, 0, 229);
}

.active {   
    background-color: rgb(90, 90, 254);
    color: white;
}


</style>