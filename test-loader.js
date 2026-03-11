export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context, nextLoad);
  if (result.format === 'module' && result.source) {
    const sourceString = result.source.toString();
    if (sourceString.includes('import.meta.env')) {
      const source = sourceString.replace(/import\.meta\.env/g, 'process.env');
      return {
        ...result,
        source
      };
    }
  }
  return result;
}
