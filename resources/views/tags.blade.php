<div class="filter-tags mb-1" style="background: white; font-size: 1rem; border: 1px solid #ececec; padding: 0.2rem 0.5rem; border-right: 1px solid #ececec; xwidth: 100%"
    data-filter-source="{{ $source }}"
    data-filter-name="{{ $filterName }}"
    >
        
    <input type="text"
        placeholder="{{ $title }}"
        style="border: none; width: 100%; outline: none;"
        class="filter-source"
        data-filter-ignore="1"
        />

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


