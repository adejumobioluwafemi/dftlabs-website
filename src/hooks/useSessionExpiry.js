import { useCallback } from "react";
import { SessionExpiredError } from "../api/adminApi";

/**
 * Returns a handleError function.
 * Call it in any catch block inside admin pages.
 * If the error is a SessionExpiredError it fires the global event
 * that AdminLayout listens to, showing the session expired modal.
 * Otherwise it re-throws so the page can handle it normally.
 *
 * Usage:
 *   const handleError = useSessionExpiry();
 *   try { ... } catch (err) { handleError(err, "Failed to load jobs"); }
 */
export function useSessionExpiry() {
    return useCallback((err, fallbackMessage) => {
        if (err instanceof SessionExpiredError) {
            window.dispatchEvent(new CustomEvent("adminSessionExpired", { detail: { type: "SessionExpiredError" } }));
        } else {
            // Re-throw so the component can show its own error UI
            throw err instanceof Error ? err : new Error(fallbackMessage || "An error occurred");
        }
    }, []);
}