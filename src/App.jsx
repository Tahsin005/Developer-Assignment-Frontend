import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import LoginPage from './pages/LoginPage/LoginPage'
import NavBar from './components/NavBar/NavBar'
import Hero from './pages/Hero/Hero'
import PasswordResetRequestPage from './pages/PasswordResetRequestPage/PasswordResetRequestPage'
import PasswordResetPage from './pages/PasswordResetPage/PasswordResetPage'
import VerifyEmailPage from './pages/VerifyEmailPage/VerifyEmailPage'
import ResendVerificationPage from './pages/ResendVerificationPage/ResendVerificationPage'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import LogoutPage from './pages/LogoutPage/LogoutPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import SelfOnlyRoute from './components/SelfOnlyRoute/SelfOnlyRoute'
import UserDetailsPage from './pages/UserDetailsPage/UserDetailsPage'
import UpdateUserPage from './pages/UpdateUserPage/UpdateUserPage'
import RequestDeletionPage from './pages/RequestDeletionPage/RequestDeletionPage'
import RoleBasedRoute from './components/RoleBasedRoute/RoleBasedRoute'
import DeleteUserPage from './pages/DeleteUserPage/DeleteUserPage'
import UserListPage from './pages/UserListPage/UserListPage'
import ChangeRolePage from './pages/ChangeRolePage/ChangeRolePage'
import PromoteModeratorPage from './pages/PromoteModeratorPage/PromoteModeratorPage'
import DemoteUserPage from './pages/DemoteUserPage/DemoteUserPage'
import RoleManagementPage from './pages/RoleManagementPage/RoleManagementPage'
import PermissionManagementPage from './pages/PermissionManagementPage/PermissionManagementPage'
import SystemAdminOnlyRoute from './components/SystemAdminOnlyRoute/SystemAdminOnlyRoute'
import PromoteAdminPage from './pages/PromoteAdminPage/PromoteAdminPage'
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage'

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/password/reset-request" element={<PasswordResetRequestPage />} />
        <Route path="/password/reset" element={<PasswordResetPage />} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/me/permissions" element={<ProfilePage />} />
        </Route>

        <Route path="/users/:user_id" element={<SelfOnlyRoute />}>
          <Route index element={<UserDetailsPage />} />
          <Route path="update" element={<UpdateUserPage />} />
          <Route path="request-deletion" element={<RequestDeletionPage />} />
        </Route>

        <Route
          element={<RoleBasedRoute allowedRoles={['moderator', 'admin', 'system_admin']} />}
        >
          <Route path="/users/:user_id/delete" element={<DeleteUserPage />} />
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={['admin', 'system_admin']} />}>
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/:user_id/role" element={<ChangeRolePage />} />
          <Route path="/users/:user_id/promote/moderator" element={<PromoteModeratorPage />} />
          <Route path="/users/:user_id/demote" element={<DemoteUserPage />} />
          <Route path="/roles" element={<RoleManagementPage />} />
          <Route path="/roles/:role_id" element={<RoleManagementPage />} />
          <Route path="/roles/create" element={<RoleManagementPage />} />
          <Route path="/roles/:role_id/update" element={<RoleManagementPage />} />
          <Route path="/roles/:role_id/delete" element={<RoleManagementPage />} />
          <Route path="/permissions" element={<PermissionManagementPage />} />
          <Route path="/permissions/:permission_id" element={<PermissionManagementPage />} />
        </Route>

        <Route element={<SystemAdminOnlyRoute />}>
          <Route path="/users/:user_id/promote/admin" element={<PromoteAdminPage />} />
        </Route>

        <Route path="/" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    </div>
  )
}

export default App