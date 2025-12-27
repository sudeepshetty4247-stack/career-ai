# CareerAI - AI-Powered Resume Analysis Platform

A modern, full-stack web application that analyzes resumes using AI to provide career predictions, skill analysis, and personalized learning roadmaps.

## 🚀 Features

- **AI-Powered Resume Analysis**: Upload PDF or paste resume text for intelligent analysis
- **Career Predictions**: Get probability-based career domain recommendations
- **Skill Assessment**: Comprehensive technical and soft skill evaluation with proficiency scores
- **Skill Gap Analysis**: Identify missing skills for your target career
- **Personalized Roadmap**: Short, mid, and long-term learning goals
- **Explainable AI**: Understand why predictions were made
- **User Authentication**: Secure login/signup with email
- **Analysis History**: Save and review past analyses (for logged-in users)
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Local Development Setup](#local-development-setup)
4. [Database Setup](#database-setup)
5. [Edge Function Setup](#edge-function-setup)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **npm** or **bun**: Comes with Node.js / [Download bun](https://bun.sh/)
- **Supabase CLI**: For database and edge functions
  ```bash
  npm install -g supabase
  ```
- **Git**: [Download](https://git-scm.com/)

## Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── AnalysisHistory.tsx
│   │   ├── CareerPrediction.tsx
│   │   ├── CareerRoadmap.tsx
│   │   ├── ExplainableAI.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ResumeUpload.tsx
│   │   └── SkillAnalysis.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAnalysisHistory.ts
│   │   ├── useAuth.tsx
│   │   ├── useResumeAnalysis.ts
│   │   └── use-toast.ts
│   ├── integrations/       # External service integrations
│   │   └── supabase/
│   ├── lib/                # Utility functions
│   │   ├── pdfParser.ts
│   │   └── utils.ts
│   ├── pages/              # Page components
│   │   ├── Auth.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx             # Main app component
│   ├── index.css           # Global styles
│   └── main.tsx            # Entry point
├── supabase/
│   ├── functions/          # Edge functions
│   │   └── analyze-resume/
│   │       └── index.ts
│   └── config.toml         # Supabase configuration
├── .env.example            # Environment variables template
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### Step 2: Install Dependencies

```bash
npm install
# or
bun install
```

### Step 3: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

## Database Setup

### Option A: Create Your Own Supabase Project (Recommended for Independence)

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Choose a name and password
   - Select a region close to your users
   - Wait for the project to be created (~2 minutes)

3. **Get Your Project Credentials**
   - Go to Project Settings → API
   - Copy your:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJ...`)
     - **Project ID** (from the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`)

4. **Run Database Migrations**

   Open the SQL Editor in your Supabase dashboard and run these queries:

   ```sql
   -- Create analysis_history table
   CREATE TABLE public.analysis_history (
     id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL,
     resume_text TEXT NOT NULL,
     analysis_result JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
   );

   -- Enable Row Level Security
   ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

   -- Create policies for user access
   CREATE POLICY "Users can view their own analysis history" 
   ON public.analysis_history 
   FOR SELECT 
   USING (auth.uid() = user_id);

   CREATE POLICY "Users can create their own analysis history" 
   ON public.analysis_history 
   FOR INSERT 
   WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own analysis history" 
   ON public.analysis_history 
   FOR DELETE 
   USING (auth.uid() = user_id);

   -- Create indexes for performance
   CREATE INDEX idx_analysis_history_user_id ON public.analysis_history(user_id);
   CREATE INDEX idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
   ```

5. **Configure Authentication**
   - Go to Authentication → Settings
   - Under "Email Auth", enable email sign-in
   - **IMPORTANT**: Disable "Confirm email" for easier testing
   - Set Site URL to your app URL (e.g., `http://localhost:8080`)

### Option B: Use Existing Supabase Project

If you already have a Supabase project, just update your `.env` file with your existing credentials.

## Edge Function Setup

### Step 1: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key or use an existing one
4. Copy the API key

### Step 2: Configure Supabase Edge Function

1. **Update `supabase/config.toml`**

   Replace `YOUR_PROJECT_ID` with your actual Supabase project ID:

   ```toml
   project_id = "your-actual-project-id"

   [api]
   enabled = true
   port = 54321

   [functions.analyze-resume]
   verify_jwt = false
   ```

2. **Add Secrets to Supabase**

   Using the Supabase CLI:

   ```bash
   # Login to Supabase
   supabase login

   # Link your project
   supabase link --project-ref YOUR_PROJECT_ID

   # Set the Google AI API key secret
   supabase secrets set GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

   Or via Supabase Dashboard:
   - Go to Project Settings → Edge Functions
   - Add a new secret: `GOOGLE_AI_API_KEY` = `your_key_here`

### Step 3: Deploy Edge Function

```bash
# Deploy the analyze-resume function
supabase functions deploy analyze-resume
```

## Environment Variables

Update your `.env` file with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

### Variable Descriptions

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Project Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anon key | Project Settings → API → anon key |
| `VITE_SUPABASE_PROJECT_ID` | Project identifier | URL in dashboard |

## Running the Application

### Development Mode

```bash
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:8080`

### Production Build

```bash
npm run build
npm run preview
```

## Deployment

### Deploy Frontend

You can deploy the frontend to any static hosting:

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Manual (Any Static Host)
```bash
npm run build
# Upload the `dist` folder to your hosting provider
```

### Deploy Edge Functions

Edge functions are deployed to Supabase:

```bash
supabase functions deploy analyze-resume
```

## Troubleshooting

### Common Issues

#### 1. "Failed to analyze resume" Error

**Cause**: Edge function not deployed or API key missing

**Solution**:
```bash
# Check if function is deployed
supabase functions list

# Verify secrets
supabase secrets list

# Redeploy function
supabase functions deploy analyze-resume
```

#### 2. "Top-level await not available" Build Error

**Cause**: Vite build target doesn't support top-level await

**Solution**: Ensure `vite.config.ts` has:
```typescript
build: {
  target: 'esnext',
},
optimizeDeps: {
  esbuildOptions: {
    target: 'esnext',
  },
},
```

#### 3. PDF Parsing Issues

**Cause**: PDF.js worker not loading

**Solution**: Check that the CDN link in `src/lib/pdfParser.ts` is accessible

#### 4. Authentication Not Working

**Cause**: Supabase auth not configured properly

**Solution**:
1. Check Site URL in Supabase Auth settings
2. Verify email auth is enabled
3. Check browser console for specific errors

#### 5. Analysis History Not Saving

**Cause**: RLS policies blocking access

**Solution**:
1. Verify you're logged in
2. Check that RLS policies are correctly set up
3. Verify `user_id` is being passed correctly

### Debug Mode

Add console logging to debug issues:

```typescript
// In useResumeAnalysis.ts
console.log('Analyzing resume...', resumeText.substring(0, 100));
console.log('Analysis result:', data);
```

### Getting Help

1. Check browser console for errors (F12 → Console)
2. Check Supabase dashboard for edge function logs
3. Verify all environment variables are set correctly

## 🔧 Customization

### Changing AI Model

In `supabase/functions/analyze-resume/index.ts`, you can change the model:

```typescript
// Current model (fast, cost-effective)
model: "gemini-2.0-flash"

// For more complex analysis
model: "gemini-1.5-pro"
```

### Modifying Analysis Prompt

Edit the `systemPrompt` in `supabase/functions/analyze-resume/index.ts` to customize what the AI analyzes and returns.

### Styling

- Global styles: `src/index.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Individual component files

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built with ❤️ using React, Vite, Tailwind CSS, Supabase, and Google AI**
