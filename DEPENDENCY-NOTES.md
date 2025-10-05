# Dependency Notes

## React 19 and Peer Dependency Warnings

This project uses **React 19.1.1**, which is the latest version. However, some dependencies still require React 18:

- `resend` (email service) → depends on `@react-email/render@0.0.16` → requires React 18

### Why This Is Safe

The `resend` package is **only used on the server-side** (in `server.js`), not in the React frontend. The peer dependency warning is about React/ReactDOM versions, but since Resend doesn't actually render React components in our server context, this incompatibility is harmless.

### How We Handle It

We've implemented three solutions to handle this cleanly:

#### 1. `.npmrc` Configuration
```ini
legacy-peer-deps=true
```

This tells npm to use the legacy peer dependency resolution algorithm, which is more lenient about version mismatches.

#### 2. `package.json` Overrides
```json
"overrides": {
  "react": "$react",
  "react-dom": "$react-dom"
}
```

This forces all dependencies to use the same React version as the root project.

#### 3. Install Flag in Scripts
```bash
npm install --legacy-peer-deps
```

Used in `deploy.sh` and documentation as a fallback.

### Expected Warnings

You may see warnings like this during installation:

```
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @react-email/render@0.0.16
npm warn Found: react@19.2.0
npm warn Could not resolve dependency:
npm warn peer react@"^18.2.0" from @react-email/render@0.0.16
```

**These are warnings, not errors.** The installation will complete successfully, and the application will work correctly.

### When This Will Be Resolved

The `resend` package maintainers will eventually update their dependencies to support React 19. When that happens, you can:

1. Update `resend` to the latest version
2. Remove the `overrides` section from `package.json` (optional)
3. Remove `legacy-peer-deps=true` from `.npmrc` (optional)

### Alternative Solutions

If you want to avoid these warnings entirely:

#### Option 1: Downgrade to React 18
```json
"react": "^18.3.1",
"react-dom": "^18.3.1"
```

**Not recommended** - React 19 has significant performance improvements and new features.

#### Option 2: Use a Different Email Service
Replace `resend` with an alternative that supports React 19 or doesn't have React as a peer dependency.

#### Option 3: Keep Current Setup (Recommended)
The current setup works perfectly and will automatically resolve when dependencies are updated.

## Other Dependencies

All other dependencies are compatible with React 19:

- ✅ `framer-motion` - Supports React 19
- ✅ `react-router-dom` - Supports React 19
- ✅ `@supabase/supabase-js` - No React dependency
- ✅ `lucide-react` - Supports React 19
- ✅ All other packages - Compatible

## Questions?

If you have questions about dependencies or see unexpected errors:

1. Check `pm2 logs corcon2025` for runtime errors
2. Verify all required environment variables are set in `.env`
3. Ensure Node.js version is 18 or higher: `node --version`
4. Try clearing and reinstalling: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`
