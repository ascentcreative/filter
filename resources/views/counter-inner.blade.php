@if($items && $items->count() > 0)
    Showing {{ $items->firstItem() }}-{{ $items->lastItem() }} of {{ $items->total() }} {{ Str::plural($attributes['unit'], $items->count()) }}
@else
    No matching {{ Str::plural($attributes['unit'], $items->count()) }}
@endif