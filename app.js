var DOM = (function(){
    
    var domNames = {
        container: '.container',
        visible: '.container--visible',
        search: '.search',
        input: '.search__input',
        btn: '.search__btn',
        done: ".search--done",
        img: '.images',
        web: '.results',
        ready: '.ready',
        loading: 'loading',
        error: '.error',
        last: '.search__last-items'
        
    };
    
    return {
        getDomNames: function() {
            return domNames;
        }
    };
    
})();


//init of application set the event listeners
var init = function() {

var names = DOM.getDomNames();
    
    //after button is clicked, search process begins
document.querySelector(names.btn).addEventListener('click', function() {
   search(); 
});

//after enter is hit, search process begins
document.addEventListener('keypress', function(event) {
    if(event.keyCode === 13 || event.which === 13) {
       search(); 
       }});
    
};
init();

// searching function
var search = function() {
    
    var selectors = DOM.getDomNames();
    
    //clear old results
    clearOldResults(selectors);
    

    //get input value and if the field is not emptz start search
   var input = getInputValue(selectors);
   
    if(input) {
    
         //start loading and show skeleton
        loading();
        
         //add classes container--visible a search-done
        prepareHtml(selectors);
        
        //start api request and pass input value, process and show results
        searchProcess(input);
      
        //if the input is not filled, show alert 
    } else {
        alert('Please fill the search field.')
    }
    
    
    //clear input and set focus
    clearInput(selectors);
    
};




//clear old results
var clearOldResults = function(names) {
    var searchDone = document.querySelector(names.done);
    var errorMes = document.querySelector(names.error);
    
  if(searchDone) {

    //remove divs with results
     var fields, fieldsArray;
      
      fields = document.querySelectorAll(names.img + ',' + names.web);
      fieldsArray =Array.prototype.slice.call(fields);
      fieldsArray.forEach(function(el) {
          el.remove();
      });
      
   
    //remove class search--done, container--visible and ready
    document.querySelector(names.search).classList.remove(names.done);
    document.querySelector(names.container).classList.remove(names.visible);
    document.querySelector(names.container).classList.remove(names.ready);
   
  }; 
    
    if(errorMes) {
      errorMes.remove();
  };
    
};





// loading and prepare phase

//loading skeleton
var loading = function() {
    var names = DOM.getDomNames();
    document.querySelector(names.container).classList.add(names.loading); 
};


var prepareHtml = function(names) {
     //add class to results container 
    document.querySelector(names.container).classList.add('container--visible');
    
    //move search input
    document.querySelector(names.search).classList.add('search--done');
};







 //get input value
 
//get value from input
   var getInputValue = function(names) {
       var inputValue
       inputValue = document.querySelector(names.input).value;
       return inputValue;
   };






//search and processing results

//search
var searchProcess = function(value) {
   
    var apiBase = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBEFefASQnKhlKHWu4f_77d9IfGFLvx90A&cx=008593505781583252207:853ebhwnks0&searchType=image&imgSize=xxlarge&q=';

    //create API
    var api = apiBase + value;
   
 //   start API Request
    fetch(api)
        .then(function(response) {
            
            if(response.ok) {
                return response.json();
            } else {
                error();
            };
        })
        .then(function(result) {
       
        // start processing received data
        processResults(result.items);
        
        })
        .catch(function(error){
            throw new Error(error);
 });
   
};




//error function

var error = function() {
    var names, cont, errorHtml;
    
    names = DOM.getDomNames();
    cont = document.querySelector(names.container);
    
    errorHtml = '<div class="error">Sorry, something went wrong.</div>'; 
    cont.classList.add('container--visible');
    cont.classList.remove(names.loading);
    cont.insertAdjacentHTML('afterbegin', errorHtml);
};



// process results
var processResults = function(searchItems) {
  
    //create html for results
    webResultsContainer();
    
    //loop through array with results items and get title, link and description
    searchItems.forEach(function(items){
                var title =  items.title;
                var link = items.displayLink;
                var desc = items.snippet;
        
    //create items with results
    createItemHtml(title, link, desc);
            });
    
     //create html for results
    createImgContainer();
    
    
    //loop through array with imag results and get data
    searchItems.forEach(function(img) {
        var thumbnail, link;
        
        thumbnail = img.image.thumbnailLink;
         link = img.link;
        
        //create html items and place data inside
    createImgItem(thumbnail, link);
        
    });
    
    ready();
};




//Create container for web results and add results
var webResultsContainer = function() {
    var names = DOM.getDomNames();
    var resultsHtml = '<div class="col results"></div>';
    document.querySelector(names.container).insertAdjacentHTML('beforeend', resultsHtml);
};



var createItemHtml = function(title, link, desc) {
    var html, newHtml, names;
    
    names = DOM.getDomNames();
    
    //prepared html with placeholders
    html = ' <div id="item" class="results__item"><a class="results__item-head" href="%link%"><h1 class="results__title">%title%</h1><h2 class="results__subtitle">%subtitle%</h2></a><p class="results__desc">%description%</p></div>';
    
    //assing values to html
    newHtml = html.replace('%link%', link);
    newHtml = newHtml.replace('%title%', title);
    newHtml = newHtml.replace('%subtitle%', link);
    newHtml = newHtml.replace('%description%', desc);
    
    //insert html with data
    document.querySelector(names.web).insertAdjacentHTML('beforeend', newHtml);
    
};


//Create container for image results and add images
var createImgContainer = function() {
    var names = DOM.getDomNames();
    var imagesContainer = '<div class="col images"></div>';
    document.querySelector(names.container).insertAdjacentHTML('beforeend', imagesContainer);
    
}

var createImgItem = function(thumb, link) {
    
    var imgHtml, newImgitem, names;
    
     names = DOM.getDomNames();
    
    //prepared html with placeholders
    imgHtml = '<div class="images__item"><a href="%imgLink%" class="images__link"><img src="%thumb%" alt="image"></a></div>';
    
    //assign values to html string
    newImgitem = imgHtml.replace('%thumb%', thumb);
    newImgitem = newImgitem.replace('%imgLink%', link);

    
    //insert html with data
    document.querySelector(names.img).insertAdjacentHTML('beforeend', newImgitem);
};


//add ready class and remove loading
var ready = function() {
     var names = DOM.getDomNames();
    document.querySelector(names.container).classList.remove(names.loading); 
};




 //clear input and set focus
 var clearInput = function(names) {
     var input = document.querySelector(names.input);
     input.value = "";
     input.focus();
    };





