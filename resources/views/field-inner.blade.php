<h3>{{ $title }}</h3>

@php 

$value = request()->$filterName ?? []; 


$query = $model::query();
foreach($optionScopes as $scope) {
    $query->$scope();
}

if($relation) {

    $query = $query->withCount([

        ($relation . ' as model_count') => function($q) use ($filterName, $filterManager) {
            $data = request()->all();
            unset($data[$filterName]);
            $filterManager::getInstance()->applyToQuery($q, $data, true);
        }

    ]);

}


// dd($query)

// @dd($query->get())

// ->whereHas($relation); // filters out row with zero items (when unfiltered)
// ->having('model_count', '>', 0); // filters out items which become zero during filter process

@endphp

<div class="filter-field-options">
    @foreach( $query->get() as $opt)
        <label>
            <input name="{{ $filterName }}[]" type="checkbox" value="{{ $opt->$idField }}"
                @if($value == $opt->$idField || in_array($opt->$idField, $value)) checked @endif
            >
            <span class="label">{{ $opt->$labelField }}</span>
            @if($relation)
                @if(array_key_exists('model_count', $opt->getAttributes()))
                    <span class="count" data-count="{{ $opt->model_count }}">{{ $opt->model_count }}</span>  
                @endif
            @endif
        </label>
    @endforeach
</div>