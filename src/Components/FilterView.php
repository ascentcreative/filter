<?php

namespace AscentCreative\Filter\Components;

use Illuminate\View\Component;

class FilterView extends Component
{

    public $filterManager;
    // public $loadpageroute;
    public $items;
    public $uris;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($filterManager) {

        $this->filterManager = $filterManager;
        $this->items = $this->filterManager::getPage(request()->all(), request()->page);
        // $this->loadpageroute = $loadpageroute;
        $this->uris = $this->filterManager::getInstance()->getRouteUris();
        
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
