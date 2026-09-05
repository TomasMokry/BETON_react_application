export const HomePage = () => {
  return (
    <div className="image-text vh-100 d-flex align-items-center justify-content-center">
      <div className="row">
        <div className="col-md-12 text-center">
          <img
            src="./images/products/logo/be.ton_big.png"
            alt="logo"
            className="slide-down"
          />
          <p className="text-white mt-3">
            This is a beta version of the application. Feel free to sign in
            using the demo account below to explore the products and order
            management features.
            <br />
            Email: <b>admin@email.com</b>
            <br /> Password: <b>admin</b>
          </p>
        </div>
      </div>
    </div>
  );
};
