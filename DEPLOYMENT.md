# Career Prediction AI - Deployment Guide

This guide will help you deploy this project to your own infrastructure.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Google AI API Key** - Get it from [Google AI Studio](https://aistudio.google.com/apikey)
3. **Supabase Account** - Create one at [supabase.com](https://supabase.com)
4. **Supabase CLI** - Install from [supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)

---

## Step 1: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (you'll need it later)

---

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: `career-prediction-ai` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest to your users
4. Click "Create new project" and wait for it to be ready

---

## Step 3: Get Supabase Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (under "Project API keys")
   - **Project Reference ID** (the `xxxxx` part of your URL)

---

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your Supabase values:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
   VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
   ```

---

## Step 5: Update Supabase Config

1. Open `supabase/config.toml`
2. Replace `YOUR_PROJECT_ID` with your actual project reference ID

---

## Step 6: Deploy Edge Function

1. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

4. Add the Google AI API key as a secret:
   ```bash
   supabase secrets set GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

5. Deploy the edge function:
   ```bash
   supabase functions deploy analyze-resume
   ```

---

## Step 7: Deploy Frontend

### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. Deploy!

### Option B: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Add environment variables in Site Settings → Environment Variables
5. Deploy!

### Option C: Manual Build

1. Build the project:
   ```bash
   npm install
   npm run build
   ```

2. The `dist` folder contains your static site - upload it to any static hosting service

---

## Troubleshooting

### "GOOGLE_AI_API_KEY is not configured"
- Make sure you've set the secret: `supabase secrets set GOOGLE_AI_API_KEY=your_key`
- Redeploy the function: `supabase functions deploy analyze-resume`

### "Invalid API key"
- Verify your Google AI API key is correct
- Make sure the key has the Generative Language API enabled

### CORS Errors
- The edge function already has CORS headers configured
- Make sure your frontend is calling the correct Supabase URL

### "Failed to invoke function"
- Check that the edge function is deployed: `supabase functions list`
- Check function logs: `supabase functions logs analyze-resume`

---

## Project Structure

```
├── src/                    # Frontend React application
├── supabase/
│   ├── config.toml         # Supabase configuration
│   └── functions/
│       └── analyze-resume/ # Edge function for AI analysis
├── .env.example            # Environment variables template
└── DEPLOYMENT.md           # This file
```

---

## Support

If you encounter issues:
1. Check the edge function logs: `supabase functions logs analyze-resume`
2. Verify all environment variables are set correctly
3. Ensure your Google AI API key has sufficient quota

---

## License

This project is open source and available under the MIT License.
