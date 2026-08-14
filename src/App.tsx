import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import VetsPage from "./pages/VetsPage";
import VetDetailPage from "./pages/VetDetailPage";
import PetsPage from "./pages/PetsPage";
import PetDetailPage from "./pages/PetDetailPage";
import LoginPage from "./pages/LoginPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="vets" element={<VetsPage />} />
                <Route path="vets/:id" element={<VetDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="pets" element={<PetsPage />} />
                    <Route path="pets/:id" element={<PetDetailPage />} />
                    <Route path="appointments" element={<AppointmentsPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;