// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterBar = {
        
		_init: function () {
            
			var self = this;
			this.widget = this;
			
            // Watch for change events within the element:
            $(this.element).on('change', function(e) {
                
                // if the element is marked filter ignore, don't trigger an update
                if($(e.target).data('filter-ignore') == 1 || $(e.target).hasClass('filter-ignore')) {
                    console.log('skipping filter update - element is marked filter-ignore', e.target)
                   return;
                }

                // if the element is within a filter-ignore element (i.e. come form of compound element),
                // also don't trigger the update
                if($(e.target).parents('[data-filter-ignore=1], .filter-ignore').length > 0) {
                    console.log('skipping filter update - parent is marked filter-ignore')
                    return;
                }

                
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

