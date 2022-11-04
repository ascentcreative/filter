<?php
namespace AscentCreative\Filter;

class FilterManager {


    // need to somehow register the filters and sorters
    // I'm thinking by fieldname in the request data and the scope name
    
    // should we also grab a wrapper field name?
    // i.e. cfilters[themes] => wrapper[field]

    // allow a global wrapper to be set, but each individual registration might override it?

    public $filter_wrapper = 'filter';
    public $sorter_field = 'sort';

    private $filters = [];
    private $filter_additional = [];
    private $statutoryFilters = [];
    private $sorters = [];


    public function setFilterWrapper($wrapper) {
        $this->filter_wrapper = $wrapper;
        return $this;
    }

    public function setSorterField($field) {
        $this->sorter_field = $field;
        return $this;
    }


    /**
     * Register a new filter
     * param: $field - the name of the field
     * param: $socpe - the eloquent scope name to apply on the model - i.e. scopeByTheme = 'byTheme';
     * param: $wrapper - override the wrapper for this field
     * param: ...$additional - array of extra fields that the filter scope requires (will be passed as parameters to the scope function)
     */
    public function registerFilter($field, $scope, $wrapper=null, ...$additional) {

        $this->filters[$field] = $scope;

        $this->filter_additional[$field] = $additional;

        return $this;

    }


    /**
     * Register a new statutory filter
     * param: $socpe - the eloquent scope name to apply on the model - i.e. scopeByTheme = 'byTheme';
     * No params needed - it's always applied.
     */
    public function registerStatutoryFilter($scope) {

        $this->statutoryFilters[] = $scope;

        return $this;

    }

    /**
     * Register a new sorter
     * param: $field - the name of the field
     * param: $socpe - the eloquent scope name to apply on the model - i.e. scopeByTheme = 'byTheme';
     * param: $wrapper - override the wrapper for this field
     */
    public function registerSorter($field, $scope, $wrapper=null) {
 
        $this->sorters[$field] = $scope;

        return $this;

    }


    public function apply($query, $data=null) {

        $data = $data ?? request()->all();

        foreach($this->statutoryFilters as $key=>$scope) {
            $query->$scope();
        }


        $wrapper = $this->filter_wrapper;
        if ($wrapper == '') {
            $filter_data = $data;
        } else {
            $filter_data = $data[$wrapper] ?? [];
        }

        foreach($this->filters as $key=>$scope) {

            if(isset($filter_data[$key])) {

                // eager load for performance?
                if(isset($this->filter_additional[$key])) {
                    $args = [];
                    foreach($this->filter_additional[$key] as $fld) {
                        $args[] = $filter_data[$fld];
                    }
                    $query->$scope($filter_data[$key], ...$args);
                } else {
                    // dump('here');
                    $query->$scope($filter_data[$key]);
                }
                
                
            }
        }

        // does this need to police only one sorter?
        if(isset($data[$this->sorter_field])) {

            $sorts = $data[$this->sorter_field];
            if(!is_array($sorts)) {
                $sorts = [$sorts];
            }

            foreach($sorts as $sort) {
                $split = explode('_', $sort);
                $key = $split[0];
                $dir = $split[1] ?? 'asc';

                if(isset($this->sorters[$key])) {
                    $scope = $this->sorters[$key];    
                    $query->$scope($dir);
                }
            }
            // out of sorts.



        }

        return $query;

    }


}
