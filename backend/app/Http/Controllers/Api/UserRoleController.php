<?php

namespace App\Http\Controllers\Api;

use App\Models\UserRole;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserRoleController extends Controller
{
    public function index()
    {
        // Show list with relationship data
        $data = UserRole::with(['user', 'role'])->orderBy('id', 'asc')->get();
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        // CHECK DUPLICATE
        $exists = UserRole::where('user_id', $request->user_id)
                         ->where('role_id', $request->role_id)
                         ->exists();

        if ($exists) {
            // **CHANGE: Return 409 Conflict for duplicate entry**
            return response()->json([
                'message' => 'User is already assigned with this role!',
                'status' => 'error'
            ], 409); 
        }

        $role = UserRole::create([
            'user_id' => $request->user_id,
            'role_id' => $request->role_id,
        ]);

        return response()->json([
            'message' => 'Successfully assigned role to User!!',
            'data' => $role
        ], 201);
    }


    public function show($id)
    {
        return response()->json(UserRole::with(['user', 'role'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'role_id' => 'required|integer'
        ]);

        // CHECK DUPLICATE, excluding the current record ($id)
        $exists = UserRole::where('user_id', $request->user_id)
                         ->where('role_id', $request->role_id)
                         ->where('id', '!=', $id) // Exclude current ID during update
                         ->exists();

        if ($exists) {
            // **CHANGE: Return 409 Conflict for duplicate entry**
            return response()->json([
                'message' => 'User is already assigned with this role!',
                'status' => 'error'
            ], 409);
        }

        $userRole = UserRole::find($id);

        if (!$userRole) {
            return response()->json([
                'status' => false,
                'message' => 'Record not found!'
            ], 404);
        }

        $userRole->user_id = $request->user_id;
        $userRole->role_id = $request->role_id;
        $userRole->save();

        return response()->json([
            'status' => true,
            'message' => 'User Role updated successfully',
            'data' => $userRole
        ], 200);
    }


    public function destroy($id)
    {
        UserRole::findOrFail($id)->delete();
        return response()->json(['message' => 'User Role deleted successfully!']);
    }
}