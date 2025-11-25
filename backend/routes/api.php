<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductCategoriesController;
use App\Http\Controllers\Api\MaterialsController;
use App\Http\Controllers\Api\ProductsController;

use App\Http\Controllers\Api\ProductCategories;
use App\Http\Controllers\Api\ProductTypes;
use App\Http\Controllers\Api\ProductSizeController;

use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ColorController;

use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserRoleController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| USER + ROLES
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| MATERIALS
|--------------------------------------------------------------------------
*/

Route::get('/materials', [MaterialsController::class, 'index']);
Route::post('/materials', [MaterialsController::class, 'store']);
Route::put('/materials/{id}', [MaterialsController::class, 'update']);
Route::delete('/materials/{id}', [MaterialsController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| VENDORS
|--------------------------------------------------------------------------
*/

Route::get('/vendors', [VendorController::class, 'index']);
Route::post('/vendors', [VendorController::class, 'store']);
Route::put('/vendors/{id}', [VendorController::class, 'update']);
Route::delete('/vendors/{id}', [VendorController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| PRODUCT SIZES
|--------------------------------------------------------------------------
*/

// Keep your original for safety
Route::get('/product-sizes', [ProductSizeController::class, 'index']);

// ADD THIS FOR REACT:
Route::get('/sizes', [ProductSizeController::class, 'index']);

/*
|--------------------------------------------------------------------------
| COLORS
|--------------------------------------------------------------------------
*/

// ORIGINAL
Route::get('/colors', [ColorController::class, 'index']);
Route::post('/colors', [ColorController::class, 'store']);

/*
|--------------------------------------------------------------------------
| PRODUCT TYPES
|--------------------------------------------------------------------------
*/

Route::get('/types', [ProductTypes::class, 'index']);

/*
|--------------------------------------------------------------------------
| PRODUCT CATEGORIES
|--------------------------------------------------------------------------
*/

// ORIGINAL
Route::get('/product-categories', [ProductCategoriesController::class, 'index']);
Route::post('/product-categories', [ProductCategoriesController::class, 'store']);
Route::put('/product-categories/{id}', [ProductCategoriesController::class, 'update']);
Route::delete('/product-categories/{id}', [ProductCategoriesController::class, 'destroy']);

// ADD THIS FOR REACT:
Route::get('/categories', [ProductCategoriesController::class, 'index']);

/*
|--------------------------------------------------------------------------
| PRODUCTS
|--------------------------------------------------------------------------

*/



Route::get('/products', [ProductsController::class, 'index']);
Route::post('/products/store', [ProductsController::class, 'store']);
Route::get('/products/{id}', [ProductsController::class, 'show']);
Route::put('/products/{id}', [ProductsController::class, 'update']);
Route::delete('/products/{id}', [ProductsController::class, 'destroy']);







Route::get('/product-sizes', [ProductSizeController::class, 'index']);
Route::post('/product-sizes', [ProductSizeController::class, 'store']);
Route::put('/product-sizes/{id}', [ProductSizeController::class, 'update']);
Route::delete('/product-sizes/{id}', [ProductSizeController::class, 'destroy']);

// Duplicate optional alias
Route::get('/sizes', [ProductSizeController::class, 'index']);

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
