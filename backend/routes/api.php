<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\ProductsController;

use App\Http\Controllers\Api\ProductCategories;
use App\Http\Controllers\Api\ProductTypes;
use App\Http\Controllers\Api\ColorsController;
use App\Http\Controllers\Api\ProductSizeController;
use App\Http\Controllers\Api\VendorsController;


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



Route::get('/products', [ProductsController::class, 'index']);

Route::post('/products/store', [ProductsController::class, 'store']);
Route::get('/products/{id}', [ProductsController::class, 'show']);
Route::put('/products/{id}', [ProductsController::class, 'update']);
Route::delete('/products/{id}', [ProductsController::class, 'destroy']);





Route::get('/categories', [ProductCategories::class, 'index']);
Route::get('/types', [ProductTypes::class, 'index']);
Route::get('/colors', [ColorsController::class, 'index']);
Route::get('/sizes', [ProductSizeController::class, 'index']);
Route::get('/vendors', [VendorsController::class, 'index']);




/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // later: protected routes for products, billing, etc.
});
