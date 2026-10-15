import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from '../components/layout/PublicLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

import Landing from '../pages/public/Landing.jsx';
import Login from '../pages/public/Login.jsx';
import Register from '../pages/public/Register.jsx';
import ForgotPassword from '../pages/public/ForgotPassword.jsx';
import ResetPassword from '../pages/public/ResetPassword.jsx';
import HowItWorks from '../pages/public/HowItWorks.jsx';
import FindVAs from '../pages/public/FindVAs.jsx';
import PublicVAProfile from '../pages/public/PublicVAProfile.jsx';
import About from '../pages/public/About.jsx';
import Contact from '../pages/public/Contact.jsx';
import Terms from '../pages/public/Terms.jsx';
import Privacy from '../pages/public/Privacy.jsx';
import NotFound from '../pages/public/NotFound.jsx';

import ClientDashboard from '../pages/client/Dashboard.jsx';
import ClientProfile from '../pages/client/Profile.jsx';
import ClientRequirements from '../pages/client/Requirements.jsx';
import ClientRequirementNew from '../pages/client/RequirementNew.jsx';
import ClientRequirementDetail from '../pages/client/RequirementDetail.jsx';
import ClientFindVAs from '../pages/client/FindVAs.jsx';
import ClientVADetail from '../pages/client/VADetail.jsx';
import ClientCompare from '../pages/client/Compare.jsx';
import ClientShortlist from '../pages/client/Shortlist.jsx';
import ClientTrialTasks from '../pages/client/TrialTasks.jsx';
import ClientTrialTaskDetail from '../pages/client/TrialTaskDetail.jsx';
import ClientHiring from '../pages/client/Hiring.jsx';
import ClientEngagementDetail from '../pages/client/EngagementDetail.jsx';
import ClientTasks from '../pages/client/Tasks.jsx';
import ClientPerformance from '../pages/client/Performance.jsx';
import ClientReviews from '../pages/client/Reviews.jsx';
import ClientNotifications from '../pages/client/Notifications.jsx';
import ClientMessages from '../pages/client/Messages.jsx';
import ClientSettings from '../pages/client/Settings.jsx';

import VADashboard from '../pages/va/Dashboard.jsx';
import VAProfile from '../pages/va/Profile.jsx';
import VASkills from '../pages/va/Skills.jsx';
import VAAssessments from '../pages/va/Assessments.jsx';
import VAAssessmentTake from '../pages/va/AssessmentTake.jsx';
import VAVerification from '../pages/va/Verification.jsx';
import VATrialTasks from '../pages/va/TrialTasks.jsx';
import VATrialTaskDetail from '../pages/va/TrialTaskDetail.jsx';
import VAHiring from '../pages/va/Hiring.jsx';
import VAEngagementDetail from '../pages/va/EngagementDetail.jsx';
import VATasks from '../pages/va/Tasks.jsx';
import VAPerformance from '../pages/va/Performance.jsx';
import VAReviews from '../pages/va/Reviews.jsx';
import VANotifications from '../pages/va/Notifications.jsx';
import VAMessages from '../pages/va/Messages.jsx';
import VASettings from '../pages/va/Settings.jsx';

import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminUsers from '../pages/admin/Users.jsx';
import AdminClients from '../pages/admin/Clients.jsx';
import AdminVAs from '../pages/admin/VAs.jsx';
import AdminVerification from '../pages/admin/Verification.jsx';
import AdminAssessments from '../pages/admin/Assessments.jsx';
import AdminQuestions from '../pages/admin/Questions.jsx';
import AdminTrialTasks from '../pages/admin/TrialTasks.jsx';
import AdminHiring from '../pages/admin/Hiring.jsx';
import AdminReviews from '../pages/admin/Reviews.jsx';
import AdminReports from '../pages/admin/Reports.jsx';
import AdminSuspensions from '../pages/admin/Suspensions.jsx';
import AdminAuditLogs from '../pages/admin/AuditLogs.jsx';
import AdminSettings from '../pages/admin/Settings.jsx';

const clientNav = [
  { to: '/client/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/client/profile', label: 'Profile', icon: '🏢' },
  { to: '/client/requirements', label: 'Requirements', icon: '📋' },
  { to: '/client/find-vas', label: 'Find VAs', icon: '🔎' },
  { to: '/client/compare', label: 'Compare', icon: '⚖️' },
  { to: '/client/shortlist', label: 'Shortlist', icon: '⭐' },
  { to: '/client/trial-tasks', label: 'Trial Tasks', icon: '🧪' },
  { to: '/client/hiring', label: 'Hiring', icon: '🤝' },
  { to: '/client/tasks', label: 'Tasks', icon: '✅' },
  { to: '/client/performance', label: 'Performance', icon: '📈' },
  { to: '/client/reviews', label: 'Reviews', icon: '💬' },
  { to: '/client/messages', label: 'Messages', icon: '✉️' },
  { to: '/client/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/client/settings', label: 'Settings', icon: '⚙️' }
];

