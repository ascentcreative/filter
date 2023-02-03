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

    $this->bootComponents();

    $this->bootPublishes();

    packageAssets()->addStylesheet('/vendor/ascent/filter/dist/css/ascent-filter-bundle.css');
    packageAssets()->addScript('/vendor/ascent/filter/dist/js/ascent-filter-bundle.js');
    
  }

  

  // register the components
  public function bootComponents() {
        Blade::component('filter-ui', 'AscentCreative\Filter\Components\FilterUI');

        Blade::component('filter-bar', 'AscentCreative\Filter\Components\FilterBar');
        Blade::component('filter-field', 'AscentCreative\Filter\Components\FilterField');
        Blade::component('filter-sorter', 'AscentCreative\Filter\Components\FilterSorter');
        
        Blade::component('filter-display', 'AscentCreative\Filter\Components\FilterDisplay');

        Blade::component('filter-datatable', 'AscentCreative\Filter\Components\DataTable');
  }




  

    public function bootPublishes() {

      $this->publishes([
        __DIR__.'/../assets' => public_path('vendor/ascent/filter'),
    
      ], 'public');

      $this->publishes([
        __DIR__.'/../config/filter.php' => config_path('filter.php'),
      ]);

    }



}