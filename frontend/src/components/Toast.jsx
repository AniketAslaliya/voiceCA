import { useEffect, useState } from "react";

const toastQueue = [];
let toastListeners = [];

function notifyListeners(toast) {
  toastListeners.forEach((listener) => listener(toast));
}

export function showToast(message, type = "success", duration = 3000) {
  const id = Math.random().toString(36).slice(2);
  const toast = { id, message, type };

  toastQueue.push(toast);
  notifyListeners(toast);

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

export function removeToast(id) {
  const index = toastQueue.findIndex((t) => t.id === id);
  if (index > -1) {
    toastQueue.splice(index, 1);
    notifyListeners(null);
  }
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastUpdate = () => {
      setToasts([...toastQueue]);
    };

    toastListeners.push(handleToastUpdate);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleToastUpdate);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "grid",
        gap: 12,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            background:
              toast.type === "success"
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : toast.type === "error"
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            fontWeight: 500,
            fontSize: 14,
            boxShadow: "0 10px 26px rgba(0, 0, 0, 0.3)",
            pointerEvents: "auto",
            animation: "slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>
            {toast.type === "success"
              ? "✓"
              : toast.type === "error"
                ? "✕"
                : "ℹ"}
          </span>
          {toast.message}
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(16px) translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
