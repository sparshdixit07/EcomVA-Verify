// import { initialsOf } from '../../utils/format.js';

// export function Avatar({ src, name = '', size = 'md', className = '' }) {
//   const sizes = {
//     sm: 'h-8 w-8 text-xs',
//     md: 'h-10 w-10 text-sm',
//     lg: 'h-14 w-14 text-base',
//     xl: 'h-20 w-20 text-xl'
//   };
//   if (src) {
//     return (
//       <img
//         src={src}
//         alt={name}
//         className={`rounded-full object-cover bg-ink-100 ${sizes[size]} ${className}`}
//       />
//     );
//   }
//   return (
//     <div
//       className={`rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center ${sizes[size]} ${className}`}
//     >
//       {initialsOf(name)}
//     </div>
//   );
// }

// export default Avatar;

import { initialsOf } from '../../utils/format.js';

const sizeMap = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl'
};

export function Avatar({ src, name = '', size = 'md', className = '' }) {
  const sizeCls = sizeMap[size] || sizeMap.md;
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover bg-ink-100 ring-2 ring-white shadow-soft ${sizeCls} ${className}`}
      />
    );
  }
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-semibold flex items-center justify-center ring-2 ring-white shadow-soft ${sizeCls} ${className}`}
    >
      {initialsOf(name)}
    </div>
  );
}

export default Avatar;