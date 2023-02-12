<?php

namespace AscentCreative\Filter\Components;

use Illuminate\View\Component;

class Paginator extends Component
{

    // public $filterManager;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct() {
    
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render() {
        return view('filter::paginator');
    }
}
