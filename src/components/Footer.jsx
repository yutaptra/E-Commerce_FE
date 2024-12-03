const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p>&copy; {new Date().getFullYear()} Yuta Shop. All Rights Reserved.</p>
            <div>
              <a href="https://www.facebook.com/yutaptra" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook fa-lg"></i> Facebook
              </a>
              <a href="https://www.instagram.com/yutaptra" className="text-white me-3" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram fa-lg"></i> Instagram
              </a>
              <a href="https://www.twitter.com/yutaptra" className="text-white" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter fa-lg"></i> Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
