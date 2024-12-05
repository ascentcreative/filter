@aware(['filterManager', 'items'])
{{-- @dump($attributes); --}}
{{-- @if($items->total() > 0) --}}
<{{ $tag }} class="filter-page {{ $attributes['class'] }} stateful-component" style="flex-basis: 100%; {{ $attributes['style'] }}"

        id="{{ $attributes['id'] ?? 'page-' . uniqid() }}"
        data-config="{{ Crypt::encryptString(json_encode([
            'itemBlade'=>$attributes['itemBlade'],
            'pageBlade'=>$attributes['pageBlade'] ?? null,
        ])) }}"
   >
    
    {{-- Ideally, the page would load with the first page of results in place. Is this doable? --}}
    @include($attributes['pageBlade'] ?? 'filter::page-inner', [
            'blade'=>$attributes['itemBlade'],
            'filters'=>$filters
            ])

</{{ $tag }}>
{{-- @else

<H1 style="padding: 40px; text-align: center; color: #ccc">No Records Found</H1>

@endif --}}

