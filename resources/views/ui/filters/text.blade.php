@aware(['values'])
<div class="flex flex-column text-left">
    <x-cms-form-input type="text" name="{{ $name }}" wrapper="simple" label="" :value="$values[$name] ?? ''" />
</div>