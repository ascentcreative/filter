function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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
    // * ?disabled as the display now renders the first page on load *
    // self.sendUpdate();

    this.element.addClass("initialised");
  },
  // trigger an event which causes the display to load data
  sendUpdate: function sendUpdate() {
    // var filterData = new FormData($(this.element).find("form.filter-form")[0]);
    // var stringData =  $(this.element).find("form.filter-form INPUT, form.filter-form SELECT").not('[name=_token]').serialize();
    $(this.element).trigger('filters-updated'); //, [filterData, stringData]);
  }
};

$.widget('ascent.filterbar', FilterBar);
$.extend($.ascent.FilterBar, {});

// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent ? $.ascent : {};
var FilterDataTable = {
  _init: function _init() {
    var self = this;
    this.widget = this;

    // Watch for change events within the element:
    // DISABLED - changes come via explicit button clicks,
    // - otherwise panels close too soon
    // $(this.element).on('change', function() {
    //     self.sendUpdate();
    // });

    // send initial event to trigger display load
    // self.sendUpdate();

    // handle clicks on filter / sort elements:
    $(this.element).on('click', '.filter-panel', function (e) {
      e.stopPropagation();
    });
    $(this.element).on('click', 'thead .filter-toggle', function (e) {
      e.preventDefault();
      $(this).parents('.filter').find('.filter-panel').slideDown(100, function () {
        panel = this;
        $('body').on('click', function (e) {
          //  console.log(e.target);
          $(panel).slideUp(100, function () {});
          $('body').unbind('click');
          //, this);
        });
      });

      // e.stopPropagation();
    });

    $(this.element).on('click', 'thead .btn-filter-update', function (e) {
      self.sendUpdate();
      e.stopPropagation();
      e.preventDefault();
    });
    $(this.element).on('click', '.filter-clear', function (e) {
      e.preventDefault();
      $(this).parents('.filter-panel').find('input').each(function (idx) {
        if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
          $(this).prop('checked', false);
        } else {
          $(this).val('');
        }
      });
      self.sendUpdate();
    });
    $(this.element).on('click', 'thead .sort-link', function (e) {
      // set the hidden field to the new sort direction and fire a change event
      var th = $(this).parents("th");
      var slug = th.data('column');
      var sortfield = $(th).find('input#sort-' + slug);
      var sort = $(sortfield).val();

      // remove ALL sorters... otherwise a previous column will take precedence
      $(self.element).find('input.sort-dir').val('');

      // Apply this sort
      switch (sort) {
        case 'asc':
          sort = 'desc';
          break;
        case 'desc':
          sort = '';
          break;
        case '':
          sort = 'asc';
          break;
      }
      $(sortfield).val(sort); //trigger('change');
      self.sendUpdate();
      e.preventDefault();
    });
    this.element.addClass("initialised");
  },
  // trigger an event which causes the display to load data
  sendUpdate: function sendUpdate() {
    // var filterData = new FormData($(this.element).find("form.filter-form")[0]);
    // var stringData =  $(this.element).find("form.filter-form INPUT, form.filter-form SELECT").not('[name=_token]').serialize();
    // $(this.element).trigger('filters-updated', [filterData, stringData]);
    $(this.element).trigger('filters-updated');

    // refresh UI (set classes based on filter and sorter values)
    this.refreshUI();
  },
  refreshUI: function refreshUI() {
    // check all sorters and apply the right classes:
    $(this.element).find('A.sort-link').removeClass('sort-link-asc').removeClass('sort-link-desc').each(function (idx) {
      var sort = $(this).find('input.sort-dir').val();
      console.log(sort);
      if (sort != '') {
        $(this).addClass('sort-link-' + sort);
      }
      console.log(idx);
    });

    // check all filters:
    // TODO: test with checkboxes / radiobuttons / multiple text etc
    $(this.element).find('.filter-toggle').removeClass('filter-active');
    $('.filter').each(function (idx) {
      if ($(this).find('input').filter(function () {
        if ($(this).attr('type') == 'text') {
          return $(this).val() != '';
        } else {
          return $(this).is(":checked"); //== 'checked';
        }
      }).length > 0) {
        $(this).find('.filter-toggle').addClass('filter-active');
      }
    });

    // close all panels
    $('.filter-panel').slideUp(100);
    $('body').unbind('click');
  }
};
$.widget('ascent.filterdatatable', FilterDataTable);
$.extend($.ascent.FilterDataTable, {});

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
      // console.log(data);
      // console.log(strData);

      // for(x in data.keys) {
      //     console.log(x);
      // }

      // self.setFilterData(data, strData); // store the filter options so we can send paginated requests
      // self.loadPage(0); // new filter data causes a reload of the results
    });

    // handle loading of data on history navigation:
    window.onpopstate = function (e) {
      $(self.element).html(e.state.data); // set display data
      // also need to change the filter form data...
    };
  }

  // setFilterData: function(data, strData) {
  //     this.filterData = data;
  //     this.filterData.append('config', $(this.element).data('filtersetup'));
  //     this.queryString = strData;
  // },

  // loadPage: function(idx) {

  //     // alert ('loading page' + idx);

  //     let self = this;

  //     $(self.element).css('opacity', 0.2);

  //     $.ajax({ 
  //         url: '/filter/loadpage',
  //         type: 'post',  
  //         data: self.filterData,
  //         contentType: false,
  //         processData: false,
  //         headers: {
  //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  //         }
  //     }).done(function(data) {

  //         // console.log(data);
  //         $(self.element).html(data);

  //         // pushState:
  //         // call the History API to update the URL in the browser:
  //         // or, maybe this should be done by the display when the first page is loaded, so the results can be stored?
  //         let href = window.location.pathname;
  //         history.pushState({'data': data}, 'title', href + '?' + self.queryString);

  //     }).then(function() {
  //         $(self.element).css('opacity', 1);
  //     });

  // submit a query to the filter route

  // update the DOM

  // also need to handle if this is a hidden set or not (for infinite scroll)
  // }
};

