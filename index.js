//root vue instance

new Vue({
    el: "#container",
    //stateful properties stored here
    data:{
        resultsArray: [],
        userInput: "",
    },
    methods:{
        /*function for retrieving data and 
        filtering out the results that match search query*/
        getSearchResults: function(){
            let searchQuery = this.userInput
            //validate user input
            if(searchQuery === ""){
                alert("Enter a search query")
            }else{
            //fetch data    
            fetch('https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000')
            .then(res=>{ 
                return res.json()
            })
            //search for matching keywords
            .then(body=>{
                let array = []
                body.forEach((object)=>{
                    let keywordsArray = object.keywords.split(" ")
                    keywordsArray.forEach(keyword=>{
                        if(keyword === searchQuery){
                            array.push(object)
                        }
                    })
                })
                //alert user if no results are found
                if(array.length === 0){
                    alert("No results found")
                    this.userInput = ""
                }else{
                // remove any duplicate results
                    let removeDuplicates = array.filter((object, index)=>{
                        return array.indexOf(object) >= index
                })
                //convert syntax into html
                    let filteredArray = removeDuplicates.map(el=>{
                        let firstFilter = el.body.replace(/&lt;/g, "<")
                        let secondFilter = firstFilter.replace(/&gt;/g, "/>")
                        let thirdFilter = secondFilter.replace(/&amp;nbsp;/g, " ")
                        let newObject = {
                            title: el.title, 
                            desc: thirdFilter, 
                            favourited: false
                        }
                    return newObject
                })
                //assign array to state
                this.resultsArray = filteredArray
                }
            })
            }
        },
        /*function adds or removes a result to favourites section*/
        toggleFavourites: function(e){
            //filters through array and toggles the fsvourited value for the selected item
            let array = this.resultsArray.map((object, index)=>{
                if(index == e.target.id){
                    return{
                        title: object.title,
                        desc: object.desc,
                        favourited: !object.favourited,
                    }
                }else{
                    return object
                } 
            })    
            this.resultsArray = array
        },
        //function toggles what color star is displayed
        toggleStar: function(value){
            if(value === true){
                return "green-star.png"
            }else if(value === false){
                return "grey-star.png"
            }
        },
        //empties the results array when user input is deleted
        clearResults: function(){
            if(this.userInput === ""){
                this.resultsArray = []
            }
        }
    },
})

