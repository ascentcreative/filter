{{-- ability to compute a class (or classes?) for the row --}}
@php

//$builder = new $config['dataTableBuilder']();

$classes = [];
// foreach($rowClassResolvers as $fn) {
//     $classes[] = $fn($item);
// }
@endphp
<tr class="item-row {{ join(' ', $classes); }}">
{{-- for each column, render the value cell --}}
@foreach($fm->getColumns() as $col) 

<td class="@if($col->align) text-{{$col->align}} @endif @if($col->noWrap) text-nowrap @endif">

    @if($col->isBlade) 
        @include($col->value, $col->bladeProps)
    @else

        @if($col->isLink) 
            @if($col->linkAction instanceof Closure) 
                @php 
                    $la_closure = $col->linkAction; 
                    $linkAction = $la_closure($item);
                @endphp
            @else
                @php $linkAction = $col->linkAction; @endphp
            @endif
            @if($col->linkParam) 
                @php
                    $param = $col->linkParam;
                @endphp
            @else
                @php
                    $param = $modelInject;
                @endphp
            @endif
                
            <a href="{{ action([controller(), $linkAction], [$param => $item->id]) }}">
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