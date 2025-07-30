import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Welcomep";
import AboutUs from "./pages/AboutUs";
import BlogPage from "./pages/blog";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./components/contexts/AuthContext";
import Layout from "./components/layout/Layout";
import PredictionPage from  "./pages/PredictionPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<WelcomePage />} />

          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/prediction"
            element={
              <Layout>
                <PredictionPage />
              </Layout>
            }
          />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
