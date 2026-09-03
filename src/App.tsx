import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { ProductPage } from "./layouts/SearchProductPage/ProductPage";
import { AdminProductsPage } from "./layouts/SearchProductPage/AdminProductsPage";
import { EditProduct } from "./layouts/ManageProductsPage/components/EditProduct";
import { AddNewProduct } from "./layouts/ManageProductsPage/components/AddNewProduct";
import { HomePage } from "./layouts/HomePage/HomePage";
import { OrdersPage } from "./layouts/SearchProductPage/OrdersPage";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedPage } from "./layouts/protectedPage/ProtectedPage";
import { PrivateRoute } from "./auth/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/home" element={<HomePage />} />

            <Route path="/products" element={<ProductPage />} />

            <Route path="/products/edit/:id" element={<EditProduct />} />

            <Route path="/products/add" element={<AddNewProduct />} />

            <Route path="/orders" element={<OrdersPage />} />

            <Route path="/admin" element={<AdminProductsPage />} />

            <Route
              path="/protectedPage"
              element={
                <PrivateRoute>
                  <ProtectedPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
