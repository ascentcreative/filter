<div class="filter-field">
    <h3>{{ $title }}</h3>

    <div>
        @foreach($query->get() as $opt)
            <label>
                <input name="{{ $filterName }}[]" type="checkbox" value="{{ $opt->$idField }}"
                    @if($value == $opt->$idField || in_array($opt->$idField, $value)) checked @endif
                >
                {{ $opt->$labelField }}
                {{-- <span class="count">{{ $opt->products_count }}</span>   --}}
            </label>
        @endforeach
    </div>

</div>