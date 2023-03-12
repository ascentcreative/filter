<h3>{{ $title }}</h3>

{{-- @dump($value); --}}
@php 

$value = request()->$filterName ?? []; 

$query = $model::withCount([

    ($relation . ' as model_count') => function($q) use ($filterName, $filterManager) {
        // $mgr = \App\Filters\CatalogueFilter::getInstance();
        $data = request()->all();
        unset($data[$filterName]);
        $filterManager::getInstance()->applyToQuery($q, $data, true);
    }

])->having('model_count', '>', 0);

@endphp

<div>
    {{-- @foreach( (($model)::filterOptions($fm))->get() as $opt) --}}
    {{-- @foreach( (($model)::$scope())->get() as $opt) --}}
    @foreach( $query->get() as $opt)
        <label>
            <input name="{{ $filterName }}[]" type="checkbox" value="{{ $opt->$idField }}"
                @if($value == $opt->$idField || in_array($opt->$idField, $value)) checked @endif
            >
            <span class="label">{{ $opt->$labelField }}</span>
            <span class="count" data-count="{{ $opt->model_count }}">{{ $opt->model_count }}</span>  
        </label>
    @endforeach
</div>