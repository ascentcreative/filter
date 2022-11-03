<?php

namespace AscentCreative\Filter;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Routing\Router;

class FilterServiceProvider extends ServiceProvider
{
  public function register()
  {
    //
   
    $this->mergeConfigFrom(
        __DIR__.'/../config/filter.php', 'filter'
    );

  }

  public function boot()
  {

    $this->loadViewsFrom(__DIR__.'/../resources/views', 'filter');

    $this->loadRoutesFrom(__DIR__.'/../routes/filter-web.php');

    $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

    
  }

  

  // register the components
  public function bootComponents() {

  }




  

    public function bootPublishes() {

      $this->publishes([
        __DIR__.'/../assets' => public_path('vendor/ascentcreative/filter'),
    
      ], 'public');

      $this->publishes([
        __DIR__.'/../config/filter.php' => config_path('filter.php'),
      ]);

    }



}