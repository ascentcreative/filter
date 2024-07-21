@if($items instanceof \Illuminate\Pagination\LengthAwarePaginator && $items->lastPage() > 1 )
    {{-- <div class="small"> --}}
        {{ $items->withQueryString()->onEachSide(1)->links( $blade ) }} 
    {{-- </div> --}}
    <input class="page" type="hidden" name="{{ $pv = $items->getPageName() }}" value="{{ request()->$pv ?? 1 }}" />
@endif