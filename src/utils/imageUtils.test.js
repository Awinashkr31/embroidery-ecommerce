import { describe, it, expect } from 'vitest';
import { getOptimizedImageUrl } from './imageUtils';

describe('getOptimizedImageUrl', () => {
    it('returns an empty string if url is falsy', () => {
        expect(getOptimizedImageUrl(null)).toBe('');
        expect(getOptimizedImageUrl(undefined)).toBe('');
        expect(getOptimizedImageUrl('')).toBe('');
    });

    it('returns the unmodified URL if it is not a Supabase URL', () => {
        const nonSupabaseUrl = 'https://example.com/image.png';
        expect(getOptimizedImageUrl(nonSupabaseUrl)).toBe(nonSupabaseUrl);
    });

    it('appends default optimization parameters to a valid Supabase URL', () => {
        const supabaseUrl = 'https://project.supabase.co/storage/v1/object/public/images/test.jpg';
        const expectedUrl = 'https://project.supabase.co/storage/v1/object/public/images/test.jpg?quality=80&format=webp';

        expect(getOptimizedImageUrl(supabaseUrl)).toBe(expectedUrl);
    });

    it('appends custom optimization parameters to a valid Supabase URL', () => {
        const supabaseUrl = 'https://project.supabase.co/storage/v1/object/public/images/test.jpg';
        const expectedUrl = 'https://project.supabase.co/storage/v1/object/public/images/test.jpg?width=400&height=300&quality=90&format=avif';

        const result = getOptimizedImageUrl(supabaseUrl, {
            width: 400,
            height: 300,
            quality: 90,
            format: 'avif'
        });
        expect(result).toBe(expectedUrl);
    });

    it('does not append format parameter if format is "origin"', () => {
        const supabaseUrl = 'https://project.supabase.co/storage/v1/object/public/images/test.jpg';
        const expectedUrl = 'https://project.supabase.co/storage/v1/object/public/images/test.jpg?quality=80';

        const result = getOptimizedImageUrl(supabaseUrl, { format: 'origin' });
        expect(result).toBe(expectedUrl);
    });

    it('returns the original URL if parsing fails but it includes supabase.co', () => {
        // "invalid url supabase.co" will cause new URL() to throw
        const invalidUrl = 'invalid url supabase.co';
        expect(getOptimizedImageUrl(invalidUrl)).toBe(invalidUrl);
    });
});
