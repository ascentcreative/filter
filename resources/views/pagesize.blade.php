<div class="flex flex-center">
    <div class="small">Show&nbsp;</div>
    <div class="small">
        <select class="form-control form-control-sm filter-pagesize" name="pagesize" id="pagesize" xclass="">
            <option value="15" @if(request()->pagesize == 15) selected @endif>15</option>
            <option value="25" @if(request()->pagesize == 25) selected @endif>25</option>
            <option value="50" @if(request()->pagesize == 50) selected @endif>50</option>
            <option value="100" @if(request()->pagesize == 100) selected @endif>100</option>
            <option value="500" @if(request()->pagesize == 500) selected @endif>500</option>
            <option value="1000" @if(request()->pagesize == 1000) selected @endif>1000</option>
            {{-- <option value="all">All</option> --}}
        </select>
    </div>
    <div class="small">&nbsp; Rows</div>
</div>

@push('scripts')
<script>
    $(document).ready(function() {
     
        $('.filter-pagesize').on('change', function() {
            $(this).trigger('filters-updated');
        });
        
    }); 
</script>
@endpush