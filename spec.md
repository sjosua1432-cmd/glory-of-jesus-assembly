# Glory of Jesus Assembly

## Current State
Admin page exists at /admin. After logging in with Internet Identity, users see "Access Denied" if they haven't been initialized as admin. The backend has `_initializeAccessControlWithSecret` to assign the first admin, but the frontend has no UI to trigger it.

## Requested Changes (Diff)

### Add
- Admin setup flow on AdminPage: when logged in but not admin, show a form to enter the admin token and call `_initializeAccessControlWithSecret`
- `useInitializeAdmin` mutation in useQueries.ts

### Modify
- AdminPage.tsx: replace bare "Access Denied" with a setup form that lets the first admin claim access using a token

### Remove
- Nothing

## Implementation Plan
1. Add `useInitializeAdmin` mutation to useQueries.ts calling `actor._initializeAccessControlWithSecret(token)`
2. Update AdminPage "Access Denied" state to show a token input form with instructions
3. On success, invalidate the isAdmin query so UI refreshes to admin view
