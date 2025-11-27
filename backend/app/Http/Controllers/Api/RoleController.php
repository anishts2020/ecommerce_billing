<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoleController extends Controller
{
    // LIST ALL ROLES
    public function index()
    {
        $roles = Role::orderBy('id', 'asc')->get();
        return response()->json($roles);
    }

    // CREATE ROLE
    public function store(Request $request)
    {
        $exists = Role::where('name', $request->name)
                    ->where('description', $request->description)
                    ->exists();

        if ($exists) {
            return response()->json([
                'status' => false,
                'message' => 'Role with the same name & description already exists!'
            ]);
        }

        $existsName = Role::where('name', $request->name)->exists();
        if ($existsName) {
            return response()->json([
                'status' => false,
                'message' => 'Role name already exists!'
            ]);
        }

        $role = Role::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Role created successfully!',
            'role' => $role
        ]);
    }


    // GET A SINGLE ROLE
    public function show($id)
    {
        $role = Role::findOrFail($id);
        return response()->json($role);
    }

    // UPDATE ROLE
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $role = Role::findOrFail($id);

        $role->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json([
            'message' => 'Role updated successfully!',
            'role' => $role
        ]);
    }

    // DELETE ROLE
    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully!'
        ]);
    }
}
