@if($items instanceof \Illuminate\Pagination\LengthAwarePaginator && $items->lastPage() > 1 )
    <div class="small flex-wrap">{{ $items->withQueryString()->onEachSide(1)->links( $blade ) }} </div>
@endif