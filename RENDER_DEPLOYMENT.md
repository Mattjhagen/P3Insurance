# Deploying to Render

## Deployment Type: **Web Service** (Not Static Site)

Your Next.js application requires a Web Service because it has:
- API routes (`/app/api/*`)
- Server-side functionality
- Database (SQLite)

## Quick Setup Steps

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository**: `Mattjhagen/P3Insurance`
4. **Configure the service**:
   - **Name**: `p3insurance` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose Free or Paid plan

5. **Environment Variables** (optional, but recommended):
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render sets this automatically, but you can specify it)

6. **Click "Create Web Service"**

## Important Notes

### Database Considerations

⚠️ **SQLite Warning**: Render's filesystem is **ephemeral**, meaning:
- The database file (`insurance.db`) will be **deleted** when the service restarts
- Data will be lost on each deployment or restart

**For Production, consider:**
- Using Render's PostgreSQL database (recommended)
- Or another managed database service (Supabase, PlanetScale, etc.)

### Using Render PostgreSQL (Recommended)

1. In Render Dashboard, create a **PostgreSQL** database
2. Get the connection string
3. Update your code to use PostgreSQL instead of SQLite
4. Add the `DATABASE_URL` environment variable in your Web Service settings

### Alternative: Keep SQLite for Demo

If you want to keep SQLite for now (for demo purposes):
- The app will work, but data resets on each restart
- This is fine for testing and demos

## Manual Configuration (if not using render.yaml)

If you prefer to configure manually in the Render dashboard:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: (leave empty, or `./` if needed)

## Health Check

The app includes a health check at the root path (`/`), which Render will use to verify the service is running.

## After Deployment

Once deployed, your app will be available at:
`https://p3insurance.onrender.com` (or your custom domain)

Make sure to test:
- Insurance comparison page
- Referral code generation
- Dashboard functionality
- API endpoints
