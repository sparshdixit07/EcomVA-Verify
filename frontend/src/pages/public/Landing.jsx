// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Button from '../../components/ui/Button.jsx';
// import Card, { CardBody } from '../../components/ui/Card.jsx';
// import { vaService } from '../../services/va.service.js';
// import Avatar from '../../components/ui/Avatar.jsx';
// import ScoreBadge from '../../components/common/ScoreBadge.jsx';

// export default function Landing() {
//   const [featured, setFeatured] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const data = await vaService.search({ limit: 6, sort: '-performance.overallScore', verified: true });
//         if (!cancelled) setFeatured(data?.items || data?.vas || []);
//       } catch {
//         if (!cancelled) setFeatured([]);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return (
//     <div>
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-ink-50" />
//         <div className="container-page py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
//               E-commerce-specific VA hiring
//             </span>
//             <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink-900">
//               Hire based on <span className="text-brand-600">verified e-commerce skills</span>, not just resumes.
//             </h1>
//             <p className="mt-5 text-lg text-ink-600 max-w-xl">
//               Discover Southeast Asian Virtual Assistants who have passed real Amazon and Shopify
//               skill assessments, completed practical work simulations, and proven themselves with
//               actual client tasks.
//             </p>
//             <div className="mt-8 flex flex-wrap gap-3">
//               <Button size="lg" to="/register">
//                 Find a VA
//               </Button>
//               <Button size="lg" variant="secondary" to="/register?role=va">
//                 Become a VA
//               </Button>
//             </div>
//             <div className="mt-8 flex flex-wrap gap-6 text-sm text-ink-500">
//               <div className="flex items-center gap-2">
//                 <span className="text-emerald-500">✓</span> Verified skills only
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-emerald-500">✓</span> Practical work simulations
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-emerald-500">✓</span> Requirement-based matching
//               </div>
//             </div>
//           </div>

//           <div className="relative">
//             <div className="card p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="text-sm font-semibold text-ink-700">Top verified VAs</div>
//                 <Link to="/find-vas" className="text-xs link">
//                   View all →
//                 </Link>
//               </div>
//               {loading ? (
//                 <div className="space-y-3">
//                   {[0, 1, 2].map((i) => (
//                     <div key={i} className="h-16 rounded-xl bg-ink-100 animate-pulse" />
//                   ))}
//                 </div>
//               ) : featured.length === 0 ? (
//                 <p className="text-sm text-ink-500">
//                   No verified VAs yet. Register and browse the directory to find fresh talent.
//                 </p>
//               ) : (
//                 <div className="space-y-3">
//                   {featured.slice(0, 4).map((va) => {
//                     const user = va.user || {};
//                     const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VA';
//                     return (
//                       <Link
//                         key={va._id}
//                         to={`/vas/${va._id}`}
//                         className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50"
//                       >
//                         <Avatar src={user.avatarUrl} name={name} />
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-semibold text-ink-900 truncate">{name}</div>
//                           <div className="text-xs text-ink-500 truncate">
//                             {va.headline || va.country || 'E-commerce VA'}
//                           </div>
//                         </div>
//                         <ScoreBadge score={va.performance?.overallScore} label="Perf" />
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="container-page py-16">
//         <div className="max-w-2xl">
//           <h2 className="text-3xl font-bold text-ink-900">Why EcomVA Verify is different</h2>
//           <p className="mt-3 text-ink-600">
//             Generic marketplaces rank VA by resume keywords. We rank them by proof.
//           </p>
//         </div>
//         <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[
//             {
//               title: 'E-commerce skill verification',
//               body: 'Every VA passes real assessments on Amazon listings, Shopify ops, customer support, inventory, and returns.'
//             },
//             {
//               title: 'Practical work simulation',
//               body: 'Client can create a real trial task. VA submits actual work. Client scores it. Only verified work unlocks discovery.'
//             },
//             {
//               title: 'Requirement-based matching',
//               body: 'Post your requirement. Our deterministic engine ranks VAs by platform, skills, experience, English, timezone and budget.'
//             },
//             {
//               title: 'Side-by-side comparison',
//               body: 'Compare 2–3 VAs across verification, assessment scores, rates, languages and performance.'
//             },
//             {
//               title: 'Post-hire performance',
//               body: 'Track task completion, on-time rate, accuracy, responsiveness and client ratings over time.'
//             },
//             {
//               title: 'Trusted reviews',
//               body: 'Only clients with a real engagement can review their VA. Duplicate or fake reviews are blocked.'
//             }
//           ].map((f) => (
//             <Card key={f.title}>
//               <CardBody>
//                 <h3 className="font-semibold text-ink-900">{f.title}</h3>
//                 <p className="mt-2 text-sm text-ink-600">{f.body}</p>
//               </CardBody>
//             </Card>
//           ))}
//         </div>
//       </section>

