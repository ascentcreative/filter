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

        // maps incoming 'title' request data to Product::scopeByTitle($builder, $data);
        $this->registerFilter('title', 'byTitle');

        // maps incoming 'theme' request data to Product::scopeByTheme($builder, $data);
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

### Advanced - Exporting Data

### Advanced - Copying Data

## UI Components

The next step is to build your Filter UI. This package contains a number of blade components which provide most of the elements needed, some are required, others may be optional depending on your use case.

A basic filter UI might look like:

```
/resources/views/products.blade.php


 <x-filter-view filterManager="{{ \App\Filter\ProductFilterManager::class }}">

    <x-filter-bar>
        {{-- Filter fields go in here --}}
    </x-filter-bar>

    {{-- Displays a text label of "Showing 0 to 25 of 1000 products" --}}
    <x-filter-counter unit="product"/>

    {{-- Displays a page of results, each item usiing the /resources/views/filter/product.blade.php file --}}
    <x-filter-page itemBlade="filter.product"/>

    {{-- Creates a paginator for multipage results --}}
    <x-filter-paginator blade="bootstrap-4"  />

 </x-filter-view>


```

#### `<x-filter-view>`
Defines the area of the DOM which will respond to user input and display results from the FilterManager. 

**Attributes**
 - `filterManager` - Required - The classname of the filter to connect to
 - `class` - Passes HTML/CSS class names to the DIV
 - `style` - Passes CSS Styles to the DIV


#### `<x-filter-bar>`
Designed to be the area where the filter options are displayed. Any HTML fields in this component will be used to trigger updates. 
If you need to add a field which does not trigger an update, set the `data-filter-ignore="1"` attribute

**Attributes**
 - `class` - Passes HTML/CSS class names to the DIV
 - `style` - Passes CSS Styles to the DIV


#### `<x-filter-counter>`
Creates a Human-readble string summarising the number of records returned.

**Attributes**
 - `filterManager` - Optional - The classname of the filter to connect to
 - `unit` - Required - a singular string used to label the type of record. This will use Str::plural if needed.
 - `class` - Passes HTML/CSS class names to the DIV
 - `style` - Passes CSS Styles to the DIV

#### `<x-filter-page>`
The area where the results will be displayed

**Attributes**
 - `filterManager` - Optional - The classname of the filter to connect to
 - `itemBlade` - Required - the blade to use to render an individual model result (accessible via `$item`)
 - `pageBlade` - Optional - a blade to use to render the page of results. The returned items will be acessible as `$items`
 - `class` - Passes HTML/CSS class names to the DIV
 - `style` - Passes CSS Styles to the DIV

#### `<x-filter-paginator>`
Creates a paginator to navigate between pages of results

**Attributes**
 - `filterManager` - Optional - The classname of the filter to connect to
 - `blade` - Optional - the blade to use. Defaults to a Bootstrap4 paginator.
 - `class` - Passes HTML/CSS class names to the DIV
 - `style` - Passes CSS Styles to the DIV

#### `<x-filter-pagesize>`
Creates a dropdown allowing the number of results per page to be changed in the UI


## Important note about the FilterManager attribute on components.
If the Filter components are all on the same Blade file, the components will be able to inherit the FilterManager class using `@aware`. 
However, if any components are inserted in an @include for example, you will need to explicitly set the FilterManager attribute on those components.
This will have no performance impact as the FilterManager is loaded as a singleton instance and the query only performed once per request.



## The DataTableBuilder

The datatable builer is a specific implementation of the FilterManager which is designed to render as a Bootstrap 4 table. Rather than specifying a grid or other layout for the returned models, the Datatable:
 - builds rows for each model
 - uses Column classes to define the data each row should show
 - implements column headers which allow for sorting and filtering options

