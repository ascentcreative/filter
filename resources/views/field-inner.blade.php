<h3>{{ $title }}</h3>

@php 

$value = request()->$filterName ?? []; 

$query = $model::query();
foreach($optionScopes as $scope) {
    $query->$scope();
}


$query = $query->withCount([

    ($relation . ' as model_count') => function($q) use ($filterName, $filterManager) {
        $data = request()->all();
        unset($data[$filterName]);
        $filterManager::getInstance()->applyToQuery($q, $data, true);
    }

])

// ->whereHas($relation); // filters out row with zero items (when unfiltered)
// ->having('model_count', '>', 0); // filters out items which become zero during filter process

@endphp

<div>
    @foreach( $query->get() as $opt)
        <label>
            <input name="{{ $filterName }}[]" type="checkbox" value="{{ $opt->$idField }}"
                @if($value == $opt->$idField || in_array($opt->$idField, $value)) checked @endif
            >
            <span class="label">{{ $opt->$labelField }}</span>
            @if(array_key_exists('model_count', $opt->getAttributes()))
                <span class="count" data-count="{{ $opt->model_count }}">{{ $opt->model_count }}</span>  
            @endif
        </label>
    @endforeach
</div>