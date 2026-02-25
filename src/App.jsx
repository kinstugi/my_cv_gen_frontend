import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import ResumeList from './pages/ResumeList.jsx';
import ResumeDetail from './pages/ResumeDetail.jsx';
import ResumeForm from './pages/ResumeForm.jsx';
import Home from './pages/Home.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="resumes" element={<ProtectedRoute><ResumeList /></ProtectedRoute>} />
            <Route path="resumes/new" element={<ProtectedRoute><ResumeForm /></ProtectedRoute>} />
            <Route path="resumes/:id" element={<ProtectedRoute><ResumeDetail /></ProtectedRoute>} />
            <Route path="resumes/:id/edit" element={<ProtectedRoute><ResumeForm /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
