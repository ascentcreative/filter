<?php

Route::middleware('web')->group(function() {

    Route::post('/filter/loadpage', function() {
        // var_dump(request()->all());

        $config = (array) json_decode(Crypt::decryptString(request()->config));

        // var_dump($config);

        $fmCls = $config['filterManager'];

        $fm = new $fmCls();
        // return $fm->getPage();

        return view('filter::page', ['items'=>$fm->getPage(request()->all()), 'blade'=>$config['itemBlade']]);

    });

});