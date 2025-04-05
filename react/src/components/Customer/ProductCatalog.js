import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import './Product.css';

const ProductCatalog = ({ products }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleShowModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleAddToCart = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        setError(null);
    
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                setError("You need to be logged in to add to cart.");
                setLoading(false);
                return;
            }
    
            const response = await axios.post(
                "http://localhost:8000/api/cart",
                {
                    product_id: selectedProduct.id,
                    quantity: quantity,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }, 
                }
            );
    
            console.log("Added to cart:", response.data);
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                products.map((product) => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={product.image} className="card-img-top product-image" alt={product.name} />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text"><strong>₱{new Intl.NumberFormat().format(product.price)}</strong></p>
                                <button className="btn btn-primary" onClick={() => handleShowModal(product)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Modal for adding to cart */}
            {selectedProduct && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProduct.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={selectedProduct.image} className="img-fluid mb-3" alt={selectedProduct.name} />
                        <p>{selectedProduct.description}</p>
                        <p><strong>Price:</strong> ₱{new Intl.NumberFormat().format(selectedProduct.price)}</p>
                        <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                        {error && <p className="text-danger">{error}</p>}
                        <Form>
                            <Form.Group controlId="quantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    min="1" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))} 
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddToCart} disabled={loading}>
                            {loading ? "Adding..." : "Add to Cart"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ProductCatalog;