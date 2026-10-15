// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext.jsx';
// import Button from '../ui/Button.jsx';
// import Avatar from '../ui/Avatar.jsx';

// export function Navbar() {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const links = [
//     { to: '/how-it-works', label: 'How it works' },
//     { to: '/find-vas', label: 'Find VAs' },
//     { to: '/about', label: 'About' },
//     { to: '/contact', label: 'Contact' }
//   ];

//   const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'va' ? '/va/dashboard' : '/client/dashboard';

//   const onLogout = async () => {
//     await logout();
//     navigate('/');
//   };

//   return (
//     <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-ink-100">
//       <div className="container-page flex items-center justify-between h-16">
//         <Link to="/" className="flex items-center gap-2">
//           <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
//             EV
//           </span>
//           <span className="font-bold text-ink-900">EcomVA Verify</span>
//         </Link>

//         <nav className="hidden md:flex items-center gap-6">
//           {links.map((l) => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               className={({ isActive }) =>
//                 `text-sm font-medium ${isActive ? 'text-brand-700' : 'text-ink-600 hover:text-ink-900'}`
//               }
//             >
//               {l.label}
//             </NavLink>
//           ))}
//         </nav>

//         <div className="hidden md:flex items-center gap-3">
//           {isAuthenticated ? (
//             <>
//               <Link to={dashboardPath} className="flex items-center gap-2">
//                 <Avatar name={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email} size="sm" />
//                 <span className="text-sm font-medium text-ink-700">{user?.firstName || user?.email}</span>
//               </Link>
//               <Button variant="secondary" size="sm" onClick={onLogout}>
//                 Log out
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button variant="ghost" size="sm" to="/login">
//                 Log in
//               </Button>
//               <Button size="sm" to="/register">
//                 Get started
//               </Button>
//             </>
//           )}
//         </div>

//         <button
//           className="md:hidden p-2 rounded-lg hover:bg-ink-100"
//           onClick={() => setOpen((o) => !o)}
//           aria-label="Menu"
//         >
//           <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
//           <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
//           <span className="block w-5 h-0.5 bg-ink-700" />
//         </button>
//       </div>

//       {open && (
//         <div className="md:hidden border-t border-ink-100 bg-white">
//           <div className="container-page py-3 flex flex-col gap-2">
//             {links.map((l) => (
//               <NavLink
//                 key={l.to}
//                 to={l.to}
//                 onClick={() => setOpen(false)}
//                 className="py-2 text-sm text-ink-700"
//               >
//                 {l.label}
//               </NavLink>
//             ))}
//             <div className="pt-2 border-t border-ink-100 flex flex-col gap-2">
//               {isAuthenticated ? (
//                 <>
//                   <Button to={dashboardPath} size="sm">Dashboard</Button>
//                   <Button variant="secondary" size="sm" onClick={onLogout}>Log out</Button>
//                 </>
//               ) : (
//                 <>
//                   <Button to="/login" variant="secondary" size="sm">Log in</Button>
//                   <Button to="/register" size="sm">Get started</Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Navbar;


import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';
import Avatar from '../ui/Avatar.jsx';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/how-it-works', label: 'How it works' },
    { to: '/find-vas', label: 'Find VAs' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'va'
      ? '/va/dashboard'
      : '/client/dashboard';

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-ink-200/60">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl btn-gradient text-white font-bold text-sm shadow-glow group-hover:scale-105 transition-transform">
            EV
          </span>
          <span className="font-bold text-ink-900 tracking-tight">EcomVA Verify</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-3.5 py-2 text-sm font-medium rounded-lg transition ${
                  isActive
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-100/60'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-ink-100 transition"
              >
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
              </Link>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" to="/login">
                Log in
              </Button>
              <Button size="sm" to="/register">
                Get started
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-ink-100"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
          <span className="block w-5 h-0.5 bg-ink-700 mb-1" />
          <span className="block w-5 h-0.5 bg-ink-700" />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white/95 backdrop-blur-lg animate-slide-up">
          <div className="container-page py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-100"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="pt-3 mt-2 border-t border-ink-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Button to={dashboardPath} size="sm">
                    Dashboard
                  </Button>
                  <Button variant="secondary" size="sm" onClick={onLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button to="/login" variant="secondary" size="sm">
                    Log in
                  </Button>
                  <Button to="/register" size="sm">
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;