//       <section className="container-page py-16">
//         <div className="grid lg:grid-cols-2 gap-10 items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-ink-900">How it works</h2>
//             <ol className="mt-6 space-y-5">
//               {[
//                 { t: 'Post a requirement', d: 'Describe your store, platform, skills, budget, timezone.' },
//                 { t: 'Get ranked matches', d: 'Our engine returns a match score with factor breakdown.' },
//                 { t: 'Compare & shortlist', d: 'Compare 2–3 VAs side by side. Save the best candidates.' },
//                 { t: 'Run a trial task', d: 'Assign a real practical task. Review the submission. Score it.' },
//                 { t: 'Hire & track', d: 'Send a hiring request. Manage tasks, performance and reviews.' }
//               ].map((s, i) => (
//                 <li key={s.t} className="flex gap-4">
//                   <span className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
//                     {i + 1}
//                   </span>
//                   <div>
//                     <div className="font-semibold text-ink-900">{s.t}</div>
//                     <div className="text-sm text-ink-600">{s.d}</div>
//                   </div>
//                 </li>
//               ))}
//             </ol>
//           </div>
//           <Card>
//             <CardBody>
//               <div className="text-sm text-ink-500">Example match</div>
//               <div className="mt-2 text-3xl font-extrabold text-ink-900">Match Score: 93%</div>
//               <div className="mt-4 space-y-3">
//                 {[
//                   ['Platform fit', 100],
//                   ['Required skills', 95],
//                   ['Assessment score', 94],
//                   ['Practical score', 90],
//                   ['Experience', 88],
//                   ['Budget fit', 85],
//                   ['Timezone overlap', 92],
//                   ['English level', 90]
//                 ].map(([label, score]) => (
//                   <div key={label}>
//                     <div className="flex justify-between text-xs text-ink-600">
//                       <span>{label}</span>
//                       <span>{score}%</span>
//                     </div>
//                     <div className="mt-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
//                       <div className="h-full bg-brand-500" style={{ width: `${score}%` }} />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       </section>

