<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Controllers
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
use App\Http\Controllers\Api\ProductController; // barcode lookup

use App\Http\Controllers\Api\VendorController;

use App\Http\Controllers\Api\PurchaseInvoiceController;
use App\Http\Controllers\Api\SalesInvoiceController;

use App\Http\Controllers\Api\TotalRevenueController;
use App\Http\Controllers\Api\TotalSalesController;

use App\Http\Controllers\Api\InventoryTransactionsController;
use App\Http\Controllers\Api\TransactionTypeController;
use App\Http\Controllers\Api\ReferenceController;

use App\Http\Controllers\Api\CouponMasterController;
use App\Http\Controllers\Api\CouponCategoryController;
use App\Http\Controllers\Api\CouponUserController;
use App\Http\Controllers\Api\CouponProductsController;

use App\Http\Controllers\Api\TopSaleProductController;
use App\Http\Controllers\Api\StichingTypeController;
use App\Http\Controllers\Api\PurchaseChartController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| AUTH
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
| EMPLOYEES & SALARY
|--------------------------------------------------------------------------
*/

Route::apiResource('employees', EmployeeController::class);

Route::get('/salary-payments/{employee_id}', [SalaryPaymentController::class, 'getByEmployee']);
Route::post('/salary-payments', [SalaryPaymentController::class, 'store']);
Route::put('/salary-payments/{id}', [SalaryPaymentController::class, 'update']);
Route::delete('/salary-payments/{id}', [SalaryPaymentController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| USERS & ROLES
|--------------------------------------------------------------------------
*/

Route::apiResource('users', UserController::class);

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

Route::apiResource('user-role', UserRoleController::class);

/*
|--------------------------------------------------------------------------
| PRODUCT CATEGORY / TYPE / SIZE / COLOR / MATERIALS
|--------------------------------------------------------------------------
*/

Route::apiResource('product-categories', ProductCategoriesController::class);

// (Your choice: Keep apiResource + custom routes)
Route::apiResource('product-types', ProductTypeController::class);
Route::get('/product-types', [ProductTypeController::class, 'index']);
Route::post('/product-types/store', [ProductTypeController::class, 'store']);
Route::get('/product-types/{id}', [ProductTypeController::class, 'show']);
Route::put('/product-types/{id}', [ProductTypeController::class, 'update']);
Route::delete('/product-types/{id}', [ProductTypeController::class, 'destroy']);

Route::apiResource('product-sizes', ProductSizeController::class);
Route::get('/sizes', [ProductSizeController::class, 'index']); // alias

Route::apiResource('colors', ColorController::class);

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
| PURCHASE INVOICE
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
|
| Your choice: Keep BOTH custom routes and apiResource.
|
*/

Route::get('/sales-invoices', [SalesInvoiceController::class, 'index']);
Route::post('/sales-invoices', [SalesInvoiceController::class, 'store']);
Route::get('/sales-invoices/stitching-items', [SalesInvoiceController::class, 'stitchingItems']);
Route::get('/sales-invoices/{invoice_id}/stitching-items', [SalesInvoiceController::class, 'getStitchingForInvoice']);
Route::get('/sales-invoices/{id}', [SalesInvoiceController::class, 'show']);

Route::apiResource('sales-invoices', SalesInvoiceController::class);

Route::get('/sales-invoices/{id}/items', [SalesInvoiceController::class, 'getItems']);
Route::get('/sales/monthly-summary', [SalesInvoiceController::class, 'monthlySummary']);
Route::get('/sales/monthly-summary/{year}', [SalesInvoiceController::class, 'monthlySummaryByYear']);

/*
|--------------------------------------------------------------------------
| REVENUE / SALES REPORTS
|--------------------------------------------------------------------------
*/

Route::get('/total-sales-today', [TotalSalesController::class, 'index']);
Route::get('/total-revenue-today', [TotalRevenueController::class, 'revenueToday']);

Route::get('/monthly-category-sales', [ReportController::class, 'monthlyCategorySales']);
Route::get('/sales-profit-line', [ReportController::class, 'salesProfitLine']);
Route::get('/purchase-chart-data', [PurchaseChartController::class, 'monthlyPurchaseChart']);

/*
|--------------------------------------------------------------------------
| INVENTORY TRANSACTIONS
|--------------------------------------------------------------------------
*/

Route::apiResource('inventory-transactions', InventoryTransactionsController::class);
Route::apiResource('transaction-type', TransactionTypeController::class);
Route::apiResource('reference', ReferenceController::class);

/*
|--------------------------------------------------------------------------
| COUPONS (Your choice: KEEP ALL)
|--------------------------------------------------------------------------
*/

Route::get('/coupons', [CouponMasterController::class, 'index']);
Route::get('/coupons-list', [CouponMasterController::class, 'listAll']);

Route::apiResource('coupon', CouponMasterController::class);

Route::apiResource('coupon-products', CouponProductsController::class);

Route::get('/coupon-categories', [CouponCategoryController::class, 'index']);
Route::post('/coupon-categories', [CouponCategoryController::class, 'store']);
Route::put('/coupon-categories/{id}', [CouponCategoryController::class, 'update']);
Route::delete('/coupon-categories/{id}', [CouponCategoryController::class, 'destroy']);

Route::apiResource('coupon-users', CouponUserController::class);

/*
|--------------------------------------------------------------------------
| TOP SELLING PRODUCTS
|--------------------------------------------------------------------------
*/

Route::get('/top-selling-products', [TopSaleProductController::class, 'index']);

/*
|--------------------------------------------------------------------------
| STITCHING TYPES
|--------------------------------------------------------------------------
*/

Route::apiResource('stiching-types', StichingTypeController::class);

/*
|--------------------------------------------------------------------------
| PURCHASE REPORT
|--------------------------------------------------------------------------
*/

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
        ->groupBy('p.purchase_id', 'p.purchase_no', 'p.net_amount', 'v.vendor_name');

    if ($request->from) {
        $query->whereDate('p.purchase_date', '>=', $request->from);
    }
    if ($request->to) {
        $query->whereDate('p.purchase_date', '<=', $request->to);
    }

    return $query->get();
});

/*
|--------------------------------------------------------------------------
| SALES REPORT
|--------------------------------------------------------------------------
*/

Route::get('/salesreport', function (Request $request) {
    $query = DB::table('sales_invoices as s')
        ->leftJoin('customers as c', 'c.id', '=', 's.customer_id')
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
        ->groupBy('s.sales_invoice_id', 's.invoice_no', 's.invoice_date', 'c.customer_name', 's.grand_total');

    if ($request->from) {
        $query->whereDate('s.invoice_date', '>=', $request->from);
    }
    if ($request->to) {
        $query->whereDate('s.invoice_date', '<=', $request->to);
    }

    return $query->get();
});