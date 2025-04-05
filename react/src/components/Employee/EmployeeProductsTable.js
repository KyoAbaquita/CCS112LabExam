import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import '../../App.css';

const EmployeeProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", stock: "", image: "" });
    const [deleteId, setDeleteId] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8000/api/products", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData(product);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setDeleteError("");
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8000/api/products/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter((product) => product.id !== deleteId));
            setShowDeleteModal(false);
        } catch (error) {
            setDeleteError("Error: This product is linked to an order and cannot be deleted.");
            console.error("Error deleting product:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:8000/api/products/${selectedProduct.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.map((product) => (product.id === selectedProduct.id ? { ...product, ...formData } : product)));
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div>
            <h3>Products</h3>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Image URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>₱{new Intl.NumberFormat().format(product.price)}</td>
                                <td>{product.stock}</td>
                                <td>{product.image}</td>
                                <td className="d-flex">
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(product)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Error Message */}
            {deleteError && <div className="alert alert-danger mt-2">{deleteError}</div>}
            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Product</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
                                <input type="text" className="form-control mb-2" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" />
                                <input type="number" className="form-control mb-2" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" />
                                <input type="number" className="form-control mb-2" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" />
                                <input type="text" className="form-control mb-2" name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL" />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this product?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeProductsTable;
