import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../App.css';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not authenticated.");

                const response = await axios.get("http://localhost:8000/api/my-orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setOrders(response.data || []);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                    orders.map((order) =>
                        order.items.map((item) => (
                            <tr key={item.id}>
                                <td>{order.id}</td>
                                <td>{item.product?.name || "Unknown Product"}</td>
                                <td>{item.quantity}</td>
                                <td>₱{(item.product?.price * item.quantity) || 0}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))
                    )
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>No orders found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default OrderTable;