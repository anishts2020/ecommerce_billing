<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductCategoriesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);


Route::get('/product-categories', [ProductCategoriesController::class, 'index']);
Route::post('/product-categories', [ProductCategoriesController::class, 'store']);
Route::put('/product-categories/{id}', [ProductCategoriesController::class, 'update']);
Route::delete('/product-categories/{id}', [ProductCategoriesController::class, 'destroy']);
/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
   


    // later: protected routes for products, billing, etc.
});
