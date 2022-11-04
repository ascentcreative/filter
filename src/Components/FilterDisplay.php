<?php

namespace AscentCreative\Filter\Components;

use Illuminate\View\Component;

class FilterDisplay extends Component
{

    public $pageSize = 24;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($pageSize=24) {

        $this->pageSize = $pageSize;

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('filter::display');
    }
}
