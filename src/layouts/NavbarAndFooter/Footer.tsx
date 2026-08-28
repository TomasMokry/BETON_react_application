export const Footer = () => {
  return (
    <div className="footer-gradient">
      <footer
        className="container d-flex flex-wrap 
                justify-content-between align-items-center py-3"
      >
        <p className="col-md-4 mb-0 text-white">© TOMO</p>
        <ul className="nav navbar-dark col-md-4 justify-content-end">
          <li className="nav-item">
            <a href="#" className="nav-link px-2 text-white">
              E-shop
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};
