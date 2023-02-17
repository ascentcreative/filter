// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterDisplay = {

        filterData: null,
        queryString: null,
        
		_init: function () {
            

			var self = this;
			this.widget = this;

            this.element.addClass("initialised"); 

            // hmm - it would appear that this widget is now redundant. 
            // All the code has been moved to the FilterView.
	
		},
       
}

$.widget('ascent.filterdisplay', FilterDisplay);
$.extend($.ascent.FilterDisplay, {
		 
		
}); 

