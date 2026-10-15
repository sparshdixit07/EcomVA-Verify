// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: ['./index.html', './src/**/*.{js,jsx}'],
// //   theme: {
// //     extend: {
// //       colors: {
// //         brand: {
// //           50: '#eef4ff',
// //           100: '#dae6ff',
// //           200: '#bcd2ff',
// //           300: '#8eb4ff',
// //           400: '#598cff',
// //           500: '#3563ff',
// //           600: '#1e40f5',
// //           700: '#1830d8',
// //           800: '#1a2caf',
// //           900: '#1b2c8a'
// //         },
// //         ink: {
// //           50: '#f6f7f9',
// //           100: '#eceef2',
// //           200: '#d5dae1',
// //           300: '#b1bac6',
// //           400: '#8794a5',
// //           500: '#697689',
// //           600: '#545f70',
// //           700: '#454e5b',
// //           800: '#3b424d',
// //           900: '#0f131a'
// //         }
// //       },
// //       fontFamily: {
// //         sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
// //       },
// //       boxShadow: {
// //         card: '0 1px 2px rgba(15,19,26,0.04), 0 8px 24px rgba(15,19,26,0.06)'
// //       }
// //     }
// //   },
// //   plugins: []
// // };
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,jsx}'],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           50: '#eef2ff',
//           100: '#e0e7ff',
//           200: '#c7d2fe',
//           300: '#a5b4fc',
//           400: '#818cf8',
//           500: '#6366f1',
//           600: '#4f46e5',
//           700: '#4338ca',
//           800: '#3730a3',
//           900: '#312e81',
//           950: '#1e1b4b'
//         },
//         accent: {
//           50: '#f5f3ff',
//           100: '#ede9fe',
//           200: '#ddd6fe',
//           300: '#c4b5fd',
//           400: '#a78bfa',
//           500: '#8b5cf6',
//           600: '#7c3aed',
//           700: '#6d28d9'
//         },
//         ink: {
//           50: '#f8fafc',
//           100: '#f1f5f9',
//           200: '#e2e8f0',
//           300: '#cbd5e1',
//           400: '#94a3b8',
//           500: '#64748b',
//           600: '#475569',
//           700: '#334155',
//           800: '#1e293b',
//           900: '#0f172a',
//           950: '#020617'
//         }
//       },
//       fontFamily: {
//         sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
//         display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
//       },
//       boxShadow: {
//         soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
//         card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -6px rgba(15, 23, 42, 0.08)',
//         elevated:
//           '0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 20px 40px -12px rgba(15, 23, 42, 0.14)',
//         glow: '0 0 0 1px rgba(99, 102, 241, 0.08), 0 12px 32px -8px rgba(99, 102, 241, 0.35)',
//         inset: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)'
//       },
//       backgroundImage: {
//         'brand-gradient': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
//         'brand-gradient-soft':
//           'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.10) 100%)',
//         'mesh-hero':
//           'radial-gradient(at 20% 10%, rgba(99,102,241,0.18) 0px, transparent 55%), radial-gradient(at 85% 20%, rgba(139,92,246,0.16) 0px, transparent 55%), radial-gradient(at 50% 90%, rgba(56,189,248,0.10) 0px, transparent 60%)',
//         'grid-slate':
//           'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)'
//       },
//       backgroundSize: {
//         grid: '32px 32px'
//       },
//       borderRadius: {
//         '4xl': '2rem'
//       },
//       keyframes: {
//         fadeIn: {
//           from: { opacity: 0 },
//           to: { opacity: 1 }
//         },
//         slideUp: {
//           from: { opacity: 0, transform: 'translateY(8px)' },
//           to: { opacity: 1, transform: 'translateY(0)' }
//         },
//         shimmer: {
//           '0%': { backgroundPosition: '-200% 0' },
//           '100%': { backgroundPosition: '200% 0' }
//         },
//         float: {
//           '0%, 100%': { transform: 'translateY(0)' },
//           '50%': { transform: 'translateY(-6px)' }
//         },
//         pulseRing: {
//           '0%': { transform: 'scale(0.95)', opacity: '0.7' },
//           '70%': { transform: 'scale(1.1)', opacity: '0' },
//           '100%': { transform: 'scale(1.1)', opacity: '0' }
//         }
//       },
//       animation: {
//         'fade-in': 'fadeIn 0.4s ease-out both',
//         'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
//         shimmer: 'shimmer 2.4s linear infinite',
//         float: 'float 4s ease-in-out infinite',
//         'pulse-ring': 'pulseRing 2s cubic-bezier(0.24, 0, 0.38, 1) infinite'
//       },
//       transitionTimingFunction: {
//         smooth: 'cubic-bezier(0.16, 1, 0.3, 1)'
//       }
//     }
//   },
//   plugins: []
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9'
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -6px rgba(15, 23, 42, 0.08)',
        elevated:
          '0 4px 6px -1px rgba(15, 23, 42, 0.04), 0 20px 40px -12px rgba(15, 23, 42, 0.14)',
        glow: '0 0 0 1px rgba(99, 102, 241, 0.08), 0 12px 32px -8px rgba(99, 102, 241, 0.35)',
        inset: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)'
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'brand-gradient-soft':
          'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.10) 100%)',
        'mesh-hero':
          'radial-gradient(at 20% 10%, rgba(99,102,241,0.18) 0px, transparent 55%), radial-gradient(at 85% 20%, rgba(139,92,246,0.16) 0px, transparent 55%), radial-gradient(at 50% 90%, rgba(56,189,248,0.10) 0px, transparent 60%)',
        'grid-slate':
          'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '32px 32px'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.1)', opacity: '0' },
          '100%': { transform: 'scale(1.1)', opacity: '0' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2.4s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.24, 0, 0.38, 1) infinite'
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
};