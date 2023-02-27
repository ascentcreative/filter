<div class="filter-field">
    <h3>{{ $title }}</h3>

    @php
    
        $qSel = clone $query;
        $sel = $qSel->findMany($value);
        // @dump($sel);

    @endphp

   
    <div class="filter-drawer">

        <div class="filter-sub">
            <input type="text" placeholder="Type to filter options...">
        </div>

        <div class="filter-options">
            @foreach($query->get() as $opt)
                <label>
                    <input name="{{ $filterName }}[]" type="checkbox" value="{{ $opt->$idField }}"
                        @if($value == $opt->$idField || in_array($opt->$idField, $value)) checked @endif
                    >
                    <span>{{ $opt->$labelField }}</span>
                    {{-- <span class="count">{{ $opt->products_count }}</span>   --}}
                </label>
            @endforeach
        </div>

    </div>

    <div>
        @foreach($sel as $val) 
            <div class="badge badge-primary">{{ $val->$labelField }}</div>
        @endforeach
    </div>


</div>