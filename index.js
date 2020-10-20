let autoResize = (function() {
    const initialRange = 20; // Variable to create inital records on the page...
    const rootElement = document.getElementById("root");
    let be_data = []; // Data from the backend
    let topList = []; // Saving top data
    let bottomList = []; // Saving Bottom Data
    let maxScrollHeight = 0; // Trigger event once crossing the Max Scroll Height
    let minScrollHeight = 0; // Trigger event once crossing the Min Scroll Height
    let appendFrom = 0; // This variable is utilized while adding the new data at the bottom
    let initialSize = 0; // This variable is utilized while adding the new data at the top
    let removeFrom = 0; // This variable is user to remove at index

    let init = function() {
        //Creating dummy data...
        be_data = getData(1,100);
        createDiVContainer();
        console.log("be_data:" + be_data);
        let tableContent = document.getElementById("tableContent");
        let tableItems = document.querySelectorAll(".tableContent .item");
        
        appendFrom = parseInt(tableItems.length);
        initialSize = parseInt(tableItems.length);

        //maxScrollHeight = (tableItems[0].clientHeight*tableItems.length) - tableContent.clientHeight;
        maxScrollHeight = (tableItems[0].clientHeight * tableItems.length) * .70;
        minScrollHeight = tableItems[0].clientHeight;
    }

    let getData = function(start, end) {

        if(start === end) return [start];
        return [start, ...getData(start + 1, end)];

    }

    let createDiVContainer = function() {

        let divEle = document.createElement("div");
        divEle.id="tableContent";
        divEle.className = "tableContent";
        insertItemsByRange(divEle);
        rootElement.appendChild(divEle);

        //Adding Scroll events
        divEle.addEventListener("scroll", (et) => {
            //Once you reach the bottom of the container
            if(et.target.scrollTop >= maxScrollHeight) {
                console.log("Reached End of the scroll");
                //passing a config to say what need to be done useing ScrollDirection value
                let config = {
                    ele: et.target,
                    scrollDirection: 'down',
                    count: 5
                }
                updateItems(config);
            }

            //Once you reach the top of the container
            if(et.target.scrollTop <= minScrollHeight) {
                console.log("Reached top of the scroll : " + minScrollHeight);
                //passing a config to say what need to be done useing ScrollDirection value
                let config = {
                    ele: et.target,
                    scrollDirection: 'up',
                    count: 5
                }
                updateItems(config);
                
            }
            
        })

    }
    // Updates the container based on the Scroll Direction provided in config
    let updateItems = function(config) {

        if(config.scrollDirection == 'down') {
            for(let i=0; i < config.count; i++) {
                //Pushing the top data to the topList which can be moved to local memory
                topList.push(config.ele.childNodes[removeFrom]);
                //Removeing the top child items from the table..
                removeItem(config.ele, config.ele.childNodes[removeFrom]);
                //If appendForm reaches backend data length don't add any new row
                if(appendFrom >= be_data.length) {
                    return;
                } else {
                    // If Bottom List has values take from it else create elements 
                    if(bottomList.length > 0) {
                        //Adding Back the elements to Contaier as we are moving DOWN  
                        addItem(config.ele, bottomList[0]);
                        // Removing from Bottom list as we started adding them back to the main container
                        //Used Array Shift Property to remove the element from top 
                        bottomList.shift(i);
                    } else {
                        // Creating new Nodes if the Bottom list is empty
                        insertItem(config.ele, be_data[appendFrom]);
                        //Below variable keep a count from where it need to start appending the new nodes..
                        appendFrom++;
                    }
                }
            }
            console.log("End bottomList removed : " + bottomList.length);
        }

        if(config.scrollDirection == 'up') {
            if(topList.length > 0) {
                console.log("Start topList : " + topList.length);
                for(let i = topList.length-1, j=0; j < config.count; j++, i--) {

                    //Pushing the bottom data to the bottomList by pushing to the top of array and which can be moved to local memory
                    //Used Array 'unshift' Property to push the node to top always, If we use PUSH method it will start adding from in from bottom and first node will e the last node  
                    bottomList.unshift(config.ele.childNodes[initialSize-1]);
                    //Removeing the bottom child items from the table..
                    removeItem(config.ele, config.ele.childNodes[initialSize-1]);

                    //Adding Back the elements to Contaier as we are moving UP    
                    config.ele.insertBefore(topList[i], config.ele.firstChild);
                    // Removing from Top list as we started adding them back to the main container
                    topList.pop();

                }
                console.log("End topList removed : " + topList.length);
            }
        }
    }

    // Removes a chiled node from a given element 
    let removeItem = function(ele, node) {
        ele.removeChild(node);
    }

    // Adds a chiled node from a given element     
    let addItem = function(ele, node){
        ele.appendChild(node);
    }

    // Create a new node and insert them to give element 
    let insertItem = function(ele, text) {
        let textNode = document.createTextNode(text);
        let item = document.createElement("div");
        item.className = "item";
        item.appendChild(textNode);
        ele.appendChild(item);
    }

    // Creates new elements based on initial range variable value
    let insertItemsByRange = function(ele) {
        be_data.forEach((data,indx) => {
            if(initialRange <= indx) {
                return;
            }
            insertItem(ele,data);
        })
    }

    return {
        init: init
    }
})();

document.addEventListener('DOMContentLoaded', function() { 
    autoResize.init();
}, false);