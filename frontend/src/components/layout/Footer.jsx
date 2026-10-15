// import { Link } from 'react-router-dom';

// export function Footer() {
//   return (
//     <footer className="bg-white border-t border-ink-100 mt-16">
//       <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
//         <div className="col-span-2">
//           <div className="flex items-center gap-2 mb-3">
//             <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
//               EV
//             </span>
//             <span className="font-bold">EcomVA Verify</span>
//           </div>
//           <p className="text-sm text-ink-500 max-w-sm">
//             Hire based on verified e-commerce skills, not just resumes.
//           </p>
//         </div>
//         <div>
//           <div className="font-semibold text-sm mb-3">Product</div>
//           <ul className="space-y-2 text-sm text-ink-600">
//             <li><Link to="/how-it-works" className="hover:text-ink-900">How it works</Link></li>
//             <li><Link to="/find-vas" className="hover:text-ink-900">Find VAs</Link></li>
//             <li><Link to="/register" className="hover:text-ink-900">Get started</Link></li>
//           </ul>
//         </div>
//         <div>
//           <div className="font-semibold text-sm mb-3">Company</div>
//           <ul className="space-y-2 text-sm text-ink-600">
//             <li><Link to="/about" className="hover:text-ink-900">About</Link></li>
//             <li><Link to="/contact" className="hover:text-ink-900">Contact</Link></li>
//             <li><Link to="/terms" className="hover:text-ink-900">Terms</Link></li>
//             <li><Link to="/privacy" className="hover:text-ink-900">Privacy</Link></li>
//           </ul>
//         </div>
//       </div>
//       <div className="border-t border-ink-100 py-4">
//         <div className="container-page text-xs text-ink-500">
//           © {new Date().getFullYear()} EcomVA Verify. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;



import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-ink-200/70 mt-16">
      <div className="container-page py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl btn-gradient text-white font-bold text-sm shadow-glow">
              EV
            </span>
            <span className="font-bold tracking-tight">EcomVA Verify</span>
          </div>
          <p className="text-sm text-ink-500 max-w-sm">
            Hire based on verified e-commerce skills, not just resumes.
          </p>
          <div className="mt-5 flex gap-2">
            <span className="pill bg-brand-50 text-brand-700 ring-1 ring-brand-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>
        </div>
        <div>
          <div className="font-semibold text-sm mb-3 text-ink-900">Product</div>
          <ul className="space-y-2 text-sm text-ink-600">
            <li><Link to="/how-it-works" className="hover:text-ink-900 transition">How it works</Link></li>
            <li><Link to="/find-vas" className="hover:text-ink-900 transition">Find VAs</Link></li>
            <li><Link to="/register" className="hover:text-ink-900 transition">Get started</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-sm mb-3 text-ink-900">Company</div>
          <ul className="space-y-2 text-sm text-ink-600">
            <li><Link to="/about" className="hover:text-ink-900 transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-ink-900 transition">Contact</Link></li>
            <li><Link to="/terms" className="hover:text-ink-900 transition">Terms</Link></li>
            <li><Link to="/privacy" className="hover:text-ink-900 transition">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100 py-5">
        <div className="container-page flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-500">
          <span>© {new Date().getFullYear()} EcomVA Verify. All rights reserved.</span>
          <span>Built for Southeast Asian e-commerce VAs.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;