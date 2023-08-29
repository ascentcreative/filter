@aware(['filterManager', 'items'])
{{-- @dump($attributes); --}}
{{-- @if($items->total() > 0) --}}
<{{ $tag }} class="filter-page {{ $attributes['class'] }}" style="flex-basis: 100%; {{ $attributes['style'] }}" id="page-{{ $attributes['id'] ?? uniqid() }}"
        data-config="{{ Crypt::encryptString(json_encode([
            'itemBlade'=>$attributes['itemBlade'],
            'pageBlade'=>$attributes['pageBlade'] ?? null,
        ])) }}"
   >
    
    {{-- Ideally, the page would load with the first page of results in place. Is this doable? --}}
    @include($attributes['pageBlade'] ?? 'filter::page-inner', [
            'blade'=>$attributes['itemBlade']])

</{{ $tag }}>
{{-- @else

<H1 style="padding: 40px; text-align: center; color: #ccc">No Records Found</H1>

@endif --}}

