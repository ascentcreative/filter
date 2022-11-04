// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterDisplay = {

        filterData: null,
        queryString: null,
        
		_init: function () {
            

			var self = this;
			this.widget = this;

            this.element.addClass("initialised"); 

            // listen for change events from the filter bar:
            $(document).on('filters-updated', function(e, data, strData) {
                console.log(data);
                console.log(strData);
                self.setFilterData(data, strData); // store the filter options so we can send paginated requests
                self.loadPage(0); // new filter data causes a reload of the results
            });

            // handle loading of data on history navigation:
            window.onpopstate = function(e) {
                $(self.element).html(e.state.data); // set display data
                // also need to change the filter form data...
            };
	
		},


        setFilterData: function(data, strData) {
            this.filterData = data;
            this.filterData.append('config', $(this.element).data('filtersetup'));
            this.queryString = strData;
        },

        loadPage: function(idx) {

            // alert ('loading page' + idx);

            let self = this;

            $(self.element).css('opacity', 0.2);
        
            $.ajax({ 
                url: '/filter/loadpage',
                type: 'post',  
                data: self.filterData,
                contentType: false,
                processData: false 
            }).done(function(data) {

                console.log(data);
                $(self.element).html(data);

                // pushState:
                // call the History API to update the URL in the browser:
                // or, maybe this should be done by the display when the first page is loaded, so the results can be stored?
                let href = window.location.pathname;
                history.pushState({'data': data}, 'title', href + '?' + self.queryString);
               

            }).then(function() {
                $(self.element).css('opacity', 1);
            });

            // submit a query to the filter route

            // update the DOM


            // also need to handle if this is a hidden set or not (for infinite scroll)
        }

       
}

$.widget('ascent.filterdisplay', FilterDisplay);
$.extend($.ascent.FilterDisplay, {
		 
		
}); 

