@props(['idx'])
<form class="filter-view {{ $attributes['class'] }}" style="{{ $attributes['style'] }}"  
    data-filtersetup="{{ Crypt::encryptString(json_encode([
                'filterManager'=>$filterManager
            ])) }}" >
    @csrf
    {{ $slot}}
</form>