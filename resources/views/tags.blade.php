<div class="filter-tags" style=""
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


        <x-forms-fields-toggleswitch label="" wrapper="none" value="{{ $join ?? 'any' }}" name="{{ $filterName}}[join]" :options="['any'=>'Any', 'all'=>'All']" />

    </div>

    <div class="filter-tags-display flex" style="gap: 0 5px;">
        {{-- {!! $valueModels !!} --}}
        @foreach($valueModels as $item) 
            <div class="badge badge-primary mt-1 filter-tag">
                <span class="filter-tag-text">{{ $item->$labelField }}</span>
                <input type="hidden" name="{{ $filterName }}[]" value="{{ $item->$idField }}">
                <a href="#" class="remove-item bi-x-circle-fill pl-1" style="color:inherit"></a>
            </div>
        @endforeach
    </div>

    
</div>


