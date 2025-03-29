<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    // 🔹 View all products (For both Customers & Employees)
    public function index()
    {
        return response()->json(Product::all());
    }

    // 🔹 Add a product (Only for Employees)
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'image' => 'nullable|string|max:255'
        ]);

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'image' => $request->image
        ]);

        return response()->json(['message' => 'Product added successfully', 'product' => $product], 201);
    }


    // 🔹 Update a product (Only for Employees)
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'numeric',
            'stock' => 'integer',
            'image' => 'nullable|string|max:255'
        ]);

        $product->update($request->only(['name', 'description', 'price', 'stock', 'image']));

        return response()->json(['message' => 'Product updated successfully', 'product' => $product]);
    }


    // 🔹 Delete a product (Only for Employees)
    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Check if the product exists in any orders
        if ($product->orderItems()->exists()) {
            return response()->json(['message' => 'Cannot delete product. It is already in an order.'], 400);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function search(Request $request)
    {
        $request->validate(['query' => 'required|string']);

        $products = Product::where('name', 'LIKE', "%{$request->input('query')}%")
            ->orWhere('description', 'LIKE', "%{$request->input('query')}%")
            ->get();

        return response()->json($products);
    }

}