const vaNav = [
  { to: '/va/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/va/profile', label: 'Profile', icon: '👤' },
  { to: '/va/skills', label: 'Skills', icon: '🛠️' },
  { to: '/va/assessments', label: 'Assessments', icon: '🧠' },
  { to: '/va/verification', label: 'Verification', icon: '🛡️' },
  { to: '/va/trial-tasks', label: 'Trial Tasks', icon: '🧪' },
  { to: '/va/hiring', label: 'Hiring', icon: '🤝' },
  { to: '/va/tasks', label: 'Tasks', icon: '✅' },
  { to: '/va/performance', label: 'Performance', icon: '📈' },
  { to: '/va/reviews', label: 'Reviews', icon: '💬' },
  { to: '/va/messages', label: 'Messages', icon: '✉️' },
  { to: '/va/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/va/settings', label: 'Settings', icon: '⚙️' }
];

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/clients', label: 'Clients', icon: '🏢' },
  { to: '/admin/vas', label: 'VAs', icon: '🧑‍💻' },
  { to: '/admin/verification', label: 'Verification', icon: '🛡️' },
  { to: '/admin/assessments', label: 'Assessments', icon: '🧠' },
  { to: '/admin/questions', label: 'Questions', icon: '❓' },
  { to: '/admin/trial-tasks', label: 'Trial Tasks', icon: '🧪' },
  { to: '/admin/hiring', label: 'Hiring', icon: '🤝' },
  { to: '/admin/reviews', label: 'Reviews', icon: '💬' },
  { to: '/admin/reports', label: 'Reports', icon: '🚩' },
  { to: '/admin/suspensions', label: 'Suspensions', icon: '⛔' },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' }
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/find-vas" element={<FindVAs />} />
        <Route path="/vas/:id" element={<PublicVAProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      {/* Client */}
      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <RoleRoute roles={['client']}>
              <DashboardLayout items={clientNav} title="EcomVA Verify · Client" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/client/dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="requirements" element={<ClientRequirements />} />
        <Route path="requirements/new" element={<ClientRequirementNew />} />
        <Route path="requirements/:id" element={<ClientRequirementDetail />} />
        <Route path="find-vas" element={<ClientFindVAs />} />
        <Route path="vas/:id" element={<ClientVADetail />} />
        <Route path="compare" element={<ClientCompare />} />
        <Route path="shortlist" element={<ClientShortlist />} />
        <Route path="trial-tasks" element={<ClientTrialTasks />} />
        <Route path="trial-tasks/:id" element={<ClientTrialTaskDetail />} />
        <Route path="hiring" element={<ClientHiring />} />
        <Route path="engagements/:id" element={<ClientEngagementDetail />} />
        <Route path="tasks" element={<ClientTasks />} />
        <Route path="performance" element={<ClientPerformance />} />
        <Route path="reviews" element={<ClientReviews />} />
        <Route path="notifications" element={<ClientNotifications />} />
        <Route path="messages" element={<ClientMessages />} />
        <Route path="messages/:conversationId" element={<ClientMessages />} />
        <Route path="settings" element={<ClientSettings />} />
      </Route>

      {/* VA */}
      <Route
        path="/va"
        element={
          <ProtectedRoute>
            <RoleRoute roles={['va']}>
              <DashboardLayout items={vaNav} title="EcomVA Verify · VA" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/va/dashboard" replace />} />
        <Route path="dashboard" element={<VADashboard />} />
        <Route path="profile" element={<VAProfile />} />
        <Route path="skills" element={<VASkills />} />
        <Route path="assessments" element={<VAAssessments />} />
        <Route path="assessments/:id" element={<VAAssessmentTake />} />
        <Route path="verification" element={<VAVerification />} />
        <Route path="trial-tasks" element={<VATrialTasks />} />
        <Route path="trial-tasks/:id" element={<VATrialTaskDetail />} />
        <Route path="hiring" element={<VAHiring />} />
        <Route path="engagements/:id" element={<VAEngagementDetail />} />
        <Route path="tasks" element={<VATasks />} />
        <Route path="performance" element={<VAPerformance />} />
        <Route path="reviews" element={<VAReviews />} />
        <Route path="notifications" element={<VANotifications />} />
        <Route path="messages" element={<VAMessages />} />
        <Route path="messages/:conversationId" element={<VAMessages />} />
        <Route path="settings" element={<VASettings />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute roles={['admin']}>
              <DashboardLayout items={adminNav} title="EcomVA Verify · Admin" />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="vas" element={<AdminVAs />} />
        <Route path="verification" element={<AdminVerification />} />
        <Route path="assessments" element={<AdminAssessments />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="trial-tasks" element={<AdminTrialTasks />} />
        <Route path="hiring" element={<AdminHiring />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="suspensions" element={<AdminSuspensions />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}