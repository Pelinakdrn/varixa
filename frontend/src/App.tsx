import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Welcomep";
import AboutUs from "./pages/AboutUs";
import BlogPage from "./pages/blog";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataSources from "./pages/DataSources"; // ✅ Eklendi
import { AuthProvider } from "./components/contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Prediction from "./pages/Prediction";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/prediction"
            element={
              <Layout>
                <Prediction />
              </Layout>
              }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/data-sources"
            element={
              <Layout>
                <DataSources />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
