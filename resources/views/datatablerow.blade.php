{{-- ability to compute a class (or classes?) for the row --}}
@php

//$builder = new $config['dataTableBuilder']();



$classes = [];
foreach($filterManager::getInstance()->getRowClassResolvers() as $fn) {
    $classes[] = $fn($item);
}
@endphp
<tr class="item-row {{ join(' ', $classes); }}">
{{-- for each column, render the value cell --}}
@foreach($filterManager::getInstance()->getColumns() as $col) 

<td class="td-{{ $col->slug }} @if($col->align) text-{{$col->align}} @endif @if($col->noWrap) text-nowrap @endif">

    @if($col->isBlade) 
        @include($col->value, $col->bladeProps)
    @else

        @if($col->isLink) 
            
            @if($col->linkAction instanceof Closure) 
                @php 
                    $la_closure = $col->linkAction; 
                    $linkAction = $la_closure($item);
                @endphp
            @endif
                
            <a href="{{ $linkAction }}"> 
        @endif
    
        @if($col->value instanceof Closure) 
            @php $closure = $col->value; @endphp
            {!! $closure($item) !!}
        @else 
            {!! $col->value !!}
        @endif
        
        @if($col->isLink)
            </a>
        @endif

    @endif
</td>

@endforeach

</tr>