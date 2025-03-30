import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar, Container, Nav, Button, Badge } from "react-bootstrap"; // 🛠 Import Bootstrap components
import { motion } from "framer-motion"; // 🛠 Import framer-motion
import { User, ShoppingCart } from "lucide-react"; // 🛠 Import icons from lucide-react



const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";
  const role = localStorage.getItem("role") || "User";
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");

        const response = await axios.get("http://localhost:8000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const totalItems = response.data.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartCount(totalItems);
      } catch (err) {
        console.error("Failed to fetch cart count:", err);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-lg p-3 mb-4 rounded"
      style={{
        background: "linear-gradient(135deg, #0033cc,rgb(0, 145, 241))",
        backdropFilter: "blur(15px)",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 102, 255, 0.7)",
        border: "1px solid rgba(0, 255, 255, 0.2)",
      }}
    >
      <Container fluid>
        {/* Brand Name - Frozen Neon Effect */}
        <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.3 }}>
          <Navbar.Brand
            href="/dashboard"
            className="text-light fw-bold fs-3"
            style={{
              letterSpacing: "2px",
              textShadow: "0 0 20px rgba(0, 255, 255, 0.9)",
              fontFamily: "Orbitron, sans-serif",
            }}
          >
            ❄️ MENG-Tech
          </Navbar.Brand>
        </motion.div>

        <Navbar.Toggle aria-controls="navbar" className="border-0 bg-light" />

        <Navbar.Collapse id="navbar">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {/* User Profile with Neon Blue Glow */}
            <motion.span
              className="text-light d-flex align-items-center gap-2 fw-semibold"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{
                textShadow: "0 0 10px rgba(0, 255, 255, 0.7)",
              }}
            >
              <User size={22} /> {username}
            </motion.span>

            {/* Shopping Cart for Customers */}
            {role === "customer" && (
              <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                <Button
                  variant="outline-light"
                  className="d-flex align-items-center gap-1 position-relative"
                  onClick={() => navigate("/cart")}
                  style={{
                    borderRadius: "10px",
                    padding: "10px 18px",
                    fontWeight: "600",
                    transition: "0.3s",
                    textShadow: "0 0 10px rgba(255,255,255,0.6)",
                  }}
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <Badge
                      bg="info"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{
                        fontSize: "14px",
                        boxShadow: "0 0 12px rgba(0,255,255,0.9)",
                        color: "black",
                      }}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            )}

            {/* 🚀❄️ Logout Button - Ice Glow Effect */}
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <Button
                variant="outline-info"
                onClick={handleLogout}
                style={{
                  color:"black",
                  transition: "0.3s",
                  fontWeight: "600",
                  borderRadius: "10px",
                  padding: "10px 18px",
                  textShadow: "0 0 12px rgba(250, 5, 5, 0.8)",
                  boxShadow: "0 0 20px rgb(7, 60, 207)",
                }}
              >
                 Logout
              </Button>
            </motion.div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
