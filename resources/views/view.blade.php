@props(['idx'])
<form class="filter-view {{ $attributes['class'] }}" style="{{ $attributes['style'] }}" method="post" 
    action="{{ $filterManager::getInstance()->getRouteUri('loadpage') }}"
    data-filtersetup="{{ Crypt::encryptString(json_encode([
                'filterManager'=>$filterManager
            ])) }}" 
    @isset($attributes['forceuri'])
        data-force-uri="{{ $attributes['forceuri'] }}"
    @endisset
    >
    @csrf
    {!! prevent_submit_on_enter() !!}
    {{ $slot}}
</form>