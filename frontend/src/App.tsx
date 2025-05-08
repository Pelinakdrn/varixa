import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Welcomep";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/About" element={<AboutUs />} /> 
      </Routes>
    </Router>
  );
}

export default App;
