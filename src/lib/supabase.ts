import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.error('ERROR: Credenciales de Supabase no válidas o faltantes en el archivo .env');
  console.log('Por favor, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY con valores reales de tu proyecto Supabase.');
}

// Inicializar con placeholders si las variables no son válidas para evitar que la app explote instantáneamente,
// aunque las llamadas a la base de datos fallarán.
export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
