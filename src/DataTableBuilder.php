<?php
namespace AscentCreative\Filter;

use AscentCreative\Filter\DataTable\Column;
use Illuminate\Support\Facades\Log;


abstract class DataTableBuilder extends FilterManager {

    private $_columns;


    public function boot() {

        // Log::debug('building datatable');
        $this->setFilterWrapper('');
        // $this->setSorterWrapper('');

        foreach(($cols = $this->getColumns()) as $col) {
            if($col->filterable) {
                $this->registerFilter($col->slug, $col->filterScope);
            }

            if($col->sortable) {
                $this->registerSorter($col->slug, $col->sortQuery);
            }
        }

    }


    /**
     * @return Array - the Column objects in the table
     */
    public function getColumns() : array {
     
        if(is_null($this->_columns)) {
            $this->_columns = $this->columns();    
        }
        return $this->_columns;

    }

    /**
     * Must be implemented to generate the actual array of columns
     * @return array
     */
    abstract public function columns() : array;



    public function getRowClassResolvers() : array {

        return [

        ];

    }



    /**
     * 
     * extracts the values for the table's 'grid-template-columns' CSS property
     * @return [type]
     */
    public function getGridColumns() {

        $cols = collect($this->getColumns())->pluck('width')->toArray();

        return join(' ', $cols);

    }


    public function columnToList($slug) {

        $cols = collect($this->getColumns());
        $col = $cols->where('slug', $slug)->first();

        if(!$col) 
            abort(404);

        foreach($this->get(request()->all()) as $item) {
         
            if($col->value instanceof \Closure) {
                $closure = $col->value;
                $val = $closure($item);
            } else {
                $val = $col->value;
            }
            $data[] = $val;
            
        }

        return join(', ', array_filter($data));
    }


}