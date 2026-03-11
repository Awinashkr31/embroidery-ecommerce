import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from './authErrors';

describe('getAuthErrorMessage', () => {
  it('should return correct message for invalid credentials', () => {
    const error = { code: 'auth/invalid-credential' };
    expect(getAuthErrorMessage(error)).toBe('Invalid email or password. Please check your credentials.');
  });

  it('should return correct message for invalid email', () => {
    const error = { code: 'auth/invalid-email' };
    expect(getAuthErrorMessage(error)).toBe('Invalid email or password. Please check your credentials.');
  });

  it('should return correct message for user not found', () => {
    const error = { code: 'auth/user-not-found' };
    expect(getAuthErrorMessage(error)).toBe('Invalid email or password. Please check your credentials.');
  });

  it('should return correct message for wrong password', () => {
    const error = { code: 'auth/wrong-password' };
    expect(getAuthErrorMessage(error)).toBe('Invalid email or password. Please check your credentials.');
  });

  it('should return correct message for email already in use', () => {
    const error = { code: 'auth/email-already-in-use' };
    expect(getAuthErrorMessage(error)).toBe('This email is already registered. Please login instead.');
  });

  it('should return correct message for weak password', () => {
    const error = { code: 'auth/weak-password' };
    expect(getAuthErrorMessage(error)).toBe('Password should be at least 6 characters.');
  });

  it('should return correct message for too many requests', () => {
    const error = { code: 'auth/too-many-requests' };
    expect(getAuthErrorMessage(error)).toBe('Too many attempts. Please try again later or reset your password.');
  });

  it('should return correct message for network request failed', () => {
    const error = { code: 'auth/network-request-failed' };
    expect(getAuthErrorMessage(error)).toBe('Network error. Please check your internet connection.');
  });

  it('should return correct message for popup closed by user', () => {
    const error = { code: 'auth/popup-closed-by-user' };
    expect(getAuthErrorMessage(error)).toBe('Sign in was cancelled.');
  });

  it('should fallback to error.message if code is not provided', () => {
    const error = { message: 'auth/email-already-in-use' };
    expect(getAuthErrorMessage(error)).toBe('This email is already registered. Please login instead.');
  });

  it('should strip "Firebase: " prefix for unknown errors with a message', () => {
    const error = { code: 'unknown/error', message: 'Firebase: Some generic error message' };
    expect(getAuthErrorMessage(error)).toBe('Some generic error message');
  });

  it('should return original message for unknown errors without "Firebase: " prefix', () => {
    const error = { code: 'unknown/error', message: 'Some generic error message' };
    expect(getAuthErrorMessage(error)).toBe('Some generic error message');
  });

  it('should strip "Firebase: " prefix even when message is used for switch matching', () => {
    const error = { message: 'Firebase: Some generic error message' };
    expect(getAuthErrorMessage(error)).toBe('Some generic error message');
  });

  it('should return default fallback message when error object is empty', () => {
    const error = {};
    expect(getAuthErrorMessage(error)).toBe('An unexpected error occurred. Please try again.');
  });

  it('should return default fallback message for unknown error with no message', () => {
    const error = { code: 'some-unknown-code' };
    expect(getAuthErrorMessage(error)).toBe('An unexpected error occurred. Please try again.');
  });
});
