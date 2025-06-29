import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Submissions from './pages/Submissions';
import Leaderboard from './pages/Leaderboard';
import HomePage from './pages/HomePage';
import MainLayout from './layout/MainLayout';
import PrivateRoute from './Routes/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="problems" element={<PrivateRoute><Problems /></PrivateRoute>} />
          <Route path="submission" element={<PrivateRoute><Submissions /></PrivateRoute>} />
          <Route path="leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
