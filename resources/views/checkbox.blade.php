@aware(['filterManager', 'values'])
<div class="filter-checkbox">
    <label for="{{ $filterName }}-{{ $checkedvalue }}">
        <input type="checkbox" id="{{ $filterName }}-{{ $checkedvalue }}" name="{{ $filterName }}[]" value="{{ $checkedvalue }}"
            @if( array_search($checkedvalue, $values[$filterName] ?? []) !== false ) checked @endif
        />
        {{ $title }}
    </label>
</div>