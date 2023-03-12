@aware(['filterManager', 'values'])
<div id="field-{{ uniqid() }}" style="{{ $attributes['style'] }}" class="filter-field {{ $attributes['class'] }}"
    data-config="{{ Crypt::encryptString(json_encode([
       // 'blade'=>$blade
       'filterName'=>$filterName,
       'idField'=>$idField,
       'labelField'=>$labelField,
       'title' => $title,
       'value'=>$value,
       'relation'=>$relation,
    //    'query' => $query,
       'model' => $model,
       'scope' => $scope
    ])) }}">
    @include('filter::field-inner')
</div>