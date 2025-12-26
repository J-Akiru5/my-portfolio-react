import React, { useState, createContext, useContext, useCallback } from 'react'

/**
 * Toast Context and Provider
 * 
 * Provides global toast notification system with cyberpunk styling.
 * Usage: const { showToast } = useToast(); showToast('Message', 'success')
 */

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])

    // Auto dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 8px;
          background: rgba(10, 10, 20, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: toast-slide-in 0.3s ease-out;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .toast.exiting {
          animation: toast-slide-out 0.2s ease-in forwards;
        }

        @keyframes toast-slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes toast-slide-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .toast-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
        }

        .toast-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 4px;
          font-size: 1rem;
          line-height: 1;
          transition: color 0.2s;
        }

        .toast-close:hover {
          color: rgba(255, 255, 255, 0.9);
        }

        /* Type-specific styling */
        .toast.success {
          border-color: rgba(57, 255, 20, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(57, 255, 20, 0.15),
            inset 0 1px 0 rgba(57, 255, 20, 0.1);
        }

        .toast.success .toast-icon {
          color: #39ff14;
        }

        .toast.error {
          border-color: rgba(255, 68, 68, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(255, 68, 68, 0.15),
            inset 0 1px 0 rgba(255, 68, 68, 0.1);
        }

        .toast.error .toast-icon {
          color: #ff4444;
        }

        .toast.info {
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(0, 212, 255, 0.15),
            inset 0 1px 0 rgba(0, 212, 255, 0.1);
        }

        .toast.info .toast-icon {
          color: #00d4ff;
        }

        .toast.warning {
          border-color: rgba(255, 170, 0, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 20px rgba(255, 170, 0, 0.15),
            inset 0 1px 0 rgba(255, 170, 0, 0.1);
        }

        .toast.warning .toast-icon {
          color: #ffaa00;
        }

        /* Scanline effect */
        .toast::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
          border-radius: 8px;
        }
      `}</style>

      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onDismiss={() => onDismiss(toast.id)} 
        />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }) {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  }

  return (
    <div className={`toast ${toast.type}`}>
      <span className="toast-icon">{icons[toast.type] || icons.info}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onDismiss}>×</button>
    </div>
  )
}

export default Toast
