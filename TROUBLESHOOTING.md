# Troubleshooting Render Deployment

## If the page doesn't load

### 1. Check Render Logs
In your Render dashboard:
- Go to your service
- Click on "Logs" tab
- Look for errors during build or runtime

Common issues to check:
- Build errors (TypeScript, missing dependencies)
- Database initialization errors
- Port binding errors
- Memory issues

### 2. Check Build Status
- Make sure the build completed successfully
- Look for any warnings or errors in the build logs

### 3. Common Fixes

#### If you see "Cannot find module" errors:
```bash
# Make sure all dependencies are in package.json
npm install
```

#### If you see database errors:
- The database file is created automatically
- Make sure the app has write permissions
- On Render, the filesystem is ephemeral (data resets on restart)

#### If you see port errors:
- Render automatically sets the PORT environment variable
- The server should listen on `process.env.PORT`

### 4. Test Locally First
Before deploying, test locally:
```bash
npm run build
npm start
```
Then visit `http://localhost:3000`

### 5. Alternative: Use Standard Next.js Start
If the custom server doesn't work, try using Next.js's built-in server:

Update `package.json`:
```json
"start": "next start -p ${PORT:-3000}"
```

And remove or rename `server.js` temporarily.

### 6. Check Environment Variables
In Render dashboard, make sure:
- `NODE_ENV` is set to `production` (optional but recommended)
- `PORT` is automatically set by Render (don't override)

### 7. Database Path Issues
If you see database path errors, the database file location might need adjustment. The current setup uses:
```typescript
path.join(process.cwd(), 'insurance.db')
```

This should work on Render, but if it doesn't, you might need to use an absolute path or a different location.

### 8. Check Network/Timeout
- Render free tier has cold starts (first request can take 30-60 seconds)
- Wait a bit and try again
- Check if the service is actually "Live" (green status)

### 9. View Source/Console
- Open browser developer tools
- Check the Network tab for failed requests
- Check the Console for JavaScript errors
- Check if the HTML is loading but JavaScript isn't

### 10. Health Check
The app should respond at the root path `/`. If it doesn't:
- Check if the server is actually running
- Look for errors in the logs
- Verify the build was successful

## Quick Debug Steps

1. **Check logs in Render dashboard** - Most issues show up here
2. **Verify build succeeded** - Look for "Build successful" message
3. **Check service status** - Should be "Live" (green)
4. **Wait for cold start** - First request can be slow on free tier
5. **Try incognito/private window** - Rule out browser cache issues

## Still Not Working?

Share the error messages from:
1. Render build logs
2. Render runtime logs
3. Browser console errors
4. Network tab (failed requests)
