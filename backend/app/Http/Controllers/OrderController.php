<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Handles the checkout process for an authenticated user
     */
    public function checkout(Request $request)
    {
        $user = Auth::user(); // Get the currently authenticated user

        // Return unauthorized if no user is authenticated
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Retrieve the user's cart items along with product details
        $cartItems = Cart::where('user_id', $user->id)->with('product')->get();

        // Return an error if the cart is empty
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $totalPrice = 0;

        // Calculate the total price and check if requested quantity is available
        foreach ($cartItems as $item) {
            if (!$item->product || $item->product->stock < $item->quantity) {
                return response()->json(['message' => 'Stock unavailable for ' . $item->product->name], 400);
            }
            $totalPrice += $item->product->price * $item->quantity;
        }

        // Create a new order record with current timestamp
        $order = Order::create([
            'user_id' => $user->id,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'checkout_date' => now()
        ]);

        // Create order items and deduct stock for each product
        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price
            ]);

            // Update product stock
            $item->product->stock -= $item->quantity;
            $item->product->save();
        }

        // Clear the user's cart after successful checkout
        Cart::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Checkout successful', 'order_id' => $order->id]);
    }

    /**
     * Retrieves all orders in the system (accessible by employees only)
     */
    public function index()
    {
        $user = Auth::user();

        // Only employees are authorized to view all orders
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Return all orders with user and product details
        return response()->json(Order::with('user', 'items.product')->get());
    }

    /**
     * Retrieves orders for the currently authenticated user
     */
    public function myOrders()
    {
        $user = Auth::user();

        // Ensure the user is authenticated
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Return the user's orders with product details
        return response()->json(Order::where('user_id', $user->id)->with('items.product')->get());
    }

    /**
     * Displays details of a specific order by ID (employees only)
     */
    public function show($id)
    {
        $user = Auth::user();

        // Restrict access to employees only
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Find the order by ID with related items and user
        $order = Order::with('items.product', 'user')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Add product names to each order item (fallback if missing)
        $order->items->each(function ($item) {
            $item->product_name = $item->product->name ?? 'Unknown Product';
        });

        return response()->json($order);
    }

    /**
     * Marks a specific order as completed (employees only)
     */
    public function markAsComplete($id)
    {
        $user = Auth::user();

        // Ensure only employees can perform this action
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Retrieve the order by its ID
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Update order status to 'completed'
        $order->status = 'completed';
        $order->save();

        return response()->json(['message' => 'Order marked as complete']);
    }
}
