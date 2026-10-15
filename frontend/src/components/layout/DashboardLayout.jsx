// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext.jsx';
// import Sidebar from './Sidebar.jsx';
// import Avatar from '../ui/Avatar.jsx';
// import Button from '../ui/Button.jsx';
// import { notificationService } from '../../services/notification.service.js';

// export function DashboardLayout({ items, title }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [unread, setUnread] = useState(0);
//   const [mobileNav, setMobileNav] = useState(false);

//   useEffect(() => {
//     let cancelled = false;
//     const load = async () => {
//       try {
//         const data = await notificationService.unreadCount();
//         if (!cancelled) setUnread(data?.count || 0);
//       } catch {
//         /* ignore */
//       }
//     };
//     load();
//     const t = setInterval(load, 30000);
//     return () => {
//       cancelled = true;
//       clearInterval(t);
//     };
//   }, []);

//   const onLogout = async () => {
//     await logout();
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-ink-50">
//       <header className="sticky top-0 z-40 bg-white border-b border-ink-100">
//         <div className="container-page flex items-center justify-between h-16">
//           <div className="flex items-center gap-3">
//             <button
//               className="lg:hidden p-2 rounded-lg hover:bg-ink-100"
//               onClick={() => setMobileNav((v) => !v)}
//               aria-label="Open navigation"
//             >
//               <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
//               <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
//               <span className="block w-5 h-0.5 bg-ink-700" />
//             </button>
//             <Link to="/" className="flex items-center gap-2">
//               <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
//                 EV
//               </span>
//               <span className="font-bold">{title}</span>
//             </Link>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link
//               to={items.find((i) => i.to.includes('notifications'))?.to || '#'}
//               className="relative p-2 rounded-lg hover:bg-ink-100 text-xl"
//               aria-label="Notifications"
//             >
//               🔔
//               {unread > 0 && (
//                 <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center px-1">
//                   {unread > 99 ? '99+' : unread}
//                 </span>
//               )}
//             </Link>
//             <div className="hidden sm:flex items-center gap-2">
//               <Avatar name={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email} size="sm" />
//               <span className="text-sm font-medium text-ink-700">{user?.firstName || user?.email}</span>
//             </div>
//             <Button variant="ghost" size="sm" onClick={onLogout}>
//               Log out
//             </Button>
//           </div>
//         </div>
//         {mobileNav && (
//           <div className="lg:hidden border-t border-ink-100 bg-white max-h-[60vh] overflow-y-auto">
//             <nav className="p-3 flex flex-col gap-1">
//               {items.map((item) => (
//                 <NavLinkMobile key={item.to} item={item} onClick={() => setMobileNav(false)} />
//               ))}
//             </nav>
//           </div>
//         )}
//       </header>

//       <div className="flex flex-1">
//         <Sidebar items={items} base={title} />
//         <main className="flex-1 min-w-0">
//           <div className="container-page py-8">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function NavLinkMobile({ item, onClick }) {
//   return (
//     <Link
//       to={item.to}
//       onClick={onClick}
//       className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50"
//     >
//       <span className="w-5 text-center">{item.icon}</span>
//       <span>{item.label}</span>
//     </Link>
//   );
// }

// export default DashboardLayout;


import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import Avatar from '../ui/Avatar.jsx';
import Button from '../ui/Button.jsx';
import { notificationService } from '../../services/notification.service.js';

export function DashboardLayout({ items, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await notificationService.unreadCount();
        if (!cancelled) setUnread(data?.count || 0);
      } catch {
        /* ignore */
      }
    };
    load();
    const t = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  const notificationsPath =
    items.find((i) => i.to.includes('notifications'))?.to || '#';

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <header className="sticky top-0 z-40 glass border-b border-ink-200/60">
        <div className="container-page flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-ink-100"
              onClick={() => setMobileNav((v) => !v)}
              aria-label="Open navigation"
            >
              <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
              <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
              <span className="block w-5 h-0.5 bg-ink-700" />
            </button>
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl btn-gradient text-white font-bold text-sm shadow-glow group-hover:scale-105 transition-transform">
                EV
              </span>
              <span className="font-bold text-ink-900 tracking-tight hidden sm:inline">
                {title}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={notificationsPath}
              className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-ink-100 transition"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Zm4 12a2 2 0 0 0 4 0"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
            <div className="hidden sm:flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-ink-100 transition">
              <Avatar
                name={
                  user?.firstName
                    ? `${user.firstName} ${user.lastName || ''}`
                    : user?.email
                }
                size="sm"
              />
              <span className="text-sm font-medium text-ink-700">
                {user?.firstName || user?.email}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </div>
        {mobileNav && (
          <div className="lg:hidden border-t border-ink-100 bg-white max-h-[60vh] overflow-y-auto animate-slide-up">
            <nav className="p-3 flex flex-col gap-1">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNav(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100"
                >
                  <span className="w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        <Sidebar items={items} base={title} />
        <main className="flex-1 min-w-0">
          <div className="container-page py-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;