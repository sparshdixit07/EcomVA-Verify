import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Toast } from '../components/ui/Toast.jsx';

const ToastContext = createContext(null);

let externalPush = null;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    const entry = {
      id,
      type: toast.type || 'info',
      title: toast.title || '',
      message: toast.message || '',
      duration: toast.duration ?? 4000
    };
    setToasts((prev) => [...prev, entry]);
    if (entry.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, entry.duration);
    }
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    push,
    success: (message, title = 'Success') => push({ type: 'success', title, message }),
    error: (message, title = 'Error') => push({ type: 'error', title, message }),
    info: (message, title = 'Info') => push({ type: 'info', title, message }),
    warning: (message, title = 'Warning') => push({ type: 'warning', title, message })
  };

  useEffect(() => {
    externalPush = value;
    return () => {
      externalPush = null;
    };
  }, [value]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onClose={() => remove(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function toast() {
  if (!externalPush) return;
  return externalPush;
}