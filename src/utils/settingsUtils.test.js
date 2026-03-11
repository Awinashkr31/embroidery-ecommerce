import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchSetting } from './settingsUtils.js';

vi.mock('../config/supabase.js', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn()
                }))
            }))
        }))
    }
}));

import { supabase } from '../config/supabase.js';

describe('fetchSetting', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch setting successfully', async () => {
        const mockSingle = vi.fn().mockResolvedValue({ data: { setting_value: 'mock_value' }, error: null });
        const mockEq = vi.fn(() => ({ single: mockSingle }));
        const mockSelect = vi.fn(() => ({ eq: mockEq }));

        supabase.from.mockReturnValue({ select: mockSelect });

        const result = await fetchSetting('test_key');

        expect(result).toBe('mock_value');
        expect(supabase.from).toHaveBeenCalledWith('website_settings');
        expect(mockSelect).toHaveBeenCalledWith('setting_value');
        expect(mockEq).toHaveBeenCalledWith('setting_key', 'test_key');
    });

    it('should handle PGRST116 error (not found) and return null', async () => {
        const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
        const mockEq = vi.fn(() => ({ single: mockSingle }));
        const mockSelect = vi.fn(() => ({ eq: mockEq }));

        supabase.from.mockReturnValue({ select: mockSelect });

        const result = await fetchSetting('missing_key');

        expect(result).toBeNull();
    });

    it('should log error and return null for other errors', async () => {
        const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { code: 'OTHER', message: 'test error' } });
        const mockEq = vi.fn(() => ({ single: mockSingle }));
        const mockSelect = vi.fn(() => ({ eq: mockEq }));

        supabase.from.mockReturnValue({ select: mockSelect });

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await fetchSetting('error_key');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching setting error_key:', { code: 'OTHER', message: 'test error' });

        consoleSpy.mockRestore();
    });

    it('should handle unexpected exceptions', async () => {
        supabase.from.mockImplementation(() => { throw new Error('Unexpected exception'); });

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const result = await fetchSetting('exception_key');

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Unexpected error fetching setting exception_key:', expect.any(Error));

        consoleSpy.mockRestore();
    });
});
