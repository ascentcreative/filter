// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterBar = {
        
		_init: function () {
            
			var self = this;
			this.widget = this;
			
            // Watch for change events within the element:
            $(this.element).on('change', function() {
                self.sendUpdate();
                // alert('filter change detected');
               
            });

            // send initial event to trigger display load
            self.sendUpdate();
            
            this.element.addClass("initialised");
			
		},

        // trigger an event which causes the display to load data
        sendUpdate: function() {
            var filterData = new FormData($(this.element).find("form.filter-form")[0]);
            var stringData =  $(this.element).find("form.filter-form INPUT, form.filter-form SELECT").not('[name=_token]').serialize();
            $(this.element).trigger('filters-updated', [filterData, stringData]);
        }

       
}

$.widget('ascent.filterbar', FilterBar);
$.extend($.ascent.FilterBar, {
		 
		
}); 

