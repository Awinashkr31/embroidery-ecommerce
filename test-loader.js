import { fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  // Mock the supabase import specifically for testing services
  if (specifier === '../../config/supabase' || specifier.endsWith('/config/supabase.js')) {
    // Generate a data URL containing a dummy export
    return {
      url: 'data:text/javascript,export const supabase = { functions: { invoke: async () => ({}) } };',
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'module' && result.source) {
    let source = result.source.toString();
    // Replace import.meta.env with process.env so tests can inject env variables
    source = source.replace(/import\.meta\.env/g, 'process.env');
    return { ...result, source };
  }
  return result;
}
