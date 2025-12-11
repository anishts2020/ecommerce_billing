<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EcommerceLogin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EcommerceLoginController extends Controller
{
    /**
     * Login - accepts username (name or email) and password
     * Returns access_token, token_type, and user (with 'name' correctly set)
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required', // user may send name or email
            'password' => 'required',
        ]);

        $username = $request->input('username');

        // Try to find by name OR email (so users can login with either)
        $user = EcommerceLogin::where('name', $username)
                ->orWhere('email', $username)
                ->first();

        if (! $user || ! Hash::check($request->password, $user->password) || ! $user->is_active) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // create token (sanctum)
        $token = $user->createToken('ecommerce_token')->plainTextToken;

        // Return user object with 'name' (from users table) and other fields
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,    // IMPORTANT: uses existing 'name' column
                'email' => $user->email,
                // include roles or other details if needed
            ],
        ]);
    }

    /**
     * Return currently authenticated user (requires sanctum auth)
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        return response()->json([
            'user' => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Logout - deletes current token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
