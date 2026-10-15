// import { NavLink } from 'react-router-dom';

// export function Sidebar({ items = [], base }) {
//   return (
//     <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white min-h-[calc(100vh-4rem)]">
//       <nav className="p-4 flex flex-col gap-1">
//         {items.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             end={item.end}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
//                 isActive
//                   ? 'bg-brand-50 text-brand-700'
//                   : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
//               }`
//             }
//           >
//             <span className="w-5 text-center">{item.icon}</span>
//             <span>{item.label}</span>
//           </NavLink>
//         ))}
//       </nav>
//       <div className="mt-auto p-4 text-xs text-ink-400 border-t border-ink-100">
//         {base}
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;


import { NavLink } from 'react-router-dom';

export function Sidebar({ items = [], base }) {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-200/70 bg-white/70 backdrop-blur-sm min-h-[calc(100vh-4rem)]">
      <nav className="p-3 flex flex-col gap-0.5 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-brand-50 to-accent-50 text-brand-800 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.14)]'
                  : 'text-ink-600 hover:bg-ink-100/60 hover:text-ink-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-[15px] transition ${
                    isActive ? 'text-brand-700' : 'text-ink-500 group-hover:text-ink-700'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4 text-[11px] text-ink-400 border-t border-ink-100">
        <div className="font-semibold text-ink-500 mb-0.5">{base}</div>
        <div>EcomVA Verify v1.0</div>
      </div>
    </aside>
  );
}

export default Sidebar;