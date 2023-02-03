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
    self.sendUpdate();

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
    var filterData = new FormData($(this.element).find("form.filter-form")[0]);
    var stringData = $(this.element).find("form.filter-form INPUT, form.filter-form SELECT").not('[name=_token]').serialize();
    $(this.element).trigger('filters-updated', [filterData, stringData]);

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
      console.log(data);
      console.log(strData);
      for (x in data.keys) {
        console.log(x);
      }
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
      processData: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    }).done(function (data) {
      // console.log(data);
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
  $('.filter-datatable').not('.initialised').filterdatatable();
});
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function (mutations, observer) {
  // fired when a mutation occurs
  // console.log(mutations, observer);
  // ...
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
