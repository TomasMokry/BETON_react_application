import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark header-gradient py-2">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          to="/home"
          style={{ marginLeft: "100px" }}
        >
          <img
            src="/images/products/logo/be.ton_small.png"
            alt="Beton Key Logo"
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">
                {" "}
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/orders">
                {" "}
                Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin">
                {" "}
                Admin
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item m-1 d-none d-lg-flex align-items-center">
                  <span className="navbar-text text-light me-3">
                    Hello, {user?.name || "User"}
                  </span>
                </li>
                <li className="nav-item m-1">
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={logout}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item m-1">
                <NavLink to="/login" className="btn btn-outline-light">
                  Sign in
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
