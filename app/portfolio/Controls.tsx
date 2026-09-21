"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./Portfolio.module.css";
import { CONTACT_EMAIL } from "./projects";

function themeSnapshot() {
  return document.documentElement.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}
function subscribeTheme(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const system = matchMedia("(prefers-color-scheme: dark)");
  system.addEventListener("change", notify);
  return () => { observer.disconnect(); system.removeEventListener("change", notify); };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, themeSnapshot, () => null);
  return <button className={styles.themeToggle} type="button" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={() => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("jx-theme", next); } catch { /* Session-only preference. */ }
  }}><span aria-hidden="true">◐</span></button>;
}

export function CopyEmail() {
  const [message, setMessage] = useState("Copy email");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <button type="button" className={styles.copyEmail} onClick={async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setMessage("Email copied");
    } catch { setMessage("Select the address to copy"); }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage("Copy email"), 3000);
  }}><span aria-live="polite">{message}</span></button>;
}
