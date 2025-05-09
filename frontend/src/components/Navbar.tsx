import { Link } from "react-router-dom";
import "../css/button.css";
import logo from "../assets/logo.png"; 

const Navbar = () => {
  return (
    <>
      <nav className="text-white bg-[#0b1222] fixed w-full z-20 top-0 start-0 border-b border-gray-800">
        <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
          {/* Sol - Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-1">
              <img src={logo} className="h-[55px]" alt="varixa Logo" />
              <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
                VARIXA
              </span>
            </Link>
          </div>

          {/* Orta - Menü */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-8 text-sm font-large text-[20px] text-white">
              <li>
                <Link to="/" className="text-blue-300">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-blue-300">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-white hover:text-blue-300">Features</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white hover:text-blue-300">Contact</Link>
              </li>
              <li>
                <Link to="/blog" className="text-white hover:text-blue-300">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Sağ - Buton */}
          <div className="flex-shrink-0 buttons">
            <Link to="/login">
              <button className="blob-btn">
                Log In
                <span className="blob-btn__inner">
                  <span className="blob-btn__blobs">
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                  </span>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
