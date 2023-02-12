// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterView = {
        
		_init: function () {
            
			var self = this;
			this.widget = this;

           
            // filter options have been changed
            // - should reload first page
            $(this.element).on('filters-updated', function(e) {
                self.loadPage(e);
            });

            // new page requested. 
			
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
                url: '/filter/loadpage',
                type: 'post',  
                data: filterData,
                contentType: false,
                processData: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            }).done(function(data) {

                for(const id in data.displays) {
                    $(self.element).find('.filter-display#' + id).html(data.displays[id]);
                };

                for(const id in data.paginators) {
                    $(self.element).find('.filter-paginator#' + id).html(data.paginators[id]);
                }

                for(const id in data.counters) {
                    $(self.element).find('.filter-counter#' + id).html(data.counters[id]);
                }

                // pushState:
                // call the History API to update the URL in the browser:
                // or, maybe this should be done by the display when the first page is loaded, so the results can be stored?
                let href = window.location.pathname;
                history.pushState({'data': data}, 'title', href + '?' + qs);
               

            }).then(function() {
                $(self.element).css('opacity', 1);
            });

            // submit a query to the filter route

            // update the DOM
        }

       
}

$.widget('ascent.filterview', FilterView);
$.extend($.ascent.FilterView, {
		 
		
}); 

