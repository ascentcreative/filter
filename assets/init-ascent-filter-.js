// Code (c) Kieran Metcalfe / Ascent Creative 2023


//  NOTE - order of widget init is important. Display must initialise before the bar so that the initial bar event will be caught

// init on document ready
$(document).ready(function(){
    // alert('init blockselect');
    $('.filter-display').not('.initialised').filterdisplay();
    $('.filter-bar').not('.initialised').filterbar();

});



MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    // console.log(mutations, observer);
    // ...
    $('.filter-display').not('.initialised').filterdisplay();
    $('.filter-bar').not('.initialised').filterbar();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  childList: true
  //...
});
