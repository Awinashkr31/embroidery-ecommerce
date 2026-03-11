export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'browser-image-compression') {
    return {
      format: 'module',
      shortCircuit: true,
      url: new URL('./mock_bic.js', import.meta.url).href,
    };
  }
  if (specifier === '../config/supabase') {
    return {
      format: 'module',
      shortCircuit: true,
      url: new URL('./mock_supabase.js', import.meta.url).href,
    };
  }
  return nextResolve(specifier, context);
}
