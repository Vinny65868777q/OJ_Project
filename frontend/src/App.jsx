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
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProtectedAdminRoute from './Routes/ProtectedAdminRoute';
import AddProblem from './pages/Admin/AddProblem';
import AddTestCases from './pages/Admin/AddTestCases';
import ProblemDetail from './components/ProblemDetail';
import SubmissionDetail from './pages/SubmissionDetail';
import ContestDetail from './pages/Admin/AddContest';
import AddContest from './pages/Admin/AddContest';
import ManageProblems from './pages/Admin/ManageProblem';
import ContestDetailavailable from './pages/ContestDetail';
import ContestLeaderboard from './pages/ContestLeaderBoard';

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
        <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/add-problem" element={<ProtectedAdminRoute><AddProblem /></ProtectedAdminRoute>} />
        <Route path="/admin/problem/:problemId/add-testcases" element={<ProtectedAdminRoute><AddTestCases /></ProtectedAdminRoute>} />
        <Route path="/admin/createContest" element={<ProtectedAdminRoute><AddContest /></ProtectedAdminRoute>} />
        <Route path="/admin/manage-problems" element={<ProtectedAdminRoute> <ManageProblems /></ProtectedAdminRoute>} />
        <Route path="/contests/:id" element={<ContestDetailavailable />}/>
          <Route path="/problems/:id" element={<ProblemDetail/>}/>
          <Route path="/contests/:cid/problems/:pid" element={<ProblemDetail />} />
          <Route path="/submission/:id"    element={<SubmissionDetail />} />
          <Route path="/contests/:id/leaderboard" element={<ContestLeaderboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
