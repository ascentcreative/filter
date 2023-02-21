<div class="filter-checkbox">
    <label for="{{ $filterName }}">
        <input type="checkbox" id="{{ $filterName }}" name="{{ $filterName }}" value="1"
            @if($value == 1) checked @endif
        />
        {{ $title }}
    </label>
</div>