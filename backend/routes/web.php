<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

if (app()->environment('local')) {
    Route::get('/coverage-reports/{any}', function () {
        return response()->file(base_path('coverage-reports/' . request()->route('any')));
    })->where('any', '.*');
}