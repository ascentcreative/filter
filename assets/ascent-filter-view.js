// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterView = {

    initialState: null,
    baseUri: '',
        
		_init: function () {
            
			var self = this;
			this.widget = this;

            // filter options have been changed
            // - should reload first page
            $(this.element).on('filters-updated', function(e) {
                self.loadPage(e);
            });

            // user requested a copy operation (on a DataTable)
            $(this.element).on('request-copydata', function(e, slug, triggerEvent) {
                self.copyData(e, slug, triggerEvent);
            });

            // user requested an data export:
            $(this.element).on('click', '.filter-export', function() {
                self.exportData();
            });

            
            // handle loading of data on history navigation:
            // TODO - slightly problematic with re-initialising the UI elements
            // - perhaps de-intialise and then replace (triggering a reinit)
            window.onpopstate = function(e) {
                // alert('going back');
                console.log(e);
                // console.log(e.state.data);
                if(e.state) {
                    self.setState(e.state);
                    // $(self.element).html(e.state); // set display data
                } else {
                    //$(self.element).html(self.initialState);
                }
                // also need to change the filter form data...
            };
			
            // Work out the base path for all the ajax operations
            let pathary = $(this.element).attr('action').split('/');
            let pop = pathary.pop();
            this.baseUri = (pathary.join('/'));

            // flag as initialised.
            this.element.addClass("initialised");
			
		},

        
        // Handles an Ajax call to load a page of results and related UI updates
        loadPage: function(e, page = 0) {
    
            let self = this;

            // $(self.element).css('opacity', 0.2);
            $(self.element).addClass('filter-updating');

            var filterData = new FormData($(this.element)[0]);
            filterData.append('config', $(this.element).data('filtersetup'));

            // we need to detect all the filter UIs 
            // and get their config information (itemBlade for example). The Ajax call will render each view into the JSON reply

            let displays = {};
            $(this.element).find('.filter-display').each(function(idx) {
                displays[$(this).attr('id')] = $(this).data('config');
            });
            filterData.append('displays', JSON.stringify(displays));

            let counters = {};
            $(this.element).find('.filter-counter').each(function(idx) {
                counters[$(this).attr('id')] = $(this).data('config');
            });
            filterData.append('counters', JSON.stringify(counters));

            let paginators = {};
            $(this.element).find('.filter-paginator').each(function(idx) {
                paginators[$(this).attr('id')] = $(this).data('config');
            });
            filterData.append('paginators', JSON.stringify(paginators));

            let filterfields = {};
            $(this.element).find('.filter-field').each(function(idx) {
                console.log(idx);
                filterfields[$(this).attr('id')] = $(this).data('config');
            });
            filterData.append('fields', JSON.stringify(filterfields));


            let qs = $(this.element).find("INPUT, SELECT").not('[name=_token]').serialize();
            
            $.ajax({ 
                url: this.baseUri + "/loadpage",
                type: 'post',  
                data: filterData,
                contentType: false,
                processData: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            }).done(function(data) {

                self.setState(data);

                // pushState:
                // call the History API to update the URL in the browser:
                // or, maybe this should be done by the display when the first page is loaded, so the results can be stored?
                let href = window.location.pathname;
                history.pushState(data, 'title', href + '?' + qs);

            }).then(function() {
                $(self.element).removeClass('filter-updating');
                // $(self.element).css('opacity', 1);
            });

        },


        // Updates the UI after a page load operation (or a popstate change)
        setState: function(data) {

            for(const id in data.displays) {
                $(this.element).find('.filter-display#' + id).html(data.displays[id]);
            };

            for(const id in data.paginators) {
                $(this.element).find('.filter-paginator#' + id).html(data.paginators[id]);
            }

            for(const id in data.counters) {
                $(this.element).find('.filter-counter#' + id).html(data.counters[id]);
            }

            for(const id in data.fields) {
                $(this.element).find('.filter-field#' + id).html(data.fields[id]);
            }

        },


        // Handle an ajax call to fetch data and copy to the clipboard on success
        // Also display a 'copied' toast.
        copyData: function(e, col, triggerEvent) {

            let self = this;

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
            }).done(function(data) {

                let copyFrom = document.createElement("textarea");
		        document.body.appendChild(copyFrom);
		        copyFrom.textContent = data.data;
		        copyFrom.select();
		        document.execCommand("copy");
		        copyFrom.remove();

                let toast = $(data.toast);
                $('body').append(toast);

                // Get positioning Rects
                let causer = triggerEvent.target;
                let rect = causer.getBoundingClientRect();
                let tRect = toast[0].getBoundingClientRect();

                // delete from the DOM once faded out
                $(toast).on('hidden.bs.toast', function () {
                    $(toast).remove();
                })

                // Position the toast near the calling button. 
                $(toast).css('top', (rect.bottom) + window.scrollY + 'px').css('left', (rect.right - tRect.width) + 'px')
                        .toast('show');

                // $(self.element).css('opacity', 1);
                $(self.element).removeClass('filter-updating');


            }).fail(function(data) {
                // need to be more helpful here...
                alert('Unable to copy data');
            });


        },

        // Perform a data export. Essentially just a get request with the current QueryString
        exportData: function(e, col, triggerEvent) {
            window.location = this.baseUri + '/export' + window.location.search;
        }

        

       
}

$.widget('ascent.filterview', FilterView);
$.extend($.ascent.FilterView, {
		 
		
}); 

