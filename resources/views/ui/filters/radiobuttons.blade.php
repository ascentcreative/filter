
    <div class="flex flex-column text-left flex-nowrap" style="flex-wrap: no-wrap">
        <x-cms-form-options type="radiobuttons" name="cfilter[{{ $name }}]" wrapper="none" label="" :value="request()->cfilter[$name] ?? []" :options="$opts" />
    </div>
