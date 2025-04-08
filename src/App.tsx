
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import Login from './pages/Login';
import { Container } from '@mui/material';
import Chat from './pages/Chat';
import Register from './pages/Register';
import Profile from './pages/profile';
import { ModalApp } from './components/ModalApp';



function App() {



  return (
    <Container maxWidth="md" sx={{ minHeight: "calc(100vh - 96px)" }}>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <ModalApp />
      </Router>
    </Container>
  )
}

export default App
