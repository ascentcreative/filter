<div class="filter-tags mb-1" style="background: white; font-size: 1rem; border: 1px solid #ececec; padding: 0.2rem 0.5rem; border-right: 1px solid #ececec; xwidth: 100%"
    data-filter-source="{{ $source }}"
    data-filter-name="{{ $filterName }}"
    >
        
    <div style="display: grid; grid-template-columns: 1fr auto;">

        <input type="text"
            placeholder="{{ $title }}"
            style="border: none; width: 100%; outline: none;"
            class="filter-source"
            data-filter-ignore="1"
            />


        <div class="toggle-switch">
            <label for="{{ $filterName }}_join_any" tabindex="0"><input type="radio" id="{{ $filterName }}_join_any" name="{{ $filterName}}[join]" value="any" @if($join=="any") checked @endif/>Any</label>
            <label for="{{ $filterName }}_join_all" tabindex="0"><input type="radio" id="{{ $filterName }}_join_all" name="{{ $filterName}}[join]" value="all" @if($join=="all") checked @endif/>All</label>
        </div>

    </div>

    <div>
        <div class="filter-tags-display flex" style="gap: 0 5px;">
            {{-- {!! $valueModels !!} --}}
            @foreach($valueModels as $item) 
                <div class="badge badge-primary mt-1">
                    {{ $item->$labelField }}
                    <input type="hidden" name="{{ $filterName }}[]" value="{{ $item->$idField }}">
                    <a href="#" class="remove-item bi-x-circle-fill pl-1" style="color:inherit"></a>
                </div>
            @endforeach
        </div>
    </div>
    
</div>


