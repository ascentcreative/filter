@if($items instanceof \Illuminate\Pagination\LengthAwarePaginator && $items->lastPage() > 1 )
    <div>{{ $items->withQueryString()->links( 'filter::pagination.bootstrap-4' ) }} </div>
@endif