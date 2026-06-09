import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageExams from "./pages/admin/ManageExams";
import ManageBans from "./pages/admin/ManageBans";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateExam from "./pages/teacher/CreateExam";
import TeacherExams from "./pages/teacher/TeacherExams";
import StudentDashboard from "./pages/student/StudentDashboard";
import TakeExam from "./pages/student/TakeExam";
import ViewResults from "./pages/student/ViewResults";
import ResultCard from "./pages/student/ResultCard";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/redirect" />}
      />
      <Route path="/redirect" element={<RoleRedirect />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="teachers" element={<ManageTeachers />} />
        <Route path="exams" element={<ManageExams />} />
        <Route path="bans" element={<ManageBans />} />
      </Route>

      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="create-exam" element={<CreateExam />} />
        <Route path="exams" element={<TeacherExams />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="exam/:examId" element={<TakeExam />} />
        <Route path="results" element={<ViewResults />} />
        <Route path="results/:resultId" element={<ResultCard />} />
      </Route>
    </Routes>
  );
}

// Redirect to correct dashboard based on role
function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  const rolePaths: Record<string, string> = {
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
  };

  return <Navigate to={rolePaths[user.role] || "/"} />;
}

export default App;
