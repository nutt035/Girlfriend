import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Universe data operations
export async function loadUniverseData(shareId: string) {
    try {
        const { data, error } = await supabase
            .from('universe_data')
            .select('data')
            .eq('share_id', shareId)
            .single();

        if (error) {
            console.error('Error loading data:', error);
            return null;
        }

        return data?.data || null;
    } catch (err) {
        console.error('Supabase error:', err);
        return null;
    }
}

export async function saveUniverseData(shareId: string, universeData: unknown) {
    try {
        const { data, error } = await supabase
            .from('universe_data')
            .upsert({
                share_id: shareId,
                data: universeData,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'share_id'
            })
            .select();

        if (error) {
            console.error('Error saving data:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Supabase error:', err);
        return false;
    }
}

export async function createNewUniverse(universeData: unknown) {
    try {
        // Generate a random share ID
        const shareId = generateShareId();

        const { data, error } = await supabase
            .from('universe_data')
            .insert({
                share_id: shareId,
                data: universeData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select();

        if (error) {
            console.error('Error creating universe:', error);
            return null;
        }

        return shareId;
    } catch (err) {
        console.error('Supabase error:', err);
        return null;
    }
}

export async function uploadImage(file: File) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error('Supabase storage error:', err);
        return null;
    }
}

function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
