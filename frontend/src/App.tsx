import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Welcomep";
import AboutUs from "./pages/AboutUs";
import BlogPage from "./pages/blog"; 
import LoginPage from "./pages/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/About" element={<AboutUs />} /> 
        <Route path="/Blog" element={<BlogPage />} /> 
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
