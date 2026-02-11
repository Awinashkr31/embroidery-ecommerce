# Admin Access Troubleshooting

If you are receiving an **"Invalid login credentials"** error when trying to log in to the Admin Portal, follow these steps:

## 1. Verify Account Existence
The system enforces that the admin email must be **`awinashkr31@gmail.com`**.
Our diagnostics confirmed that this user **already exists** in your database.

## 2. Reset Your Password
Since the user exists, "Invalid login credentials" means the password is incorrect.

1.  Go to the **[Forgot Password Page](/sadmin/forgot-password)** (e.g., `http://localhost:5173/sadmin/forgot-password`).
2.  Enter `awinashkr31@gmail.com`.
3.  Click **Send Reset Link**.
4.  Check your email for the reset link.

## 3. Email Confirmation (If Needed)
If you try to login and get an error saying **"Email not confirmed"**, or if you want to manually confirm the email to be safe:

1.  Open your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to the **SQL Editor**.
3.  Open/Run the `confirm_email.sql` file (located in your project root) or run this command:
    ```sql
    UPDATE auth.users 
    SET email_confirmed_at = now() 
    WHERE email = 'awinashkr31@gmail.com';
    ```

## 4. Emergency Account Re-creation
If you still cannot access the account, you can delete the user from the Supabase Dashboard (Authentication > Users) and then visit **`/sadmin/register`** to create it again with a new password.
