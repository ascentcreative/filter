<?php

use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Facades\Request;


Route::middleware('web')->group(function() {

    Route::post('/filter/loadpage', function() {

        // Borrowed from Livewire: the ability to apply Middleware
        // from the route which loaded the page containing the filter UI
        $url = (parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH));
        $method = 'get';
        
        // Ensure the original script paths are passed into the fake request incase Laravel is running in a subdirectory
        $request = Request::create($url, $method, [], [], [], [
            'SCRIPT_NAME' => request()->server->get('SCRIPT_NAME'),
            'SCRIPT_FILENAME' => request()->server->get('SCRIPT_FILENAME'),
            'PHP_SELF' => request()->server->get('PHP_SELF'),
        ]);

        if (request()->hasSession()) {
            $request->setLaravelSession(request()->session());
        }
    
        $request->setUserResolver(request()->getUserResolver());
    
        $route = app('router')->getRoutes()->match($request);
    
        // For some reason without this octane breaks the route parameter binding.
        // $route->setContainer(app());
    
        $request->setRouteResolver(function () use ($route) {
            return $route;
        });


        // original middleware
        $oMW = app('router')->gatherRouteMiddleware($request->route());
        
        // the middleware we want to perist
        $pMW = config('filter.persistMiddleware', []);

        // find the middleware present on the referer's route
        $mw = collect($oMW)->filter(function ($middleware) use ($pMW) {
            // Some middlewares can be closures.
            if (! is_string($middleware)) return false;

            return in_array(Str::before($middleware, ':'), $pMW);
        })->toArray();

        // fire the request to force the middleware to be applied
        (new Pipeline(app()))
            ->send($request)
            ->through($mw)
            ->then(function() {
                // noop
            });


        // Done the middleware, now move on to processing the request:
        $config = (array) json_decode(Crypt::decryptString(request()->config));

        $fmCls = $config['filterManager'];

        $fm = new $fmCls();

        return view('filter::page', ['items'=>$fm->getPage(request()->all()), 'fm'=>$fm, 'config'=>$config, 'blade'=>$config['itemBlade']]);

    });

});