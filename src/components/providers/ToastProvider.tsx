'use client';
import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Toast } from 'flowbite-react';

const TOAST_DURATION_MS = 6000;

export const ToastContext = createContext<{
  scheduleToast: (message: string) => void;
}>({
  scheduleToast: () => {},
});

/** Bottom-right toast stack; each toast auto-dismisses after a few seconds. */
export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const scheduleToast = useCallback(
    (message: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, msg: message }]);
      timers.current.push(setTimeout(() => dismiss(id), TOAST_DURATION_MS));
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const contextValue = useMemo(() => ({ scheduleToast }), [scheduleToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-0 right-0 z-[10001] flex max-h-64 rotate-180 flex-col gap-4 overflow-hidden p-8">
        {toasts.map(({ id, msg }) => (
          <Toast key={id} className="rotate-180">
            <div className="text-sm font-normal">{msg}</div>
            <Toast.Toggle onDismiss={() => dismiss(id)} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
