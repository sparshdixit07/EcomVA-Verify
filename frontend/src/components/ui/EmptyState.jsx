// import Button from './Button.jsx';

// export function EmptyState({ icon, title, description, action, actionTo, actionLabel }) {
//   return (
//     <div className="flex flex-col items-center justify-center text-center py-12 px-6">
//       <div className="h-14 w-14 rounded-full bg-ink-100 flex items-center justify-center text-2xl">
//         {icon || '📭'}
//       </div>
//       <h3 className="mt-4 font-semibold text-ink-900">{title || 'Nothing here yet'}</h3>
//       {description && (
//         <p className="mt-1 text-sm text-ink-500 max-w-md">{description}</p>
//       )}
//       {(action || actionTo) && (
//         <div className="mt-5">
//           {actionTo ? (
//             <Button to={actionTo}>{actionLabel || 'Get started'}</Button>
//           ) : (
//             action
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default EmptyState;
import Button from './Button.jsx';

export function EmptyState({ icon, title, description, action, actionTo, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 animate-fade-in">
      <div className="h-16 w-16 rounded-2xl bg-brand-gradient-soft border border-brand-100 flex items-center justify-center text-3xl shadow-soft">
        {icon || '📭'}
      </div>
      <h3 className="mt-5 font-semibold text-ink-900 text-lg tracking-tight">
        {title || 'Nothing here yet'}
      </h3>
      {description && (
        <p className="mt-1.5 text-sm text-ink-500 max-w-md text-balance">
          {description}
        </p>
      )}
      {(action || actionTo) && (
        <div className="mt-6">
          {actionTo ? (
            <Button to={actionTo}>{actionLabel || 'Get started'}</Button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;