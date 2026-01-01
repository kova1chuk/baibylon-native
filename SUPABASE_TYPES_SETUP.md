# Supabase Type Generation Setup

## Option 1: Using Linked Project (Recommended)

1. **Login to Supabase CLI:**

   ```bash
   supabase login
   ```

   This will open a browser for authentication.

2. **Link your project:**

   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

   Find your project reference ID in Supabase Dashboard → Settings → General

3. **Generate types:**
   ```bash
   pnpm supabase:types
   ```

## Option 2: Using Project ID Directly (No Linking Required)

If you prefer not to link, you can generate types directly:

```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Or use the script:

```bash
pnpm supabase:types:project YOUR_PROJECT_ID
```

## Option 3: Using Access Token

Set your access token as an environment variable:

```bash
export SUPABASE_ACCESS_TOKEN=your_access_token_here
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

You can get your access token from: https://app.supabase.com/account/tokens

## Notes

- Types will be generated in `src/types/supabase.ts`
- Run this command whenever your database schema changes
- The generated types are automatically used by `src/lib/supabase.ts`
