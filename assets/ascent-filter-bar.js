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
            // * ?disabled as the display now renders the first page on load *
            // self.sendUpdate();
            
            this.element.addClass("initialised");
			
		},

        // trigger an event which causes the display to load data
        sendUpdate: function() {
            $(this.element).trigger('filters-updated'); 
        }

       
}

$.widget('ascent.filterbar', FilterBar);
$.extend($.ascent.FilterBar, {
		 
		
}); 

