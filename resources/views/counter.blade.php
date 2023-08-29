@aware(['filterManager', 'items'])
<div class="filter-counter {{ $attributes['class'] }}" id="counter-{{ $attributes['id'] ?? uniqid() }}" style="{{ $attributes['style'] }}"
    data-config="{{ Crypt::encryptString(json_encode([
        'unit'=>$attributes['unit']
    ])) }}"
    >

    @include('filter::counter-inner')

</div>