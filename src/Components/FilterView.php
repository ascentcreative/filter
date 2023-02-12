<?php

namespace AscentCreative\Filter\Components;

use Illuminate\View\Component;

class FilterView extends Component
{

    public $filterManager;
    public $items;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($filterManager) {

        $this->filterManager = $filterManager;
        $this->items = $this->filterManager::getPage(request()->all(), request()->page);
        
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('filter::view');
    }
}
