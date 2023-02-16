<?php

namespace AscentCreative\Filter\Components;

use Illuminate\View\Component;

class Paginator extends Component
{

    public $blade;

    // public $filterManager;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($blade='default') {

        if(view()->exists($blade)) {
            $this->blade = $blade;
        } else if(view()->exists('filter::pagination.' . $blade)) {
            $this->blade = 'filter::pagination.' . $blade;
        }

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
