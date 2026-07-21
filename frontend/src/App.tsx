import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ScanDetails from "./pages/ScanDetails";
import UploadFile from "./pages/UploadFile";

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scans/:scanId" element={<ScanDetails />} />
        <Route path="/upload" element={<UploadFile />} />
        <Route path="*" element={<Navigate to="/upload" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
