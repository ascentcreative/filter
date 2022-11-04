@foreach($items as $item) 

    @include($blade, ['item'=>$item])

@endforeach