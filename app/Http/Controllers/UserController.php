<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('createdBy')->latest();

        if ($request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhereHas('createdBy', function ($q3) use ($searchTerm) {
                        $q3->where('name', 'like', "%{$searchTerm}%");
                    })
                    ->orWhere('created_at', 'like', "%{$searchTerm}%");
            });
        }

        $perPage = $request->get('perPage', 10);
        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Users',
            [
                'users' => $users,
                'filters' => [
                    'search' => $request->search,
                    'perPage' => $perPage,
                ]
            ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at?->toISOString(),
                'updated_at' => $user->updated_at?->toISOString(),
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'created_by' => $user->creator?->only(['id', 'name']),
            ]]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse|JsonResponse
    {
        // Prepare update data
        $updateData = $request->validated();

        // Remove password from array if empty to avoid hashing empty string
        if (empty($updateData['password'])) {
            unset($updateData['password']);
        } else {
            $updateData['password'] = Hash::make($updateData['password']);
        }

        // Update user
        $user->update($updateData);

        // Check if the request expects JSON (API)
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'User updated successfully.',
                'user' => $user->fresh()
            ]);
        }

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
