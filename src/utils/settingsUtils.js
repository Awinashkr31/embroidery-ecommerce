import { supabase } from '../config/supabase';

export const fetchSetting = async (key) => {
    try {
        const { data, error } = await supabase
            .from('website_settings')
            .select('setting_value')
            .eq('setting_key', key)
            .single();

        if (error) {
            // If data is null (not found), return null, don't log error as it might just be unset
            if (error.code === 'PGRST116') return null;
            console.error(`Error fetching setting ${key}:`, error);
            return null;
        }

        return data?.setting_value;
    } catch (error) {
        console.error(`Unexpected error fetching setting ${key}:`, error);
        return null;
    }
};
