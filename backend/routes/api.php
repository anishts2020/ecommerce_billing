<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductCategoriesController;
use App\Http\Controllers\Api\MaterialsController;

use App\Http\Controllers\Api\ProductsController;

use App\Http\Controllers\Api\ProductCategories;
use App\Http\Controllers\Api\ProductTypes;
use App\Http\Controllers\Api\ColorsController;
use App\Http\Controllers\Api\ProductSizeController;



use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ColorController;
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
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserRoleController;
use App\Http\Controllers\Api\UserController;

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::get('/user-role', [UserRoleController::class, 'index']);
Route::get('/user-role/{id}', [UserRoleController::class, 'index']);
Route::post('/user-role', [UserRoleController::class, 'store']);
Route::put('/user-role/{id}', [UserRoleController::class, 'update']);
Route::delete('/user-role/{id}', [UserRoleController::class, 'destroy']);

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);



Route::post('/login', [AuthController::class, 'login']);
Route::get('/materials', [MaterialsController::class, 'index']);
Route::post('/materials', [MaterialsController::class, 'store']);
Route::put('/materials/{id}', [MaterialsController::class, 'update']);
Route::delete('/materials/{id}', [MaterialsController::class, 'destroy']);
Route::get('/vendors', [VendorController::class, 'index']);   // Fetch all vendors
Route::post('/vendors', [VendorController::class, 'store']);
Route::put('/vendors/{id}', [VendorController::class, 'update']);
Route::delete('/vendors/{id}', [VendorController::class, 'destroy']);
Route::get('/product-sizes', [ProductSizeController::class, 'index']);
Route::post('/product-sizes', [ProductSizeController::class, 'store']);
Route::put('/product-sizes/{id}', [ProductSizeController::class, 'update']);
Route::delete('/product-sizes/{id}', [ProductSizeController::class, 'destroy']);
Route::get('/colors', [ColorController::class, 'index']);
Route::post('/colors', [ColorController::class, 'store']);



Route::get('/products', [ProductsController::class, 'index']);

Route::post('/products/store', [ProductsController::class, 'store']);
Route::get('/products/{id}', [ProductsController::class, 'show']);
Route::put('/products/{id}', [ProductsController::class, 'update']);
Route::delete('/products/{id}', [ProductsController::class, 'destroy']);





Route::get('/categories', [ProductCategories::class, 'index']);
Route::get('/types', [ProductTypes::class, 'index']);
Route::get('/colors', [ColorsController::class, 'index']);
Route::get('/sizes', [ProductSizeController::class, 'index']);






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
