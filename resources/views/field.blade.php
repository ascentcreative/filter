@aware(['filterManager', 'values'])
<div id="field-{{ $filterName }}" style="{{ $attributes['style'] }}" 
    class="filter-field {{ $attributes['class'] }} stateful-component"
    data-config="{{ Crypt::encryptString(json_encode([
       // 'blade'=>$blade
       'filterName'=>$filterName,
       'idField'=>$idField,
       'labelField'=>$labelField,
       'title' => $title,
       'value'=>$value,
       'relation'=>$relation,
       'model' => $model,
       'optionScopes' => $optionScopes
    ])) }}">
    @include('filter::field-inner')
</div>