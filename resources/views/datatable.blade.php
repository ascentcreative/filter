@aware(['filterManager', 'items', 'values'])
{{-- @dump($attributes->getAttributes()) --}}
{{-- @dump($values) --}}
{{-- @dump(collect($builder->getColumns())->pluck('width')) --}}
<div class="filter-datatable {{ $attributes['class'] }}" style=" {{ $attributes['style'] }}"">
{{-- <form class="filter-form"> --}}
    {{-- @dump(session()->get('filter_state')) --}}

<table class="table filter-datatable-table"
    {{-- data-filtersetup="{{ Crypt::encryptString(json_encode($attributes->getAttributes())) }}" --}}
        style="grid-template-columns: {{ $filterManager::getInstance()->getGridColumns() }};"
        >
    
        <thead>
      {{-- for each column, render the header --}}
      @foreach($filterManager::getInstance()->getColumns() as $col) 

            @if($col->showTitle)
          
            <th class="@if($col->align) text-{{$col->align}} @endif @if($col->filterable) filterable @endif"  colspan="{{ $col->titleSpan }}" data-column="{{ $col->slug }}"
                  
                @if(!is_null($col->width)) width="{{ $col->width }}" @endif
            
                >
                
                <div class="flex" style="flex-wrap: nowrap;">

                @if($col->sortable)
                    <A href="{{ $col->buildSortUrl() }}" class="bi sort-link sort-link-{{ $values['sort'][$col->slug] ?? '' }}" style="flex-grow: 1">
                @else
                    <div style="flex-grow: 1">
                @endif

                @if($col->titleBlade)
                    @include($col->titleBlade)
                @else   
                    {{ $col->title }}
                @endif

                @if($col->sortable)
                        {{-- Hidden field to store the sort value so it persists on filter change --}}
                        {{-- <input type="hidden" class="sort-dir" id="sort-{{ $col->slug }}" name="sort[{{ $col->slug }}]" value="{{ request()->sort[$col->slug] ?? '' }}" /> --}}
                        <input type="hidden" class="sort-dir" id="sort-{{ $col->slug }}" name="sort[{{ $col->slug }}]" value="{{ $values['sort'][$col->slug] ?? '' }}" />
                    </A>
                   
                @else
                    </div>
                @endif  

                
                @if($col->filterable)

                    <div class="filter ml-1" style="display: inline-block">
                        
                        <A href="" class="bi filter-toggle @isset($values[$col->slug]) filter-active @endisset" data-toggle="filter-options" aria-haspopup="true" aria-expanded="false"></A>
                        <div class="filter-panel" aria-labelledby="">
                            
                            <div class="filter-options font-weight-normal">

                                @includeFirst([$col->filterBlade, 'filter::ui.filters.text'], $col->getFilterBladeParameters())
                                
                                <div class="flex flex-between flex-nowrap mt-2">
                                    <small><a href="{{ $col->buildClearFilterUrl() }}" class="filter-clear mr-2">Clear</a></small>
                                    <button class="btn btn-sm btn-primary ml-2 btn-filter-update">Update</button>
                                </div>

                            </div>

                        </div>
                        </div>

                @endif

                @if($col->copyable)

                    <div class="copyable ml-1" style="display: inline-block">
                        <A href="#" class="bi-clipboard copy-link" style="flex-grow: 1"></A>
                    </div>

                @endif

                </div>


            </th>
            @endif

        @endforeach  

    </thead>

    <x-filter-page
        tag="tbody"
        {{-- dataTableBuilder="{{ get_class($builder) }}" --}}
        filterManager="{{ $filterManager }}"
        itemBlade="filter::datatablerow"
        {{-- :columns="$builder->getColumns()" --}}
        />

    </table>

  

{{-- </form> --}}

</div>

