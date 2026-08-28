import { useEffect, useState } from "react";
import { CategoryNavbar } from "./components/CategoryNavbar";
import ProductModel from "../../models/ProductModel";
import CategoryModel from "../../models/CategoryModel";
import { Product } from "./components/Product";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import type CartModel from "../../models/CartModel";

export const ProductPage = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [cart, setCart] = useState<CartModel | null>(null);

  // CREATE CART
  const createCart = async () => {
    const response = await fetch(
      "https://beton-production.up.railway.app/carts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Cannot create cart");
    }

    const data: CartModel = await response.json();

    localStorage.setItem("cartId", data.id);

    setCart(data);
  };

  //FETCH CART
  const fetchCart = async () => {
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
      throw new Error("No cart ID");
    }

    const response = await fetch(
      `https://beton-production.up.railway.app/carts/${cartId}`,
    );

    if (!response.ok) {
      throw new Error("Cannot load cart");
    }

    const data: CartModel = await response.json();

    setCart(data);
  };

  //ADD TO CART
  const addToCart = async (productId: number) => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetch(
        `https://beton-production.up.railway.app/carts/${cart.id}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        },
      );

      if (!response.ok) {
        throw new Error("Cannot add product to cart");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
    }
  };

  const deleteCartItem = async (productId: number) => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetch(
        `https://beton-production.up.railway.app/carts/${cart.id}/items/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Cannot delete cart item");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
    }
  };

  const checkout = async (paymentMethod: "CARD" | "CASH") => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetch(
        "https://beton-production.up.railway.app/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId: cart.id,
            paymentMethod: paymentMethod,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();

      console.log("Checkout successful:", data);

      // Refresh cart after successful checkout
      await fetchCart();
      await fetchProducts();
    } catch (err: any) {
      setHttpError(err.message);
    }
  };

  const clearCart = async () => {
    if (!cart) {
      return;
    }

    try {
      const response = await fetch(
        `https://beton-production.up.railway.app/carts/${cart.id}/items`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Cannot clear cart");
      }

      await fetchCart();
    } catch (err: any) {
      setHttpError(err.message);
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      const cartId = localStorage.getItem("cartId");

      if (!cartId) {
        await createCart();
        return;
      }

      try {
        await fetchCart();
      } catch {
        // Stored cart doesn't exist anymore
        localStorage.removeItem("cartId");

        // Create a fresh cart
        await createCart();
      }
    };

    initializeCart().catch((err: any) => {
      setHttpError(err.message);
    });
  }, []);

  // Load categories ONCE
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(
        "https://beton-production.up.railway.app/categories",
      );
      if (!response.ok) throw new Error("Cannot load categories");

      const data: CategoryModel[] = await response.json();

      setCategories(data);
    };

    fetchCategories().catch((err: any) => setHttpError(err.message));
  }, []);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);

    try {
      let url = "https://beton-production.up.railway.app/products";

      if (selectedCategory !== null) {
        url += `?categoryId=${selectedCategory}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Cannot load products");
      }

      const data: ProductModel[] = await response.json();

      setProducts(data);
    } catch (err: any) {
      setHttpError(err.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Load products on category change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  if (isLoadingProducts) return <SpinnerLoading />;

  return (
    <div>
      <CategoryNavbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {httpError && (
        <div className="alert alert-danger" role="alert">
          {httpError}
        </div>
      )}

      <div className="d-flex">
        <div className="p-3 overflow-auto flex-grow-1">
          {/* LEFT PRODUCT GRID */}
          {isLoadingProducts ? (
            <div>Loading products...</div>
          ) : (
            <div className="row row-cols-1 row-cols-md-4 g-3 mx-1">
              {products.map((product) => (
                <Product
                  product={product}
                  key={product.id}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div
          className="d-flex flex-column flex-shrink-0 p-3 bg-light"
          style={{
            width: "450px",
            height: "100vh",
            position: "sticky",
            top: 0,
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong className="fs-3">Total Price</strong>
            <span className="fs-5">
              {cart?.totalPrice.toFixed(2) ?? "0.00"} Kč
            </span>
          </div>

          <hr />

          {/* LIST GROUP */}
          <div className="list-group list-group-flush">
            {cart?.items.length === 0 && (
              <div className="text-muted text-center py-3">
                Your cart is empty
              </div>
            )}

            {cart?.items.map((item) => (
              <div
                key={item.product.id}
                className="list-group-item py-3 lh-tight"
              >
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">
                    {item.product.name} - {item.quantity}x
                  </strong>

                  <div className="d-flex align-items-center gap-3">
                    <small>{item.totalPrice.toFixed(2)} Kč</small>

                    <button
                      type="button"
                      className="btn p-0 border-0"
                      onClick={() => deleteCartItem(item.product.id)}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-x-circle text-secondary"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="small text-muted">
                  {item.product.price.toFixed(2)} Kč / piece
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn btn-outline-secondary w-100 p-2 mb-2 mt-3"
            onClick={clearCart}
          >
            Clear Cart
          </button>

          <hr />

          {/* ACTION BUTTONS */}
          <div className="d-flex flex-column gap-2">
            <button
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center mt-auto"
              onClick={() => checkout("CARD")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-credit-card-2-back-fill"
                viewBox="0 0 16 16"
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5H0zm11.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1z" />
              </svg>
              <span className="ms-3">Complete with Card</span>
            </button>

            <button
              className="btn btn-primary w-100 p-2 mb-2"
              onClick={() => checkout("CASH")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-cash-stack"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
              </svg>
              <span className="ms-3">Complete with Cash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
