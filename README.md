# Filter UI for Laravel Models

This package provides a UI library with backend integration for showing and filtering model data on websites. One simple use case would be product catalogues which update when categories are selected, but other examples exist.

## Installation

 - `composer require ascentcreative\filter` - although the repository location may need to be added to you composer.json file.
 - Please note that currently, the active code is in the dev branch.

## Core concepts

This package leans heavily on mapping fields in the UI to scopes defined on a Laravel Model. This mapping takes place within a "FilterManager" class which applies all the neccessary scopes and builds the relevent Eloquent queries. Through the use of some Route Macros, requests are sent to the application via Ajax and updated datasets and other UI elements are returned as HTML fragments. 

## Writing a FilterManager class



## UI Components

## The DataTableBuilder

The datatable builer is a specific implementation of the FilterManager which is designed to render as a Bootstrap 4 table. Rather than specifying a grid or other layout for the returned models, the Datatable:
 - builds rows for each model
 - uses Column classes to define the data each row should show
 - implements column headers which allow for sorting and filtering options
