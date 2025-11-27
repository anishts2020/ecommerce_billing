<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\SalaryPaymentController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SalesInvoiceController;



Route::get('/employees', [EmployeeController::class, 'index']);
Route::get('/salary-payments/{employee_id}', [SalaryPaymentController::class, 'getByEmployee']);
Route::post('/salary-payments', [SalaryPaymentController::class, 'store']); // for adding salary
Route::put('/salary-payments/{id}', [SalaryPaymentController::class,'update']);
Route::delete('/salary-payments/{id}', [SalaryPaymentController::class,'destroy']);
Route::get('/employee/{id}', [EmployeeController::class, 'show']);
Route::apiResource('customer', CustomerController::class);
Route::get('/products/barcode/{barcode}', [ProductController::class, 'getByBarcode']);
Route::get('/customer/check-phone/{phone}', [CustomerController::class, 'checkByPhone']);
Route::apiResource('sales-invoices', SalesInvoiceController::class);
Route::get('/sales-invoices/{id}/items', [SalesInvoiceController::class, 'getItems']);


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

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // later: protected routes for products, billing, etc.
});
