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
use App\Http\Controllers\Api\ProductController; // barcode & special logic

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\OrderController;

use App\Http\Controllers\Api\ProductImageController;
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

use App\Http\Controllers\Api\CarouselController;
use App\Http\Controllers\Api\ProductColorandSize;
use App\Http\Controllers\Api\ProductSizeRateController;
use App\Http\Controllers\Api\ProductVariantController;
use App\Http\Controllers\Api\ProductOptionRateController;

use App\Http\Controllers\Api\EcommerceLoginController;

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
| ECOMMERCE AUTH
|--------------------------------------------------------------------------
*/

Route::post('/ecommerce-login', [EcommerceLoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/ecommerce-me', [EcommerceLoginController::class, 'me']);
    Route::post('/ecommerce-logout', [EcommerceLoginController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| CART & ORDER
|--------------------------------------------------------------------------
*/

Route::post('/cart/add', [CartController::class, 'addItem']);
Route::post('/cart/update-qty', [CartController::class, 'updateQty']);
Route::get('/cart/latest', [CartController::class, 'latest']);
Route::get('/cart/{id}', [CartController::class, 'show']);
Route::delete('/cart/items/{id}', [CartController::class, 'deleteItem']);

Route::post('/order/single', [OrderController::class, 'buySingle']);
Route::post('/order/checkout', [OrderController::class, 'checkout']);

Route::apiResource('orders', OrderController::class);
Route::put('/orders/status/{id}', [OrderController::class, 'updateStatus']);

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
Route::apiResource('user-role', UserRoleController::class);
Route::apiResource('roles', RoleController::class);

/*
|--------------------------------------------------------------------------
| PRODUCT MASTER
|--------------------------------------------------------------------------
*/

Route::apiResource('product-categories', ProductCategoriesController::class);
Route::apiResource('product-types', ProductTypeController::class);
Route::apiResource('product-sizes', ProductSizeController::class);
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

// barcode lookup
Route::get('/products/barcode/{barcode}', [ProductController::class, 'getByBarcode']);

Route::get('/products/occational', [ProductsController::class, 'getOccationalProducts']);
Route::post('/products/occational', [ProductsController::class, 'storeOccationalProduct']);
Route::delete('/products/occational', [ProductsController::class, 'removeOccationalProduct']);

Route::apiResource('products', ProductsController::class);

// product flags
Route::post('/products/set-new-arrival', [ProductsController::class, 'setNewArrival']);
Route::post('/products/reset-new-arrival', [ProductsController::class, 'resetNewArrival']);

Route::post('/products/set-featured', [ProductsController::class, 'setFeatured']);
Route::post('/products/reset-featured', [ProductsController::class, 'resetFeatured']);

Route::post('/products/set-top-seller', [ProductsController::class, 'setTopSeller']);
Route::post('/products/reset-top-seller', [ProductsController::class, 'resetTopSeller']);

/*
|--------------------------------------------------------------------------
| PRODUCT IMAGES
|--------------------------------------------------------------------------
*/

Route::get('/product/{id}/images', [ProductImageController::class, 'index']);
Route::post('/product/images/upload', [ProductImageController::class, 'upload']);
Route::post('/product/image/update/{id}', [ProductImageController::class, 'update']);
Route::delete('/product/image/delete/{id}', [ProductImageController::class, 'destroy']);

Route::post('/product/main-image/update/{id}', [ProductImageController::class, 'updateMain']);
Route::delete('/product/main-image/delete/{id}', [ProductImageController::class, 'deleteMain']);

/*
|--------------------------------------------------------------------------
| SALES & PURCHASE
|--------------------------------------------------------------------------
*/

Route::apiResource('purchase-invoices', PurchaseInvoiceController::class);
Route::apiResource('sales-invoices', SalesInvoiceController::class);

Route::get('/sales/monthly-summary', [SalesInvoiceController::class, 'monthlySummary']);
Route::get('/sales/monthly-summary/{year}', [SalesInvoiceController::class, 'monthlySummaryByYear']);

/*
|--------------------------------------------------------------------------
| REPORTS
|--------------------------------------------------------------------------
*/

Route::get('/total-sales-today', [TotalSalesController::class, 'index']);
Route::get('/total-revenue-today', [TotalRevenueController::class, 'revenueToday']);

Route::get('/monthly-category-sales', [ReportController::class, 'monthlyCategorySales']);
Route::get('/sales-profit-line', [ReportController::class, 'salesProfitLine']);
Route::get('/purchase-chart-data', [PurchaseChartController::class, 'monthlyPurchaseChart']);

Route::get('/top-selling-products', [TopSaleProductController::class, 'index']);

/*
|--------------------------------------------------------------------------
| INVENTORY
|--------------------------------------------------------------------------
*/

Route::apiResource('inventory-transactions', InventoryTransactionsController::class);
Route::apiResource('transaction-type', TransactionTypeController::class);
Route::apiResource('reference', ReferenceController::class);

/*
|--------------------------------------------------------------------------
| COUPONS
|--------------------------------------------------------------------------
*/

Route::apiResource('coupon', CouponMasterController::class);
Route::apiResource('coupon-products', CouponProductsController::class);
Route::apiResource('coupon-users', CouponUserController::class);

Route::apiResource('coupon-categories', CouponCategoryController::class);

/*
|--------------------------------------------------------------------------
| STITCHING & CAROUSEL
|--------------------------------------------------------------------------
*/

Route::apiResource('stiching-types', StichingTypeController::class);

Route::apiResource('carousels', CarouselController::class);
Route::post('/carousels/{id}/swap', [CarouselController::class, 'swapOrder']);

/*
|--------------------------------------------------------------------------
| EXTRA
|--------------------------------------------------------------------------
*/

Route::get('/product-details/{productCode}', [ProductColorandSize::class, 'getProductDetails']);