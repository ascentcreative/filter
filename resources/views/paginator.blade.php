@aware(['filterManager', 'pageCount', 'items'])
<div id="paginator-{{ $attributes['id'] ?? uniqid() }}" style="{{ $attributes['style'] }}" class="filter-paginator {{ $attributes['class'] }}"
    data-config="{{ Crypt::encryptString(json_encode([
       'blade'=>$blade
    ])) }}"
    >
    @include('filter::paginator-inner')
</div>