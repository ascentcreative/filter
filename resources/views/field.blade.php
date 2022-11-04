<div class="filter-field">
    <h3>{{ $title }}</h3>
    <div>
        @foreach($query->get() as $opt)
        <label><input name="{{ $filterName }}[]" type="checkbox" value="{{ $opt->$idField }}">{{ $opt->$labelField }}</label>
        @endforeach
    </div>
</div>