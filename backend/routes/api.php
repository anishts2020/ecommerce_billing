<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserRoleController;
use App\Http\Controllers\Api\RoleController;

use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\SalaryPaymentController;

use App\Http\Controllers\Api\ProductCategoriesController;
use App\Http\Controllers\Api\ProductTypeController;
use App\Http\Controllers\Api\ProductSizeController;
use App\Http\Controllers\Api\ColorController;
use App\Http\Controllers\Api\MaterialsController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\ProductController; // for barcode scan

use App\Http\Controllers\Api\VendorController;

use App\Http\Controllers\Api\PurchaseInvoiceController;
use App\Http\Controllers\Api\PurchaseInvoiceItemController;

use App\Http\Controllers\Api\SalesInvoiceController;

use App\Http\Controllers\Api\InventoryTransactionsController;
use App\Http\Controllers\Api\TransactionTypeController;
use App\Http\Controllers\Api\ReferenceController;


/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});


/*
|--------------------------------------------------------------------------
| CUSTOMERS
|--------------------------------------------------------------------------
*/
Route::apiResource('customers', CustomerController::class);
Route::get('/customer/check-phone/{phone}', [CustomerController::class, 'checkPhone']);


/*
|--------------------------------------------------------------------------
| EMPLOYEES + SALARY
|--------------------------------------------------------------------------
*/
Route::apiResource('employees', EmployeeController::class);

Route::get('/salary-payments/{employee_id}', [SalaryPaymentController::class, 'getByEmployee']);
Route::post('/salary-payments', [SalaryPaymentController::class, 'store']);
Route::put('/salary-payments/{id}', [SalaryPaymentController::class,'update']);
Route::delete('/salary-payments/{id}', [SalaryPaymentController::class,'destroy']);


/*
|--------------------------------------------------------------------------
| PRODUCT CATEGORIES
|--------------------------------------------------------------------------
*/
Route::apiResource('product-categories', ProductCategoriesController::class);
//Route::get('/categories', [ProductCategoriesController::class, 'index']); // alias for React


/*
|--------------------------------------------------------------------------
| PRODUCT TYPES
|--------------------------------------------------------------------------
*/
Route::apiResource('product-types', ProductTypeController::class);
Route::get('/product-types', [ProductTypeController::class, 'index']);
Route::post('/product-types/store', [ProductTypeController::class, 'store']);
Route::get('/product-types/{id}', [ProductTypeController::class, 'show']);
Route::put('/product-types/{id}', [ProductTypeController::class, 'update']);
Route::delete('/product-types/{id}', [ProductTypeController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| PRODUCT SIZES
|--------------------------------------------------------------------------
*/
Route::apiResource('product-sizes', ProductSizeController::class);
Route::get('/sizes', [ProductSizeController::class, 'index']); // alias


/*
|--------------------------------------------------------------------------
| COLORS
|--------------------------------------------------------------------------
*/
// COLORS
Route::apiResource('colors', App\Http\Controllers\Api\ColorController::class);



/*
|--------------------------------------------------------------------------
| MATERIALS
|--------------------------------------------------------------------------
*/
Route::apiResource('materials', MaterialsController::class);


/*
|--------------------------------------------------------------------------
| VENDORS
|--------------------------------------------------------------------------
*/
Route::apiResource('vendors', VendorController::class);


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

// barcode lookup
Route::get('/products/barcode/{barcode}', [ProductController::class, 'getByBarcode']);


/*
|--------------------------------------------------------------------------
| PURCHASE INVOICE & ITEMS
|--------------------------------------------------------------------------
*/
Route::get('/purchase-invoices', [PurchaseInvoiceController::class, 'index']);
Route::post('/purchase-invoices', [PurchaseInvoiceController::class, 'store']);
Route::get('/purchase-invoices/{invoice}', [PurchaseInvoiceController::class, 'show']);
Route::delete('/purchase-invoices/{invoice}', [PurchaseInvoiceController::class, 'destroy']);


/*
|--------------------------------------------------------------------------
| SALES INVOICE
|--------------------------------------------------------------------------
*/
Route::apiResource('sales-invoices', SalesInvoiceController::class);
Route::get('/sales-invoices/{id}/items', [SalesInvoiceController::class, 'getItems']);


/*
|--------------------------------------------------------------------------
| INVENTORY TRANSACTIONS
|--------------------------------------------------------------------------
*/
Route::get('/inventory-transactions', [InventoryTransactionsController::class, 'index']);
Route::get('/inventory-transactions/{id}', [InventoryTransactionsController::class, 'show']);
Route::post('/inventory-transactions', [InventoryTransactionsController::class, 'store']);
Route::put('/inventory-transactions/{id}', [InventoryTransactionsController::class, 'update']);
Route::delete('/inventory-transactions/{id}', [InventoryTransactionsController::class, 'destroy']);

Route::get('/transaction-type', [TransactionTypeController::class, 'index']);
Route::post('/transaction-type', [TransactionTypeController::class, 'store']);

Route::get('/reference', [ReferenceController::class, 'index']);
Route::post('/reference', [ReferenceController::class, 'store']);