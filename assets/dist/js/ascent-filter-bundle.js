// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent ? $.ascent : {};
var FilterBar = {
  _init: function _init() {
    var self = this;
    this.widget = this;

    // Watch for change events within the element:
    $(this.element).on('change', function (e) {
      if ($(e.target).data('filter-ignore') != 1) {
        self.sendUpdate();
      }

      // alert('filter change detected');  
    });

    // send initial event to trigger display load
    // * ?disabled as the display now renders the first page on load *
    // self.sendUpdate();

    this.element.addClass("initialised");
  },
  // trigger an event which causes the display to load data
  sendUpdate: function sendUpdate() {
    $(this.element).trigger('filters-updated');
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

    // send initial event to trigger display load
    // * ?disabled as the display now renders the first page on load *
    // self.sendUpdate();

    // handle clicks on filter / sort elements:
    $(this.element).on('click', '.filter-panel', function (e) {
      e.stopPropagation();
    });
    $(this.element).on('click', 'thead .filter-toggle', function (e) {
      e.preventDefault();
      // open the panel
      $(this).parents('.filter').find('.filter-panel').slideDown(100, function () {
        panel = this;

        // handle close on click outside
        $('body').on('click', function (e) {
          $(panel).slideUp(100);
          $('body').unbind('click');
        });
      });
    });

    // click the update button in the panel
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
    $(this.element).on('click', 'thead .copy-link', function (e) {
      var th = $(this).parents("th");
      var slug = th.data('column');
      $(self.element).trigger('request-copydata', [slug, e]);
      return false;
    });
    this.element.addClass("initialised");
  },
  // trigger an event which causes the display to load data
  sendUpdate: function sendUpdate() {
    // send the event
    $(this.element).trigger('filters-updated');

    // refresh UI (set classes based on filter and sorter values)
    this.refreshUI();
  },
  refreshUI: function refreshUI() {
    // check all sorters and apply the right classes:
    $(this.element).find('A.sort-link').removeClass('sort-link-asc').removeClass('sort-link-desc').each(function (idx) {
      var sort = $(this).find('input.sort-dir').val();
      if (sort != '') {
        $(this).addClass('sort-link-' + sort);
      }
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

    // hmm - it would appear that this widget is now redundant. 
    // All the code has been moved to the FilterView.
  }
};

$.widget('ascent.filterdisplay', FilterDisplay);
$.extend($.ascent.FilterDisplay, {});

// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent ? $.ascent : {};
var FilterTags = {
  _init: function _init() {
    var self = this;
    this.widget = this;
    $(this.element).find('.filter-source').autocomplete({
      source: $(this.element).data('filter-source'),
      select: function select(event, ui) {
        console.log(event, ui);
        console.log($(this).val());
        $(this).val('');
        var tag = $('<div class="badge badge-primary mt-1" style="font-size: 0.9rem">' + ui.item.label + '<input type="hidden" name="' + $(self.element).data('filter-name') + '[]" value="' + ui.item.id + '"/><a href="#" class="remove-item bi-x-circle-fill pl-1" style="color: inherit"></a></div>');
        $(this).parents('.filter-tags').find('.filter-tags-display').append(tag);
        tag.trigger('change');
        return false;
      }
    });
    $(this.element).on('click', '.remove-item', function () {
      var parent = $(this).parents('.filter-tags-display');
      $(this).parents('.badge').remove();
      $(parent).trigger('change');
      return false;
    });
    this.element.addClass("initialised");
  }
};
$.widget('ascent.filtertags', FilterTags);
$.extend($.ascent.FilterTags, {});

//         
//     });
// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent ? $.ascent : {};
var FilterView = {
  initialState: null,
  baseUri: '',
  _init: function _init() {
    var self = this;
    this.widget = this;

    // filter options have been changed
    // - should reload first page
    $(this.element).on('filters-updated', function (e) {
      self.loadPage(e);
    });

    // user requested a copy operation (on a DataTable)
    $(this.element).on('request-copydata', function (e, slug, triggerEvent) {
      self.copyData(e, slug, triggerEvent);
    });

    // user requested an data export:
    $(this.element).on('click', '.filter-export', function () {
      self.exportData();
    });

    // handle loading of data on history navigation:
    // TODO - slightly problematic with re-initialising the UI elements
    // - perhaps de-intialise and then replace (triggering a reinit)
    window.onpopstate = function (e) {
      // alert('going back');
      console.log(e);
      // console.log(e.state.data);
      if (e.state) {
        self.setState(e.state);
        // $(self.element).html(e.state); // set display data
      } else {
        //$(self.element).html(self.initialState);
      }
      // also need to change the filter form data...
    };

    // Work out the base path for all the ajax operations
    var pathary = $(this.element).attr('action').split('/');
    var pop = pathary.pop();
    this.baseUri = pathary.join('/');

    // flag as initialised.
    this.element.addClass("initialised");
  },
  // Handles an Ajax call to load a page of results and related UI updates
  loadPage: function loadPage(e) {
    var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var self = this;

    // $(self.element).css('opacity', 0.2);
    $(self.element).addClass('filter-updating');
    var filterData = new FormData($(this.element)[0]);
    filterData.append('config', $(this.element).data('filtersetup'));

    // we need to detect all the filter UIs 
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
    var filterfields = {};
    $(this.element).find('.filter-field').each(function (idx) {
      console.log(idx);
      filterfields[$(this).attr('id')] = $(this).data('config');
    });
    filterData.append('fields', JSON.stringify(filterfields));
    var qs = $(this.element).find("INPUT, SELECT").not('[name=_token]').serialize();
    $.ajax({
      url: this.baseUri + "/loadpage",
      type: 'post',
      data: filterData,
      contentType: false,
      processData: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    }).done(function (data) {
      self.setState(data);

      // pushState:
      // call the History API to update the URL in the browser:
      // or, maybe this should be done by the display when the first page is loaded, so the results can be stored?
      var href = window.location.pathname;
      history.pushState(data, 'title', href + '?' + qs);
    }).then(function () {
      $(self.element).removeClass('filter-updating');
      // $(self.element).css('opacity', 1);
    });
  },

  // Updates the UI after a page load operation (or a popstate change)
  setState: function setState(data) {
    for (var id in data.displays) {
      $(this.element).find('.filter-display#' + id).html(data.displays[id]);
    }
    ;
    for (var _id in data.paginators) {
      $(this.element).find('.filter-paginator#' + _id).html(data.paginators[_id]);
    }
    for (var _id2 in data.counters) {
      $(this.element).find('.filter-counter#' + _id2).html(data.counters[_id2]);
    }
    for (var _id3 in data.fields) {
      $(this.element).find('.filter-field#' + _id3).html(data.fields[_id3]);
    }
  },
  // Handle an ajax call to fetch data and copy to the clipboard on success
  // Also display a 'copied' toast.
  copyData: function copyData(e, col, triggerEvent) {
    var self = this;

    // $(this.element).css('opacity', 0.2);
    $(this.element).addClass('filter-updating');
    var filterData = new FormData($(this.element)[0]);
    filterData.append('config', $(this.element).data('filtersetup'));

    // does an AJAX request to get ALL pages of data, not just current.
    $.ajax({
      url: this.baseUri + '/copy/' + col,
      type: 'post',
      data: filterData,
      contentType: false,
      processData: false,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      }
    }).done(function (data) {
      var copyFrom = document.createElement("textarea");
      document.body.appendChild(copyFrom);
      copyFrom.textContent = data.data;
      copyFrom.select();
      document.execCommand("copy");
      copyFrom.remove();
      var toast = $(data.toast);
      $('body').append(toast);

      // Get positioning Rects
      var causer = triggerEvent.target;
      var rect = causer.getBoundingClientRect();
      var tRect = toast[0].getBoundingClientRect();

      // delete from the DOM once faded out
      $(toast).on('hidden.bs.toast', function () {
        $(toast).remove();
      });

      // Position the toast near the calling button. 
      $(toast).css('top', rect.bottom + window.scrollY + 'px').css('left', rect.right - tRect.width + 'px').toast('show');

      // $(self.element).css('opacity', 1);
      $(self.element).removeClass('filter-updating');
    }).fail(function (data) {
      // need to be more helpful here...
      alert('Unable to copy data');
    });
  },
  // Perform a data export. Essentially just a get request with the current QueryString
  exportData: function exportData(e, col, triggerEvent) {
    window.location = this.baseUri + '/export' + window.location.search;
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
  $('.filter-tags').not('.initialised').filtertags();
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
  $('.filter-tags').not('.initialised').filtertags();
  $('.filter-datatable').not('.initialised').filterdatatable();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  childList: true
  //...
});
