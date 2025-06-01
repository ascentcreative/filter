# Filter UI for Laravel Models

This package provides a UI library with backend integration for showing and filtering model data on websites. One simple use case would be product catalogues which update when categories are selected, but other examples exist.

## Installation

 - `composer require ascentcreative\filter` - although the repository location may need to be added to you composer.json file.
 - Please note that currently, the active code is in the dev branch.

## Core concepts

This package leans heavily on mapping fields in the UI to scopes defined on a Laravel Model. This mapping takes place within a "FilterManager" class which applies all the neccessary scopes and builds the relevent Eloquent queries. Through the use of some Route Macros, requests are sent to the application via Ajax and updated datasets and other UI elements are returned as HTML fragments. 

## Writing a FilterManager class

FilterManager classes extend `AscentCreative\Filter\FilterManager`. A very simple example would be:

```
namespace App\Filter;

use AscentCreative\Filter\FilterManager;
use App\Models\Product;

class ProductFilterManager extends FilterManager {

    public $default_sort = 'title';

    public $pagesize = 100;

    public function boot() {
        // currently required
        $this->setFilterWrapper('');

        // maps incoming 'title' request data to Product::scopeByTitle($builder, data);
        $this->registerFilter('title', 'byTitle');

        // maps incoming 'theme' request data to Product::scopeByTheme($builder, data);
        $this->registerFilter('theme', 'byTheme');

        // Sorters use the incoming 'sort' request field.
        // - if value is 'title', we'll apply Product::scopeOrderByTitle($builder, $value)
        $this->registerSorter('title', 'orderByTitle');
        // - if value is 'price', we'll apply Product::scopeOrderByPrice($builder, $value)
        $this->registerSorter('price', 'orderByPrice');
    }

    public function buildQuery() {
        // Return a QueryBuilder object from the model - you can apply any scopes / filters etc here
        // which you may need
        return Product::query();
    }

}
```

Next, create a `Route::filter` item in your routes file which will set up the Ajax endpoints for this FilterManager:

```
Route::filter('products', \App\Filter\ProductFilterManager::class);
```
The first parameter is the URL segment to use. Note that this does not use `/products` directly, but a number of sub-routes under that segment, so that URL is still available. In fact, it is probably besst used for your main products page, although that's not essential. 

## UI Components

The next step is to build your Filter UI. This package contains a number of blade components which provide most of the elements needed, some are required, others may be optional depending on your use case.

A basic filter UI might look like:



## The DataTableBuilder

The datatable builer is a specific implementation of the FilterManager which is designed to render as a Bootstrap 4 table. Rather than specifying a grid or other layout for the returned models, the Datatable:
 - builds rows for each model
 - uses Column classes to define the data each row should show
 - implements column headers which allow for sorting and filtering options

