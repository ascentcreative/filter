<?php

namespace AscentCreative\Filter;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Routing\Router;
use \Illuminate\Support\Facades\Route;
// use \Illuminate\Support\Facades\Router;


use AscentCreative\Filter\FilterManager;
use AscentCreative\Filter\DataTableBuilder;

class FilterServiceProvider extends ServiceProvider
{
  public function register()
  {
    //
   
    $this->mergeConfigFrom(
        __DIR__.'/../config/filter.php', 'filter'
    );

    $this->registerRouteMacros();

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
        Blade::component('filter-view', 'AscentCreative\Filter\Components\FilterView');

        Blade::component('filter-bar', 'AscentCreative\Filter\Components\FilterBar');
        Blade::component('filter-field', 'AscentCreative\Filter\Components\FilterField');
        Blade::component('filter-dropdown', 'AscentCreative\Filter\Components\FilterDropdown');
        Blade::component('filter-tags', 'AscentCreative\Filter\Components\FilterTags');
        Blade::component('filter-checkbox', 'AscentCreative\Filter\Components\FilterCheckbox');
        Blade::component('filter-sorter', 'AscentCreative\Filter\Components\FilterSorter');
       
        Blade::component('filter-display', 'AscentCreative\Filter\Components\FilterDisplay');
        Blade::component('filter-itemcontent', 'AscentCreative\Filter\Components\FilterItemContent');
        Blade::component('filter-page', 'AscentCreative\Filter\Components\FilterPage');
        Blade::component('filter-paginator', 'AscentCreative\Filter\Components\Paginator');
        Blade::component('filter-pagesize', 'AscentCreative\Filter\Components\PageSize');
        Blade::component('filter-counter', 'AscentCreative\Filter\Components\FilterCounter');
        
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



     /**
   * 
   * Route macros to allow sites to create utility routes (i.e. adding to basket)
   * 
   * @return [type]
   */
    public function registerRouteMacros() {

        Route::macro('filter', function($segment, $fmCls, $opts=[]) {

            $fm = $fmCls::getInstance();  

            $nameprefix = join('.', array_filter(explode('/', Router::getLastGroupPrefix())));
            if($nameprefix) {
                $nameprefix .= '.';
            }

            $fm->addRoute('loadpage', 
                // Route::post('/filter/' . $segment . '/loadpage', function() use ($fmCls) {
                Route::post('/' . $segment, function() use ($fmCls) {
                    $fm = $fmCls::getInstance();
                    $ctrl = new \AscentCreative\Filter\Controllers\FilterController();
                    return $ctrl->loadpage($fm);
                })->name($nameprefix . 'filter.' . $segment . '.loadpage')
            );

          
            if($fm instanceof DataTableBuilder) {
                $fm->addRoute('copy-column', 
                    // Route::post('/filter/' . $segment . '/copy/{column}', function($column) use ($fmCls) {
                    Route::post('/' . $segment . '/copy/{column}', function($column) use ($fmCls) {
                        $fm = $fmCls::getInstance();
                        return [
                            'toast' => view('filter::toasts.copy-success')->render(),
                            'data' => $fm->columnToList($column),
                        ];
                    })->name($nameprefix . 'filter.' . $segment . '.copy-column')
                );
            }

            $fm->addRoute('copy', 
                // Route::post('/filter/' . $segment . '/copy', function() use ($fmCls) {
                Route::post('/' . $segment . '/copy', function() use ($fmCls) {
                    $fm = $fmCls::getInstance();
                    try {
                        return [
                            'toast' => view('filter::toasts.copy-success')->render(),
                            'data' => $fm->copy(),
                        ];
                    } catch (\Exception $e) {
                        return [
                            'toast' => view('filter::toasts.copy-failed', ['exception'=>$e])->render(),
                            'data' => 'FAILED'
                        ];
                    }
                })->name($nameprefix . 'filter.' . $segment . '.copy')
            );


            if(isset($opts['exporter'])) {
                $exporter = $opts['exporter'];
                $fm->addRoute('export', 
                    Route::get($segment . '/export', function() use ($fmCls, $exporter) { 
                        $fm = $fmCls::getInstance();
                        $ctrl = new \AscentCreative\Filter\Controllers\FilterController();
                        return $ctrl->export($fm, $exporter);
                    })->name($nameprefix . 'filter.' . $segment . '.export')
                );
            }

        });

      

    }



}