import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import ScrollToTop from "../components/layout/ScrollToTop";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/Login/ForgotPassword";
import ResetPassword from "../pages/Login/ResetPassword";
import Recipes from "../pages/Recipes/Recipes";
import RecipeDetails from "../pages/RecipeDetails/RecipeDetails";
import AddRecipe from "../pages/AddRecipe/AddRecipe";
import EditRecipe from "../pages/EditRecipe/EditRecipe";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import DesignSystem from "../pages/DesignSystem/DesignSystem";
import NotFound from "../pages/NotFound/NotFound";
import HighImpactProjects from "../pages/Projects/HighImpactProjects";
import CreatorDashboard from "../pages/CreatorDashboard";
import PricingPage from "../pages/PricingPage";
import CommunityFeed from "../pages/CommunityFeed";
import SavedRecipes from "../pages/Dashboard/SavedRecipes";
import Settings from "../pages/Dashboard/Settings";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminUsers from "../pages/Admin/Users";
import AdminRecipes from "../pages/Admin/Recipes";
import AdminCategories from "../pages/Admin/Categories";
import AdminComments from "../pages/Admin/Comments";
import AdminReports from "../pages/Admin/Reports";
import AdminAnalytics from "../pages/Admin/Analytics";
import AdminSettings from "../pages/Admin/Settings";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Main Site Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="recipes" element={<Recipes />} />
                    <Route path="recipes/:id" element={<RecipeDetails />} />
                    <Route path="pricing" element={<PricingPage />} />
                    <Route path="design-system" element={<DesignSystem />} />
                    
                    {/* Protected Main Site Actions */}
                    <Route path="add-recipe" element={
                        <ProtectedRoute>
                            <AddRecipe />
                        </ProtectedRoute>
                    } />
                    <Route path="edit-recipe/:id" element={
                        <ProtectedRoute>
                            <EditRecipe />
                        </ProtectedRoute>
                    } />
                </Route>

                {/* Protected Dashboard Panel Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="saved" element={<SavedRecipes />} />
                    <Route path="settings" element={<Settings />} />
                    
                    {/* Coming soon components */}
                    <Route path="feed" element={<CommunityFeed />} />
                    <Route path="creator-dashboard" element={<CreatorDashboard />} />
                    <Route path="projects/high-impact" element={<HighImpactProjects />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="recipes" element={<AdminRecipes />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="comments" element={<AdminComments />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* 404 Not Found Page */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}