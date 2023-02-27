// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterTags = {
        
		_init: function () {
            
			var self = this;
			this.widget = this;
			
            $(this.element).find('.filter-source').autocomplete({
                source: $(this.element).data('filter-source'),
                select: function(event, ui) {
                    console.log(event, ui);
                    console.log($(this).val());
                    $(this).val('');
                    let tag = $('<div class="badge badge-primary mt-1" style="font-size: 0.9rem">' + ui.item.label + '<input type="hidden" name="' + $(self.element).data('filter-name') + '[]" value="' + ui.item.id + '"/><a href="#" class="remove-item bi-x-circle-fill pl-1" style="color: inherit"></a></div>');
                    $(this).parents('.filter-tags').find('.filter-tags-display').append(tag);
                    tag.trigger('change');
                    return false;
                }
            });

            $(this.element).on('click', '.remove-item', function() {
                let parent = $(this).parents('.filter-tags-display');
                $(this).parents('.badge').remove();
                $(parent).trigger('change');
                return false;
            });

            this.element.addClass("initialised");
			
		},

       

       
}

$.widget('ascent.filtertags', FilterTags);
$.extend($.ascent.FilterTags, {
		 
		
}); 




    //         
    //     });