import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'module' && url.startsWith('file://')) {
    const filePath = fileURLToPath(url);
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let source = await readFile(filePath, 'utf8');
        // Replace process.env mapping
        source = source.replace(/import\.meta\.env\.VITE_SUPABASE_URL/g, "'https://localhost'");
        source = source.replace(/import\.meta\.env\.VITE_SUPABASE_ANON_KEY/g, "'fake_key'");
        source = source.replace(/import\.meta\.env\.VITE_XPRESSBEES_TOKEN/g, "process.env.VITE_XPRESSBEES_TOKEN");
        source = source.replace(/import\.meta\.env\.VITE_XPRESSBEES_WAREHOUSE_NAME/g, "process.env.VITE_XPRESSBEES_WAREHOUSE_NAME");
        source = source.replace(/import\.meta\.env/g, "process.env");
        return {
            format: 'module',
            source: source,
            shortCircuit: true,
        };
    }
  }
  return result;
}
