// export function Spinner({ size = 'md', className = '' }) {
//   const sizes = {
//     sm: 'h-4 w-4 border-2',
//     md: 'h-6 w-6 border-2',
//     lg: 'h-10 w-10 border-[3px]'
//   };
//   return (
//     <span
//       className={`inline-block rounded-full border-brand-500 border-t-transparent animate-spin ${sizes[size]} ${className}`}
//       aria-label="Loading"
//     />
//   );
// }

// export function FullPageSpinner() {
//   return (
//     <div className="min-h-[50vh] flex items-center justify-center">
//       <Spinner size="lg" />
//     </div>
//   );
// }

// export default Spinner;

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-[2.5px]',
    lg: 'h-10 w-10 border-[3px]'
  };
  return (
    <span
      className={`inline-block rounded-full border-brand-500 border-t-transparent animate-spin ${sizes[size]} ${className}`}
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-brand-500/20 animate-pulse-ring" />
        <Spinner size="lg" />
      </div>
    </div>
  );
}

export default Spinner;