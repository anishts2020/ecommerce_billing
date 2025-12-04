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
use App\Http\Controllers\Api\PurchaseChartController;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\CouponMasterController;


use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\CouponProductsController;
use App\Http\Controllers\Api\CouponMasterController;
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

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Role
|--------------------------------------------------------------------------
*/

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
/*

/*
|--------------------------------------------------------------------------
| User Role
|--------------------------------------------------------------------------
*/

Route::get('/user-role', [UserRoleController::class, 'index']);
Route::get('/user-role/{id}', [UserRoleController::class, 'show']);
Route::post('/user-role', [UserRoleController::class, 'store']);
Route::put('/user-role/{id}', [UserRoleController::class, 'update']);
Route::delete('/user-role/{id}', [UserRoleController::class, 'destroy']);

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
Route::get('/sales/monthly-summary', [SalesInvoiceController::class, 'monthlySummary']);
Route::get('/sales/monthly-summary/{year}', [SalesInvoiceController::class, 'monthlySummaryByYear']);

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


Route::get('/monthly-category-sales', [App\Http\Controllers\ReportController::class, 'monthlyCategorySales']);

Route::get('/sales-profit-line', [App\Http\Controllers\ReportController::class, 'salesProfitLine']);
Route::get('/purchase-chart-data', [PurchaseChartController::class, 'monthlyPurchaseChart']);
/*
|--------------------------------------------------------------------------
| Coupons & Discount
|--------------------------------------------------------------------------
*/

Route::apiResource('coupon-products', CouponProductsController::class);
Route::apiResource('coupon', CouponMasterController::class);
Route::get('/purchase-report', function (Request $request) {

     $query = DB::table('purchase_invoices as p')
        ->leftJoin('vendors as v', 'v.vendor_id', '=', 'p.vendor_id')
        ->leftJoin('purchase_invoice_items as pi', 'pi.purchase_id', '=', 'p.purchase_id')
        ->leftJoin('products as pr', 'pr.product_id', '=', 'pi.product_id')
        ->select(
            'p.purchase_id',
            'p.purchase_no',
            'p.net_amount',
            'v.vendor_name',
            DB::raw('GROUP_CONCAT(DISTINCT pr.product_name ORDER BY pr.product_name SEPARATOR ", ") AS product_names')
        )
        ->groupBy(
            'p.purchase_id',
            'p.purchase_no',
            'p.net_amount',
            'v.vendor_name'
        );

    if ($request->from) {
        $query->whereDate('p.purchase_date', '>=', $request->from);
    }
    if ($request->to) {
        $query->whereDate('p.purchase_date', '<=', $request->to);
    }

    return $query->get();
});


Route::get('/salesreport', function (Request $request) {

    $query = DB::table('sales_invoices as s')
        ->leftJoin('customers as c', 'c.id', '=', 's.customer_id') // customer PK is `id`
        ->leftJoin('sales_invoice_items as si', 'si.sales_invoice_id', '=', 's.sales_invoice_id')
        ->leftJoin('products as p', 'p.product_id', '=', 'si.product_id')
        ->select(
            's.sales_invoice_id',
            's.invoice_no',
            's.invoice_date',
            'c.customer_name',
            DB::raw('GROUP_CONCAT(p.product_name SEPARATOR ", ") as product_names'),
            's.grand_total as total_grand'
        )
        ->groupBy(
            's.sales_invoice_id',
            's.invoice_no',
            's.invoice_date',
            'c.customer_name',
            's.grand_total'
        );

    // Optional date filters
    if ($request->from) {
        $query->whereDate('s.invoice_date', '>=', $request->from);
    }

    if ($request->to) {
        $query->whereDate('s.invoice_date', '<=', $request->to);
    }

    return $query->get();
});
/*
|--------------------------------------------------------------------------
Coupon Master
|--------------------------------------------------------------------------
*/
Route::get('/coupons', [CouponMasterController::class, 'index']);          
Route::post('/coupons', [CouponMasterController::class, 'store']);          
Route::get('/coupons/{couponMaster}', [CouponMasterController::class, 'show']); 
Route::put('/coupons/{couponMaster}', [CouponMasterController::class, 'update']); 
Route::patch('/coupons/{couponMaster}', [CouponMasterController::class, 'update']); 
Route::delete('/coupons/{couponMaster}', [CouponMasterController::class, 'destroy']); 


