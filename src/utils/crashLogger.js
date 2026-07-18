/**
 * 🔍 Crash Logger Utility
 * Sends crash/error reports to the crash_logs table in Supabase.
 * Used by ErrorBoundary and global error handlers.
 */

import { supabase } from '../config/supabase';

/**
 * Log a crash to Supabase crash_logs table.
 * Silently fails — we never want the logger to crash the app.
 * 
 * @param {Object} params
 * @param {string} params.errorMessage - The error message
 * @param {string} [params.errorStack] - The error stack trace
 * @param {string} [params.componentStack] - React component stack (from ErrorBoundary)
 * @param {string} [params.source] - Where the error came from: 'frontend', 'edge-function', 'api'
 * @param {string} [params.url] - The page URL where the error occurred
 * @param {Object} [params.extraContext] - Any additional context data
 */
export async function logCrash({
    errorMessage,
    errorStack = '',
    componentStack = '',
    source = 'frontend',
    url = '',
    extraContext = {}
}) {
    try {
        // Don't log in development to avoid noise, EXCEPT for manual tests
        if (import.meta.env.DEV && !extraContext?.test) {
            console.warn('[CrashLogger] Skipping crash log in dev mode:', errorMessage);
            return;
        }

        await supabase.from('crash_logs').insert({
            error_message: errorMessage?.substring(0, 2000),  // Limit size
            error_stack: errorStack?.substring(0, 5000),
            component_stack: componentStack?.substring(0, 5000),
            source,
            url: url || window.location.href,
            user_agent: navigator.userAgent,
            extra_context: extraContext
        });
    } catch (e) {
        // Silently fail — the logger should NEVER crash the app
        console.warn('[CrashLogger] Failed to log crash:', e);
    }
}

/**
 * Setup global error listeners to catch:
 * 1. Unhandled JS errors (syntax errors, runtime errors)
 * 2. Unhandled promise rejections (failed API calls, async errors)
 * 
 * Call this ONCE during app initialization (in main.jsx)
 */
export function setupGlobalErrorHandlers() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
        logCrash({
            errorMessage: event.message || 'Unknown error',
            errorStack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
            source: 'frontend',
            extraContext: {
                type: 'unhandled_error',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            }
        });
    });

    // Catch unhandled promise rejections (failed fetch, async errors)
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason;
        logCrash({
            errorMessage: error?.message || error?.toString() || 'Unhandled Promise Rejection',
            errorStack: error?.stack || '',
            source: 'frontend',
            extraContext: {
                type: 'unhandled_promise_rejection'
            }
        });
    });
}
