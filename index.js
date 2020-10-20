let autoResize = (function() {
    const initialRange = 20;
    const rootElement = document.getElementById("root");
    let be_data = []; // Data from the backend
    let topList = []; // Saving top data
    let bottomList = []; // Saving Bottom Data
    let maxScrollHeight = 0; // Trigger event once crossing the Max Scroll Height
    let minScrollHeight = 0; // Trigger event once crossing the Min Scroll Height
    let appendFrom = 0; // This variable is utilized while adding the new data at the bottom
    let initialSize = 0; // This variable is utilized while adding the new data at the bottom
    let removeFrom = 0;

    let init = function() {

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

        divEle.addEventListener("scroll", (et) => {

            if(et.target.scrollTop >= maxScrollHeight) {
                console.log("Reached End of the scroll");
                let config = {
                    ele: et.target,
                    scrollDirection: 'down',
                    count: 5
                }
                updateItems(config);
            }

            if(et.target.scrollTop <= minScrollHeight) {
                console.log("Reached top of the scroll : " + minScrollHeight);
                let config = {
                    ele: et.target,
                    scrollDirection: 'up',
                    count: 5
                }
                updateItems(config);
                
            }
            
        })

    }

    let updateItems = function(config) {

        if(config.scrollDirection == 'down') {
            for(let i=0; i < config.count; i++) {
                //Pushing the top data to the topList which can be moved to local memory
                topList.push(config.ele.childNodes[removeFrom]);
                //Removeing the top child items from the table..
                removeItem(config.ele, config.ele.childNodes[removeFrom]);

                if(appendFrom >= be_data.length) {
                    return;
                } else {
                    if(bottomList.length > 0) {
                        insertItem(config.ele, bottomList[0].childNodes[0].nodeValue);
                        bottomList.shift(i);
                    } else {
                        insertItem(config.ele, be_data[appendFrom]);
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
                    bottomList.unshift(config.ele.childNodes[initialSize-1]);
                    //Removeing the bottom child items from the table..
                    removeItem(config.ele, config.ele.childNodes[initialSize-1]);

                    console.log("topList[i] : " + topList[i]);
                    config.ele.insertBefore(topList[i], config.ele.firstChild);
                    topList.pop();

                }
                console.log("End topList removed : " + topList.length);
            }
        }
    }

    let removeItem = function(ele, node) {
        ele.removeChild(node);
    }

    let insertItem = function(ele, text) {
        let textNode = document.createTextNode(text);
        let item = document.createElement("div");
        item.className = "item";
        item.appendChild(textNode);
        ele.appendChild(item);
    }

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