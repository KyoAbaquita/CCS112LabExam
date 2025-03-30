import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Register from "./components/Register";
import EmployeeRegister from "./components/EmployeeRegister"; 
import Dashboard from "./components/Dashboard";
import Cart from "./components/Customer/Cart"; 

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Hidden Route: Employee Registration (No navigation link) */}
                <Route path="/employee-register" element={<EmployeeRegister />} />

                {/* Protected Routes */}
                <Route
                    path="/cart"
                    element={isAuthenticated() ? <Cart /> : <Navigate to="/login" />}
                />
                <Route
                    path="/dashboard"
                    element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
                />

                {/* Redirect unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
