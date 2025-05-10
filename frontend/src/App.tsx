import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Welcomep";
import AboutUs from "./pages/AboutUs";
import BlogPage from "./pages/blog";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./components/contexts/AuthContext";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Giriş öncesi sayfalar */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<Login />} />

          {/* Giriş sonrası sayfalar layout içinde */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
