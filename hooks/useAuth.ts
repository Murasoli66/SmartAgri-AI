// FIX: Removed unused imports of `useContext` and `AuthContext` to fix an import error.
// The `AuthContext` is not exported from `../contexts/AuthContext`, and the imports
// were unnecessary as this file only re-exports the `useAuth` hook.

// The AuthContext is created in AuthContext.tsx, not here.
// We are just re-exporting the useAuth hook for convenience.
export { useAuth } from '../contexts/AuthContext';