$.widget('ascent.filterdisplay', FilterDisplay);
$.extend($.ascent.FilterDisplay, {});

// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent ? $.ascent : {};
var FilterView = {
  _init: function _init() {
    var self = this;
    this.widget = this;

    // filter options have been changed
    // - should reload first page
    $(this.element).on('filters-updated', function (e) {
      self.loadPage(e);
    });

    // new page requested. 

    this.element.addClass("initialised");
  },
  loadPage: function loadPage(e) {
    var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    console.log(e);

    // alert ('loading page' + page);

    var self = this;
    $(self.element).css('opacity', 0.2);

    // console.log($(this.element).serialize());

    var filterData = new FormData($(this.element)[0]);
    filterData.append('config', $(this.element).data('filtersetup'));

    // console.log(filterData);
    var _iterator = _createForOfIteratorHelper(filterData.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var pair = _step.value;
        console.log("".concat(pair[0], ", ").concat(pair[1]));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var stringData = $(this.element).find("INPUT, SELECT").not('[name=_token]').serialize();
    console.log(stringData);

    // we need to detect all the filter displays (probably only one)
    // and get their config information (itemBlade for example). The Ajax call will render each view into the JSON reply

    var displays = {};
    $(this.element).find('.filter-display').each(function (idx) {
      displays[$(this).attr('id')] = $(this).data('config');
    });
    filterData.append('displays', JSON.stringify(displays));
    var counters = {};
    $(this.element).find('.filter-counter').each(function (idx) {
      counters[$(this).attr('id')] = $(this).data('config');
    });
    filterData.append('counters', JSON.stringify(counters));
    var paginators = {};
    $(this.element).find('.filter-paginator').each(function (idx) {
      paginators[$(this).attr('id')] = $(this).data('config');
    });
    filterData.append('paginators', JSON.stringify(paginators));
    var qs = $(this.element).find("INPUT, SELECT").not('[name=_token]').serialize();
    $.ajax({
      url: '/filter/loadpage',
      type: 'post',
      data: filterData,
      contentType: false,
      processData: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    }).done(function (data) {
      for (var id in data.displays) {
        $(self.element).find('.filter-display#' + id).html(data.displays[id]);
      }
      ;
      for (var _id in data.paginators) {
        $(self.element).find('.filter-paginator#' + _id).html(data.paginators[_id]);
      }
      for (var _id2 in data.counters) {
        $(self.element).find('.filter-counter#' + _id2).html(data.counters[_id2]);
      }

      // pushState:
      // call the History API to update the URL in the browser:
      // or, maybe this should be done by the display when the first page is loaded, so the results can be stored?
      var href = window.location.pathname;
      history.pushState({
        'data': data
      }, 'title', href + '?' + qs);
    }).then(function () {
      $(self.element).css('opacity', 1);
    });

    // submit a query to the filter route

    // update the DOM
  }
};

$.widget('ascent.filterview', FilterView);
$.extend($.ascent.FilterView, {});

// Code (c) Kieran Metcalfe / Ascent Creative 2023

//  NOTE - order of widget init is important. Display must initialise before the bar so that the initial bar event will be caught

// init on document ready
$(document).ready(function () {
  // alert('init blockselect');

  $('.filter-view').not('.initialised').filterview();
  $('.filter-display').not('.initialised').filterdisplay();
  $('.filter-bar').not('.initialised').filterbar();
  $('.filter-datatable').not('.initialised').filterdatatable();
});
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function (mutations, observer) {
  // fired when a mutation occurs
  // console.log(mutations, observer);
  // ...
  $('.filter-view').not('.initialised').filterview();
  $('.filter-display').not('.initialised').filterdisplay();
  $('.filter-bar').not('.initialised').filterbar();
  $('.filter-datatable').not('.initialised').filterdatatable();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  childList: true
  //...
});
