export const getAuthErrorMessage = (error) => {
  const code = error.code || error.message;
  
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials.';
    
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
      
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
      
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later or reset your password.';
      
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
      
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled.';
      
    default:
      // Remove "Firebase: " prefix if it exists to make it slightly cleaner
      // even for unknown errors
      return error.message?.replace('Firebase: ', '') || 'An unexpected error occurred. Please try again.';
  }
};
