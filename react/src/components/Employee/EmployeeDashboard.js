import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import EmployeeProductsTable from "./EmployeeProductsTable";
import OrdersTable from "./OrdersTable";
import axios from "axios";

const EmployeeDashboard = () => {
    const [view, setView] = useState("products");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", image: "" });
    const [loading, setLoading] = useState(false);
    const [refreshProducts, setRefreshProducts] = useState(false); // ✅ Track refresh state

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:8000/api/products", newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddModal(false);
            setNewProduct({ name: "", description: "", price: "", stock: "", image: "" });
            setRefreshProducts((prev) => !prev); // ✅ Toggle state to refresh table
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="text-center mb-4">
                    <h2 className="text-primary">Employee Dashboard</h2>
                    <p>Manage products and view orders</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="btn-group">
                        <button className={`btn ${view === "products" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("products")}>Products</button>
                        <button className={`btn ${view === "orders" ? "btn-secondary" : "btn-outline-secondary"}`} onClick={() => setView("orders")}>Orders</button>
                    </div>
                    {view === "products" && (
                        <button className="btn btn-success" onClick={() => setShowAddModal(true)}>Add Product</button>
                    )}
                </div>
                <div className="card p-3 shadow-lg">
                    {view === "products" ? <EmployeeProductsTable key={refreshProducts} /> : <OrdersTable />}
                </div>

                {showAddModal && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Product</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <input type="text" className="form-control mb-2" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" />
                                    <input type="text" className="form-control mb-2" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" />
                                    <input type="number" className="form-control mb-2" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price" />
                                    <input type="number" className="form-control mb-2" name="stock" value={newProduct.stock} onChange={handleInputChange} placeholder="Stock" />
                                    <input type="text" className="form-control mb-2" name="image" value={newProduct.image} onChange={handleInputChange} placeholder="Image URL" />
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleAddProduct} disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default EmployeeDashboard;
