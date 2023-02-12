// Code (c) Kieran Metcalfe / Ascent Creative 2023

$.ascent = $.ascent?$.ascent:{};

var FilterDataTable = {

    _init: function () {
            
        var self = this;
        this.widget = this;
        
        // Watch for change events within the element:
        // DISABLED - changes come via explicit button clicks,
        // - otherwise panels close too soon
        // $(this.element).on('change', function() {
        //     self.sendUpdate();
        // });

        // send initial event to trigger display load
        // self.sendUpdate();


        // handle clicks on filter / sort elements:
        $(this.element).on('click', '.filter-panel', function(e) {
            e.stopPropagation();
        });

        $(this.element).on('click', 'thead .filter-toggle', function(e) {
            e.preventDefault();
            
    
            $(this).parents('.filter').find('.filter-panel').slideDown(100, function() {
                
                panel = this;
    
                $('body').on('click', function(e) {
                    
                    //  console.log(e.target);
                        $(panel).slideUp(100, function() {
                            
                        });
        
                        $('body').unbind('click');
                        //, this);
                });
    
            });
    
            // e.stopPropagation();
    
        });

        $(this.element).on('click', 'thead .btn-filter-update', function(e) {
            
            self.sendUpdate();
            e.stopPropagation();
            e.preventDefault();

        });

        $(this.element).on('click', '.filter-clear', function(e) {

            e.preventDefault();

            $(this).parents('.filter-panel').find('input').each(function(idx) {
                if($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
                    $(this).prop('checked', false);
                } else {
                    $(this).val('');
                }
            });

            self.sendUpdate();

        });

        $(this.element).on('click', 'thead .sort-link', function(e) { 

            // set the hidden field to the new sort direction and fire a change event
            let th = $(this).parents("th");
            let slug = th.data('column');
            let sortfield = $(th).find('input#sort-' + slug);

            let sort = $(sortfield).val();

            // remove ALL sorters... otherwise a previous column will take precedence
            $(self.element).find('input.sort-dir').val('');
            
            // Apply this sort
            switch(sort) {
                case 'asc':
                    sort = 'desc';
                    break;
                case 'desc':
                    sort = '';
                    break;
                case '':
                    sort = 'asc';
                    break
            }

            $(sortfield).val(sort); //trigger('change');
            self.sendUpdate();
            
            e.preventDefault();
        });

        
        this.element.addClass("initialised");
        
    },

    // trigger an event which causes the display to load data
    sendUpdate: function() {
        
        // var filterData = new FormData($(this.element).find("form.filter-form")[0]);
        // var stringData =  $(this.element).find("form.filter-form INPUT, form.filter-form SELECT").not('[name=_token]').serialize();
        // $(this.element).trigger('filters-updated', [filterData, stringData]);
        $(this.element).trigger('filters-updated');

        // refresh UI (set classes based on filter and sorter values)
        this.refreshUI();
    },

    refreshUI: function() {

        // check all sorters and apply the right classes:
        $(this.element).find('A.sort-link')
            .removeClass('sort-link-asc').removeClass('sort-link-desc')
            .each(function(idx) {
                let sort = $(this).find('input.sort-dir').val();
                console.log(sort);
                if(sort != '') {
                    $(this).addClass('sort-link-' + sort);
                }
                console.log(idx);
            });


        // check all filters:
        // TODO: test with checkboxes / radiobuttons / multiple text etc
        $(this.element).find('.filter-toggle').removeClass('filter-active');
        $('.filter').each(function(idx) {

            if($(this).find('input').filter(function () {
                if($(this).attr('type') == 'text') {
                    return $(this).val() != '';
                } else {
                    return $(this).is(":checked"); //== 'checked';
                }
            }).length > 0) {
                $(this).find('.filter-toggle').addClass('filter-active');
            }
        });

        // close all panels
        $('.filter-panel').slideUp(100);
        $('body').unbind('click');

    }


    
    
       
}

$.widget('ascent.filterdatatable', FilterDataTable);
$.extend($.ascent.FilterDataTable, {
		 
		
}); 

