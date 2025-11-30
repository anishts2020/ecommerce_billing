<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CONTROLLERS
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\PurchaseInvoiceController;
use App\Http\Controllers\Api\PurchaseInvoiceItemController;
// ... import other controllers as needed ...

use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\SalaryPaymentController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SalesInvoiceController;
use App\Http\Controllers\Api\ProductCategoriesController;
use App\Http\Controllers\Api\MaterialsController;
use App\Http\Controllers\Api\ProductsController;
use App\Http\Controllers\Api\ProductSizeController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ColorController;
use App\Http\Controllers\Api\ProductTypes;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserRoleController;
use App\Http\Controllers\Api\UserController;


use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ColorController;

use App\Http\Controllers\Api\ProductTypes;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserRoleController;
use App\Http\Controllers\Api\UserController;

use App\Http\Controllers\Api\ReferenceController;
use App\Http\Controllers\Api\TransactionTypeController;
use App\Http\Controllers\Api\InventoryTransactionsController;
/*
|--------------------------------------------------------------------------
| USER + ROLES
|--------------------------------------------------------------------------
| These routes are loaded by RouteServiceProvider within a group which
| has the "api" middleware and "/api" prefix.
*/
*/
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
| EMPLOYEES
|--------------------------------------------------------------------------
*/
Route::apiResource('employees', EmployeeController::class);


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
| SALARY PAYMENTS
|--------------------------------------------------------------------------
*/
Route::get('/salary-payments/{employee_id}', [SalaryPaymentController::class, 'getByEmployee']);
Route::post('/salary-payments', [SalaryPaymentController::class, 'store']);
Route::put('/salary-payments/{id}', [SalaryPaymentController::class,'update']);
Route::delete('/salary-payments/{id}', [SalaryPaymentController::class,'destroy']);

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/purchase-invoices', [PurchaseInvoiceController::class, 'store']);

// Public/unprotected routes
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
| EMPLOYEES
|--------------------------------------------------------------------------
*/
Route::apiResource('employees', EmployeeController::class);

Route::get('/vendors', [VendorController::class, 'index']);
Route::post('/vendors', [VendorController::class, 'store']);
Route::put('/vendors/{id}', [VendorController::class, 'update']);
Route::delete('/vendors/{id}', [VendorController::class, 'destroy']);
/*
|--------------------------------------------------------------------------
| SALES INVOICE
|--------------------------------------------------------------------------
*/
Route::apiResource('sales-invoices', SalesInvoiceController::class);
Route::get('/sales-invoices/{id}/items', [SalesInvoiceController::class, 'getItems']);


/*
|--------------------------------------------------------------------------
| PRODUCT BARCODE
|--------------------------------------------------------------------------
*/
Route::get('/products/barcode/{barcode}', [ProductController::class, 'getByBarcode']);


/*
|--------------------------------------------------------------------------
| PRODUCT CATEGORIES
|--------------------------------------------------------------------------
*/
Route::get('/product-categories', [ProductCategoriesController::class, 'index']);
Route::post('/product-categories', [ProductCategoriesController::class, 'store']);
Route::put('/product-categories/{id}', [ProductCategoriesController::class, 'update']);
Route::delete('/product-categories/{id}', [ProductCategoriesController::class, 'destroy']);

// simple alias for React
Route::get('/categories', [ProductCategoriesController::class, 'index']);


/*
|--------------------------------------------------------------------------
| SALARY PAYMENTS
|--------------------------------------------------------------------------
*/
Route::get('/salary-payments/{employee_id}', [SalaryPaymentController::class, 'getByEmployee']);
Route::post('/salary-payments', [SalaryPaymentController::class, 'store']);
Route::put('/salary-payments/{id}', [SalaryPaymentController::class,'update']);
Route::delete('/salary-payments/{id}', [SalaryPaymentController::class,'destroy']);


