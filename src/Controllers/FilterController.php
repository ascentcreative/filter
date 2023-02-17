<?php

namespace AscentCreative\Filter\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Controllers\Controller;

use \Illuminate\Support\Facades\Crypt;

use AscentCreative\Filter\FilterManager;

class FilterController extends Controller {

    public function loadpage(FilterManager $fm) {

        /**
         * Process the filter request
         */
        $config = (array) json_decode(Crypt::decryptString(request()->config));

        $items = $fm->getPage(request()->all());

        // paginators will need to use the path from the referer...
        $url = parse_url($_SERVER['HTTP_REFERER']);
        $items->setPath($url['path']);
        // ... the parameters from this request (not the full query string)
        $items->appends(request()->except(['_token', 'config', 'displays', 'counters', 'paginators']));
    
        // render the various widgets as needed
        $output = [];

        $displays = (array) json_decode(request()->displays, true);
        foreach($displays as $display=>$displayConfig) {
            $displayConfig = (array) json_decode(Crypt::decryptString($displayConfig));
            $output['displays'][$display] = view('filter::page', ['items'=>$items, 'filterManager'=>get_class($fm), 'config'=>$config, 'blade'=>$displayConfig['itemBlade']])->render();
        } 

        $counters = (array) json_decode(request()->counters, true);
        foreach($counters as $counter=>$counterConfig) {
            $counterConfig = (array) json_decode(Crypt::decryptString($counterConfig));
            $output['counters'][$counter] = view('filter::counter-inner', ['items'=>$items, 'fm'=>$fm, 'config'=>$config, 'attributes'=>$counterConfig])->render();
        } 

        $paginators = (array) json_decode(request()->paginators, true);
        foreach($paginators as $paginator=>$paginatorConfig) {
            $paginatorConfig = (array) json_decode(Crypt::decryptString($paginatorConfig));
            $output['paginators'][$paginator] = view('filter::paginator-inner', ['items'=>$items, 'fm'=>$fm, 'config'=>$config, 'blade'=>$paginatorConfig['blade'], 'attributes'=>$paginatorConfig])->render();
        } 

        // return the JSON data
        return $output;

    }

    public function export(FilterManager $fm) {

        // $this->authorize('export');

        return $fm->export();
        

    }

  

}
