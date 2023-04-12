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
                    let tag = $('<div class="badge badge-primary mt-1 filter-tag" style="font-size: 0.9rem"><span class="filter-tag-text">' + ui.item.label + '</span><input type="hidden" name="' + $(self.element).data('filter-name') + '[]" value="' + ui.item.id + '"/><a href="#" class="remove-item bi-x-circle-fill pl-1" style="color: inherit"></a></div>');
                    $(this).parents('.filter-tags').find('.filter-tags-display').append(tag);
                    tag.trigger('change');
                    self.refreshUI();
                    return false;
                }
            });

            $(this.element).on('click', '.remove-item', function() {
                let parent = $(this).parents('.filter-tags-display');
                $(this).parents('.badge').remove();
                $(parent).trigger('change');
                self.refreshUI();
                return false;
            });

            this.refreshUI();

            this.element.addClass("initialised");
			
		},

        /* updates the UI, showing toggle switch and placeholder text as needed */
        /* See the comments in the CSS - this can be removed once FF supports :has() */
        refreshUI: function() {

            // if two or more values show toggleswitch:
            if($(this.element).find('.badge').length >= 2) {
                $(this.element).find('.toggle-switch').show();
                $(this.element).removeClass('show-placeholder');
            } else {
                $(this.element).find('.toggle-switch').hide();
                $(this.element).addClass('show-placeholder');
            }

        }

       

       
}

$.widget('ascent.filtertags', FilterTags);
$.extend($.ascent.FilterTags, {
		 
		
}); 




    //         
    //     });