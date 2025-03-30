<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // Handles the checkout process
    public function checkout(Request $request)
    {
        $user = Auth::user(); // Get the authenticated user
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Retrieve cart items for the user
        $cartItems = Cart::where('user_id', $user->id)->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $totalPrice = 0;
        // Calculate total price and check stock availability
        foreach ($cartItems as $item) {
            if (!$item->product || $item->product->stock < $item->quantity) {
                return response()->json(['message' => 'Stock unavailable for ' . $item->product->name], 400);
            }
            $totalPrice += $item->product->price * $item->quantity;
        }

        // Create order with checkout_date
        $order = Order::create([
            'user_id' => $user->id,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'checkout_date' => now() // Set checkout date
        ]);

        // Add order items and update stock
        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price
            ]);

            // Reduce stock quantity
            $item->product->stock -= $item->quantity;
            $item->product->save();
        }

        // Clear the cart after successful checkout
        Cart::where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Checkout successful', 'order_id' => $order->id]);
    }

    // Fetch all orders (for employees only)
    public function index()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(Order::with('user', 'items.product')->get());
    }

    // Fetch orders for the authenticated user
    public function myOrders()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json(Order::where('user_id', $user->id)->with('items.product')->get());
    }

    // Get a specific order (for employees only)
    public function show($id)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order = Order::with('items.product', 'user')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Ensure items contain product details
        $order->items->each(function ($item) {
            $item->product_name = $item->product->name ?? 'Unknown Product';
        });

        return response()->json($order);
    }

    // Mark an order as completed (for employees only)
    public function markAsComplete($id)
    {
        $user = Auth::user();

        // Only employees can mark an order as complete
        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Find the order by ID
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Update the order status to completed
        $order->status = 'completed';
        $order->save();

        return response()->json(['message' => 'Order marked as complete']);
    }
}
