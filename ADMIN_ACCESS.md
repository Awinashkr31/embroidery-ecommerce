# Admin Access Troubleshooting

The **"Invalid login credentials"** error persists because the password reset methods (SQL/Email) are failing in your environment.

## 🏁 The Definitive Fix: Delete & Re-create

Since you cannot log in, the fastest way to fix this is to delete the "broken" user and create a fresh one.

### Step 1: Delete the User from Supabase Dashboard
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Navigate to **Authentication** > **Users**.
3.  Find `awinashkr31@gmail.com`.
4.  Click the **three dots** (more options) on the right.
5.  Select **Delete User**. Confirm the deletion.

### Step 2: Create the Admin Account Again
1.  Go to your app's registration page: **[http://localhost:5173/sadmin/register](http://localhost:5173/sadmin/register)**.
2.  Enter Email: `awinashkr31@gmail.com`
3.  Enter Password: `NewStrongPassword123!` (or whatever you prefer).
4.  Submit.

### Step 3: Confirm Email (Crucial)
After registering, you MUST confirm the email manually for the login to work.
1.  Go back to **Supabase Dashboard** > **SQL Editor**.
2.  Run this command:
    ```sql
    UPDATE auth.users 
    SET email_confirmed_at = now() 
    WHERE email = 'awinashkr31@gmail.com';
    ```

### Step 4: Login
1.  Go to **[http://localhost:5173/sadmin/login](http://localhost:5173/sadmin/login)**.
2.  Login with your new credentials.
