@aware(['filterManager', 'items'])
<{{ $tag }} class="filter-display {{ $attributes['class'] }}" style="flex-basis: 100%; {{ $attributes['style'] }}" id="display-{{ uniqid() }}"
        data-config="{{ Crypt::encryptString(json_encode([
            'itemBlade'=>$attributes['itemBlade']
        ])) }}"
   >
    
    {{-- Ideally, the page would load with the first page of results in place. Is this doable? --}}
    @include('filter::page', [
            'blade'=>$attributes['itemBlade']])

</{{ $tag }}>