/*
|--------------------------------------------------------------------------
| SALES INVOICE
|--------------------------------------------------------------------------
*/
Route::apiResource('sales-invoices', SalesInvoiceController::class);
Route::get('/sales-invoices/{id}/items', [SalesInvoiceController::class, 'getItems']);


/*
|--------------------------------------------------------------------------
| PRODUCT BARCODE
|--------------------------------------------------------------------------
*/
Route::get('/products/barcode/{barcode}', [ProductController::class, 'getByBarcode']);
Route::get('/product-sizes', [ProductSizeController::class, 'index']);
Route::post('/product-sizes', [ProductSizeController::class, 'store']);
Route::put('/product-sizes/{id}', [ProductSizeController::class, 'update']);
Route::delete('/product-sizes/{id}', [ProductSizeController::class, 'destroy']);

Route::get('/sizes', [ProductSizeController::class, 'index']); // alias


/*
|--------------------------------------------------------------------------
| PRODUCT CATEGORIES
|--------------------------------------------------------------------------
*/
Route::get('/product-categories', [ProductCategoriesController::class, 'index']);
Route::post('/product-categories', [ProductCategoriesController::class, 'store']);
Route::put('/product-categories/{id}', [ProductCategoriesController::class, 'update']);
Route::delete('/product-categories/{id}', [ProductCategoriesController::class, 'destroy']);

// simple alias for React
Route::get('/categories', [ProductCategoriesController::class, 'index']);


/*
|--------------------------------------------------------------------------
| PRODUCT SIZES
|--------------------------------------------------------------------------
*/
Route::get('/product-sizes', [ProductSizeController::class, 'index']);
Route::post('/product-sizes', [ProductSizeController::class, 'store']);
Route::put('/product-sizes/{id}', [ProductSizeController::class, 'update']);
Route::delete('/product-sizes/{id}', [ProductSizeController::class, 'destroy']);

Route::get('/sizes', [ProductSizeController::class, 'index']); // alias


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

Route::get('/vendors', [VendorController::class, 'index']);
Route::post('/vendors', [VendorController::class, 'store']);
Route::put('/vendors/{id}', [VendorController::class, 'update']);
Route::delete('/vendors/{id}', [VendorController::class, 'destroy']);

// --- Purchase Invoice + Items API ---

// Create a new purchase invoice with items
Route::post('/purchase-invoices', [PurchaseInvoiceController::class, 'store']);
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
| COLORS
|--------------------------------------------------------------------------
*/
Route::get('/colors', [ColorController::class, 'index']);
Route::post('/colors', [ColorController::class, 'store']);

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
| PRODUCT TYPES
|--------------------------------------------------------------------------
*/
Route::get('/types', [ProductTypes::class, 'index']);


/*
|--------------------------------------------------------------------------
| USERS & ROLES
|--------------------------------------------------------------------------
*/
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::get('/user-role', [UserRoleController::class, 'index']);
Route::get('/user-role/{id}', [UserRoleController::class, 'show']);
Route::post('/user-role', [UserRoleController::class, 'store']);
Route::put('/user-role/{id}', [UserRoleController::class, 'update']);
Route::delete('/user-role/{id}', [UserRoleController::class, 'destroy']);

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

// Protected routes — example using sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // Add other protected APIs here...
});
});
/*
|--------------------------------------------------------------------------
| PRODUCT TYPES
|--------------------------------------------------------------------------
*/
Route::get('/types', [ProductTypes::class, 'index']);


/*
|--------------------------------------------------------------------------
| USERS & ROLES
|--------------------------------------------------------------------------
*/
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::get('/user-role', [UserRoleController::class, 'index']);
Route::get('/user-role/{id}', [UserRoleController::class, 'show']);
Route::post('/user-role', [UserRoleController::class, 'store']);
Route::put('/user-role/{id}', [UserRoleController::class, 'update']);
Route::delete('/user-role/{id}', [UserRoleController::class, 'destroy']);

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
