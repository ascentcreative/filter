@if($items)
    Showing {{ $items->firstItem() }}-{{ $items->lastItem() }} of {{ $items->total() }} {{ Str::plural($attributes['unit'], $items->count()) }}
@endif