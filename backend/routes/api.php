<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\PurchaseInvoiceController;
use App\Http\Controllers\Api\PurchaseInvoiceItemController;
// ... import other controllers as needed ...

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by RouteServiceProvider within a group which
| has the "api" middleware and "/api" prefix.
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/purchase-invoices', [PurchaseInvoiceController::class, 'store']);

// Public/unprotected routes
Route::get('/products', [ProductsController::class, 'index']);
Route::post('/products/store', [ProductsController::class, 'store']);
Route::get('/products/{id}', [ProductsController::class, 'show']);
Route::put('/products/{id}', [ProductsController::class, 'update']);
Route::delete('/products/{id}', [ProductsController::class, 'destroy']);

Route::get('/vendors', [VendorController::class, 'index']);
Route::post('/vendors', [VendorController::class, 'store']);
Route::put('/vendors/{id}', [VendorController::class, 'update']);
Route::delete('/vendors/{id}', [VendorController::class, 'destroy']);

// --- Purchase Invoice + Items API ---

// Create a new purchase invoice with items
Route::post('/purchase-invoices', [PurchaseInvoiceController::class, 'store']);

// (Optional) Get list of invoices
Route::get('/purchase-invoices', [PurchaseInvoiceController::class, 'index']);

// (Optional) Get a single invoice (with items)
Route::get('/purchase-invoices/{invoice}', [PurchaseInvoiceController::class, 'show']);

// (Optional) Delete an invoice (and possibly items)
Route::delete('/purchase-invoices/{invoice}', [PurchaseInvoiceController::class, 'destroy']);

// (Optional) If you also need direct access to items (rarely needed if items only via invoice)
// you may keep item-only routes — but generally you don’t need them
// Route::get('/purchase-invoice-items', [PurchaseInvoiceItemController::class, 'index']);
// Route::post('/purchase-invoice-items', [PurchaseInvoiceItemController::class, 'store']);
// Route::get('/purchase-invoice-items/{id}', [PurchaseInvoiceItemController::class, 'show']);
// Route::delete('/purchase-invoice-items/{id}', [PurchaseInvoiceItemController::class, 'destroy']);

// Protected routes — example using sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // Add other protected APIs here...
});
