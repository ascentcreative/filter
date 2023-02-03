{{-- <x-cms-form-blockselect columns="1" name="cfilter[{{ $name }}]" xmaxSelect="1" :options="$opts" wrapper="simple" label="" :value="request()->cfilter[$name] ?? []"/> --}}

    @isset($textFilter)
        @if($textFilter)
            <input type="text" class="option-filter form-control py-0 mb-2" placeholder="Filter options..."/>
        @endif
    @endisset

    <div class="flex flex-column flex-nowrap" style="@isset($maxHeight) max-height: {{ $maxHeight }}; overflow-y: scroll; @endisset">
        <x-cms-form-options type="checkboxes" name="{{ $name }}" wrapper="none" label="" :value="request()->$name ?? []" :options="$opts" />
    </div>

    @once
        @push('scripts')
            <script>
            
                $(document).on('keyup', '.option-filter', function(e) {
                    // console.log(e.target);
                    // console.log($(e.target).parents('.filter-panel').find('label'));
                    let val = $(this).val();
                    $(e.target).parents('.filter-panel').find('label').show()
                            .filter(function(index){
          
                                if($(this).find('input[type=checkbox]').is(':checked')) {
                                    return false;
                                }
                                return ($(this).find('span').text().toLowerCase().indexOf(val.toLowerCase()) == -1);

                            }).hide();


                });

            </script>
        @endpush
    @endonce
    {{-- <button class="filter-submit">Go</button> --}}
    
