"use client";

import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Duración de la animación de salida
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isExiting ? styles.exit : ""}`}
      role="alert"
    >
      <div className={styles.content}>
        {type === "success" && <span className={styles.icon}>✅</span>}
        {type === "error" && <span className={styles.icon}>❌</span>}
        {type === "warning" && <span className={styles.icon}>⚠️</span>}
        {type === "info" && <span className={styles.icon}>ℹ️</span>}
        <p className={styles.message}>{message}</p>
      </div>
      <button onClick={() => onClose()} className={styles.closeButton}>
        ✕
      </button>
    </div>
  );
}
