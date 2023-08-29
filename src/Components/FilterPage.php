<?php

namespace AscentCreative\Filter\Components;

use Illuminate\View\Component;

class FilterPage extends Component
{

    public $pageSize = 24;
    public $tag;

    public $filterManager;
    public $items;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($pageSize=24, $tag='div', $filterManager=null) {

        $this->pageSize = $pageSize;
        $this->tag = $tag;

        if($filterManager) {
            $this->filterManager = $filterManager;
            $this->items = $this->filterManager::getPage(request()->all(), request()->page);
        }

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('filter::page');
    }
}
