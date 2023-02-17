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


            $(this.element).on('request-copydata', function(e, slug, triggerEvent) {
                self.copyData(e, slug, triggerEvent);
            });

            $(this.element).on('click', '.filter-export', function() {
                self.exportData();
            });

            // new page requested. 
            // alert('loaded');

            // handle loading of data on history navigation:
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
			
            this.initialState = {
               
            }

            let pathary = $(this.element).attr('action').split('/');
            let pop = pathary.pop();
            this.baseUri = (pathary.join('/'));


            this.element.addClass("initialised");
			
		},

        loadPage: function(e, page = 0) {
            console.log(e);
    
            // alert ('loading page' + page);

            let self = this;

            $(self.element).css('opacity', 0.2);

            // console.log($(this.element).serialize());

            var filterData = new FormData($(this.element)[0]);
            filterData.append('config', $(this.element).data('filtersetup'));

            // console.log(filterData);

            for (const pair of filterData.entries()) {
                console.log(`${pair[0]}, ${pair[1]}`);
              }

            var stringData =  $(this.element).find("INPUT, SELECT").not('[name=_token]').serialize();

            console.log(stringData);

            // we need to detect all the filter displays (probably only one)
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
                console.log('pushing state:', data);
                history.pushState(data, 'title', href + '?' + qs);
               

            }).then(function() {
                $(self.element).css('opacity', 1);
            });

            // submit a query to the filter route

            // update the DOM
        },

        copyData: function(e, col, triggerEvent) {

            // alert('copying ' + col);
            // console.log();
            let self = this;

            $(this.element).css('opacity', 0.2);

            var filterData = new FormData($(this.element)[0]);
            filterData.append('config', $(this.element).data('filtersetup'));

            // does an AJAX request to get ALL pages of data,not just current.
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

                let causer = triggerEvent.target;
                let rect = causer.getBoundingClientRect();
                let tRect = toast[0].getBoundingClientRect();

                $(toast).on('hidden.bs.toast', function () {
                    $(toast).remove();
                })
                $(toast).css('top', (rect.bottom) + window.scrollY + 'px').css('left', (rect.right - tRect.width) + 'px')
                        .toast('show');

                $(self.element).css('opacity', 1);


            }).fail(function(data) {
                alert('unable to copy data');
            });


        },

        exportData: function(e, col, triggerEvent) {
        
            window.location = this.baseUri + '/export?' + window.location.search;

        },

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

        }

       
}

$.widget('ascent.filterview', FilterView);
$.extend($.ascent.FilterView, {
		 
		
}); 

