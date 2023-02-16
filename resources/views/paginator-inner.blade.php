@if($items instanceof \Illuminate\Pagination\LengthAwarePaginator && $items->lastPage() > 1 )
    <div>{{ $items->withQueryString()->onEachSide(1)->links( $blade ) }} </div>
@endif