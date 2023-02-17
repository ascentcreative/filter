<?php

use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Facades\Request;


Route::middleware('web')->group(function() {

    // /**
    //  * Recieves a request for filtered data and returns HTML fragments in a JSON object
    //  * TODO: Totally needs adding to a controller!
    //  * TODO: And authorization adding (can('viewAny')) - maybe part of the filter manager?
    //  * 
    //  * OR... 
    //  * We should make this a Route macro which we set up as needed, allowing appropriate authentication/authorisation middleware to be added if needed. 
    //  *  - This feels more configurable. Yep. We'll do this. 
    //  *  - This might also mean we don't need the stuff from Livewire as it means the route will use any associated middleware.
    //  * 
    //  */
    // Route::post('/filter/loadpage', function() {

    //     /**
    //      * Borrowed (copied) from Livewire: the ability to apply Middleware
    //      * from the route which loaded the page containing the filter UI
    //      */
    //     $url = (parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH));
    //     $method = 'get';
        
    //     // Ensure the original script paths are passed into the fake request incase Laravel is running in a subdirectory
    //     $request = Request::create($url, $method, [], [], [], [
    //         'SCRIPT_NAME' => request()->server->get('SCRIPT_NAME'),
    //         'SCRIPT_FILENAME' => request()->server->get('SCRIPT_FILENAME'),
    //         'PHP_SELF' => request()->server->get('PHP_SELF'),
    //     ]);

    //     if (request()->hasSession()) {
    //         $request->setLaravelSession(request()->session());
    //     }
    
    //     $request->setUserResolver(request()->getUserResolver());
    
    //     $route = app('router')->getRoutes()->match($request);
    
    //     // For some reason without this octane breaks the route parameter binding.
    //     // $route->setContainer(app());
    
    //     $request->setRouteResolver(function () use ($route) {
    //         return $route;
    //     });


    //     // original middleware
    //     $oMW = app('router')->gatherRouteMiddleware($request->route());
        
    //     // the middleware we want to perist
    //     $pMW = config('filter.persistMiddleware', []);

    //     // find the middleware present on the referer's route
    //     $mw = collect($oMW)->filter(function ($middleware) use ($pMW) {
    //         // Some middlewares can be closures.
    //         if (! is_string($middleware)) return false;

    //         return in_array(Str::before($middleware, ':'), $pMW);
    //     })->toArray();

    //     // fire the request to force the middleware to be applied
    //     (new Pipeline(app()))
    //         ->send($request)
    //         ->through($mw)
    //         ->then(function() {
    //             // noop
    //         });
    //     /**
    //      * End Middleware handling
    //      */


    //     /**
    //      * Process the filter request
    //      */
    //     $config = (array) json_decode(Crypt::decryptString(request()->config));

    //     $fmCls = $config['filterManager'];

    //     $fm = $fmCls::getInstance();

    //     $items = $fm->getPage(request()->all());


    //     // paginators will need to use the path from the referer...
    //     $url = parse_url($_SERVER['HTTP_REFERER']);
    //     $items->setPath($url['path']);
    //       // ... the parameters from this request (not the full query string)
    //     $items->appends(request()->except(['_token', 'config', 'displays', 'counters', 'paginators']));
      

    //     // render the various widgets as needed
    //     $output = [];

    //     $displays = (array) json_decode(request()->displays, true);
    //     foreach($displays as $display=>$displayConfig) {
    //         $displayConfig = (array) json_decode(Crypt::decryptString($displayConfig));
    //         $output['displays'][$display] = view('filter::page', ['items'=>$items, 'filterManager'=>$fmCls, 'config'=>$config, 'blade'=>$displayConfig['itemBlade']])->render();
    //     } 

    //     $counters = (array) json_decode(request()->counters, true);
    //     foreach($counters as $counter=>$counterConfig) {
    //         $counterConfig = (array) json_decode(Crypt::decryptString($counterConfig));
    //         $output['counters'][$counter] = view('filter::counter-inner', ['items'=>$items, 'fm'=>$fm, 'config'=>$config, 'attributes'=>$counterConfig])->render();
    //     } 

    //     $paginators = (array) json_decode(request()->paginators, true);
    //     foreach($paginators as $paginator=>$paginatorConfig) {
    //         $paginatorConfig = (array) json_decode(Crypt::decryptString($paginatorConfig));
    //         $output['paginators'][$paginator] = view('filter::paginator-inner', ['items'=>$items, 'fm'=>$fm, 'config'=>$config, 'blade'=>$paginatorConfig['blade'], 'attributes'=>$paginatorConfig])->render();
    //     } 

    //     // return the JSON data
    //     return $output;

    // });

});