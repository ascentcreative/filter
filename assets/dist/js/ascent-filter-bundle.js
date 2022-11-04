// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent ? $.ascent : {};
var FilterBar = {
  _init: function _init() {
    var self = this;
    this.widget = this;

    // Watch for change events within the element:
    $(this.element).on('change', function () {
      self.sendUpdate();
      // alert('filter change detected');
    });

    // send initial event to trigger display load
    self.sendUpdate();
    this.element.addClass("initialised");
  },
  // trigger an event which causes the display to load data
  sendUpdate: function sendUpdate() {
    var filterData = new FormData($(this.element).find("form.filter-form")[0]);
    var stringData = $(this.element).find("form.filter-form INPUT, form.filter-form SELECT").not('[name=_token]').serialize();
    $(this.element).trigger('filters-updated', [filterData, stringData]);
  }
};
$.widget('ascent.filterbar', FilterBar);
$.extend($.ascent.FilterBar, {});

// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent ? $.ascent : {};
var FilterDisplay = {
  filterData: null,
  queryString: null,
  _init: function _init() {
    var self = this;
    this.widget = this;
    this.element.addClass("initialised");

    // listen for change events from the filter bar:
    $(document).on('filters-updated', function (e, data, strData) {
      console.log(data);
      console.log(strData);
      self.setFilterData(data, strData); // store the filter options so we can send paginated requests
      self.loadPage(0); // new filter data causes a reload of the results
    });

    // handle loading of data on history navigation:
    window.onpopstate = function (e) {
      $(self.element).html(e.state.data); // set display data
      // also need to change the filter form data...
    };
  },

  setFilterData: function setFilterData(data, strData) {
    this.filterData = data;
    this.filterData.append('config', $(this.element).data('filtersetup'));
    this.queryString = strData;
  },
  loadPage: function loadPage(idx) {
    // alert ('loading page' + idx);

    var self = this;
    $(self.element).css('opacity', 0.2);
    $.ajax({
      url: '/filter/loadpage',
      type: 'post',
      data: self.filterData,
      contentType: false,
      processData: false
    }).done(function (data) {
      console.log(data);
      $(self.element).html(data);

      // pushState:
      // call the History API to update the URL in the browser:
      // or, maybe this should be done by the display when the first page is loaded, so the results can be stored?
      var href = window.location.pathname;
      history.pushState({
        'data': data
      }, 'title', href + '?' + self.queryString);
    }).then(function () {
      $(self.element).css('opacity', 1);
    });

    // submit a query to the filter route

    // update the DOM

    // also need to handle if this is a hidden set or not (for infinite scroll)
  }
};

$.widget('ascent.filterdisplay', FilterDisplay);
$.extend($.ascent.FilterDisplay, {});

// Code (c) Kieran Metcalfe / Ascent Creative 2023

//  NOTE - order of widget init is important. Display must initialise before the bar so that the initial bar event will be caught

// init on document ready
$(document).ready(function () {
  // alert('init blockselect');
  $('.filter-display').not('.initialised').filterdisplay();
  $('.filter-bar').not('.initialised').filterbar();
});
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function (mutations, observer) {
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