//       <section className="container-page py-16">
//         <div className="card p-8 sm:p-12 text-center bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0">
//           <h2 className="text-3xl font-bold">Stop hiring on keywords. Start hiring on proof.</h2>
//           <p className="mt-3 opacity-90 max-w-2xl mx-auto">
//             Set up a free account in under a minute. Post your first requirement and see matched, verified VAs.
//           </p>
//           <div className="mt-6 flex flex-wrap justify-center gap-3">
//             <Button size="lg" variant="secondary" to="/register">
//               I'm hiring
//             </Button>
//             <Button
//               size="lg"
//               to="/register?role=va"
//               className="bg-white/10 text-white border border-white/30 hover:bg-white/20"
//             >
//               I'm a VA
//             </Button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Card, { CardBody } from '../../components/ui/Card.jsx';
import { vaService } from '../../services/va.service.js';
import Avatar from '../../components/ui/Avatar.jsx';
import ScoreBadge from '../../components/common/ScoreBadge.jsx';

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await vaService.search({
          limit: 6,
          sort: '-performance.overallScore',
          verified: true
        });
        if (!cancelled) setFeatured(data?.items || data?.vas || []);
      } catch {
        if (!cancelled) setFeatured([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-mesh-hero" />
        <div className="absolute inset-0 -z-10 bg-grid bg-grid opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />

        <div className="container-page py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">
          <div className="animate-slide-up">
            <span className="pill bg-white shadow-soft ring-1 ring-brand-100 text-brand-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600" />
              </span>
              E-commerce-specific VA hiring
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-ink-900 leading-[1.05] text-balance">
              Hire based on{' '}
              <span className="gradient-text">verified e-commerce skills</span>, not just resumes.
            </h1>

            <p className="mt-6 text-lg text-ink-600 max-w-xl text-balance">
              Discover Southeast Asian Virtual Assistants who have passed real Amazon and Shopify
              skill assessments, completed practical work simulations, and proven themselves with
              actual client tasks.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" to="/register">
                Find a VA
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10h12m-4-5 5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button size="lg" variant="secondary" to="/register?role=va">
                Become a VA
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: 'Verified skills', v: '100%' },
                { k: 'Practical tests', v: 'Real' },
                { k: 'Matching', v: 'Smart' }
              ].map((s) => (
                <div key={s.k}>
                  <div className="text-2xl font-bold text-ink-900 tracking-tight">{s.v}</div>
                  <div className="text-xs text-ink-500 mt-1">{s.k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating VA card */}
          <div className="relative animate-fade-in">
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-200/50 via-accent-200/40 to-transparent rounded-4xl blur-2xl" />
            <div className="relative card p-6 shadow-elevated">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-ink-500">
                    Top verified VAs
                  </div>
                  <div className="text-sm text-ink-500 mt-0.5">
                    Ranked by proven performance
                  </div>
                </div>
                <Link to="/find-vas" className="text-xs link">
                  View all →
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-16 rounded-xl skeleton" />
                  ))}
                </div>
              ) : featured.length === 0 ? (
                <p className="text-sm text-ink-500 py-4">
                  No verified VAs yet. Register and browse to find fresh talent.
                </p>
              ) : (
                <div className="space-y-2">
                  {featured.slice(0, 4).map((va, idx) => {
                    const user = va.user || {};
                    const name =
                      `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VA';
                    return (
                      <Link
                        key={va._id}
                        to={`/vas/${va._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition group"
                      >
                        <div className="relative">
                          <Avatar src={user.avatarUrl} name={name} />
                          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-[9px] text-white font-bold">
                            ✓
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-ink-900 truncate group-hover:text-brand-700 transition">
                            {name}
                          </div>
                          <div className="text-xs text-ink-500 truncate">
                            {va.headline || va.country || 'E-commerce VA'}
                          </div>
                        </div>
                        <ScoreBadge score={va.performance?.overallScore} label="#{idx+1}" />
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 pt-5 border-t border-ink-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="h-7 w-7 rounded-full ring-2 ring-white bg-gradient-to-br from-brand-400 to-accent-400"
                    />
                  ))}
                </div>
                <div className="text-xs text-ink-500">
                  <span className="font-semibold text-ink-900">+200</span> VAs available
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container-page py-20">
        <div className="max-w-2xl mb-12">
          <span className="pill bg-brand-50 text-brand-700 ring-1 ring-brand-200/60">
            Why EcomVA Verify
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
            Generic marketplaces rank by keywords.
            <br />
            <span className="gradient-text">We rank by proof.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: '🧠',
              title: 'E-commerce skill verification',
              body: 'Every VA passes real assessments on Amazon listings, Shopify ops, customer support, inventory, and returns.'
            },
            {
              icon: '🧪',
              title: 'Practical work simulation',
              body: 'Client creates a real trial task. VA submits actual work. Client scores it. Only verified work unlocks discovery.'
            },
            {
              icon: '🎯',
              title: 'Requirement-based matching',
              body: 'Post your requirement. Our deterministic engine ranks VAs by platform, skills, experience, English, timezone and budget.'
            },
            {
              icon: '⚖️',
              title: 'Side-by-side comparison',
              body: 'Compare 2–3 VAs across verification, assessment scores, rates, languages and performance.'
            },
            {
              icon: '📈',
              title: 'Post-hire performance',
              body: 'Track task completion, on-time rate, accuracy, responsiveness and client ratings over time.'
            },
            {
              icon: '💬',
              title: 'Trusted reviews',
              body: 'Only clients with a real engagement can review their VA. Duplicate or fake reviews are blocked.'
            }
          ].map((f, i) => (
            <Card key={f.title} hover className={`animate-slide-up`} style={{ animationDelay: `${i * 60}ms` }}>
              <CardBody>
                <div className="h-11 w-11 rounded-xl bg-brand-gradient-soft border border-brand-100 flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-ink-900 tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{f.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-page py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="pill bg-brand-50 text-brand-700 ring-1 ring-brand-200/60">
              How it works
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
              From requirement to hire in 5 steps
            </h2>
            <ol className="mt-8 space-y-5">
              {[
                { t: 'Post a requirement', d: 'Describe your store, platform, skills, budget, timezone.' },
                { t: 'Get ranked matches', d: 'Our engine returns a match score with factor breakdown.' },
                { t: 'Compare & shortlist', d: 'Compare 2–3 VAs side by side. Save the best candidates.' },
                { t: 'Run a trial task', d: 'Assign a real practical task. Review the submission. Score it.' },
                { t: 'Hire & track', d: 'Send a hiring request. Manage tasks, performance and reviews.' }
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4 group">
                  <span className="flex-shrink-0 h-9 w-9 rounded-xl btn-gradient text-white text-sm font-bold flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <div className="font-semibold text-ink-900">{s.t}</div>
                    <div className="text-sm text-ink-600 mt-0.5">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent-200/40 via-brand-200/40 to-transparent rounded-4xl blur-2xl" />
            <Card className="relative shadow-elevated">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-bold text-ink-500">
                      Example match
                    </div>
                    <div className="mt-1 text-3xl font-extrabold text-ink-900 tracking-tight">
                      Match Score: <span className="gradient-text">93%</span>
                    </div>
                  </div>
                  <span className="pill bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                </div>
                <div className="mt-6 space-y-3.5">
                  {[
                    ['Platform fit', 100],
                    ['Required skills', 95],
                    ['Assessment score', 94],
                    ['Practical score', 90],
                    ['Experience', 88],
                    ['Budget fit', 85],
                    ['Timezone overlap', 92],
                    ['English level', 90]
                  ].map(([label, score]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs font-medium text-ink-600 mb-1.5">
                        <span>{label}</span>
                        <span className="font-bold text-ink-900">{score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="relative rounded-4xl overflow-hidden">
          <div className="absolute inset-0 btn-gradient" />
          <div className="absolute inset-0 bg-grid bg-grid opacity-20 mix-blend-overlay" />
          <div className="relative p-10 sm:p-14 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Stop hiring on keywords. Start hiring on proof.
            </h2>
            <p className="mt-4 opacity-90 max-w-2xl mx-auto text-balance">
              Set up a free account in under a minute. Post your first requirement and see matched,
              verified VAs.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                to="/register"
                variant="secondary"
                className="!bg-white !text-ink-900 border-0 hover:!bg-ink-50"
              >
                I'm hiring
              </Button>
              <Button
                size="lg"
                to="/register?role=va"
                className="!bg-white/10 border border-white/30 text-white hover:!bg-white/20 shadow-none"
              >
                I'm a VA
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}