import { performance } from 'perf_hooks';

const settings = {};
// Real number of settings is around ~30 based on the code
for (let i = 0; i < 30; i++) {
    settings[`key_${i}`] = `value_${i}`;
}

const mockSupabase = {
    from: () => ({
        upsert: async (data, options) => {
            // simulate network latency - 50ms per network request
            await new Promise(resolve => setTimeout(resolve, 50));
            return { data, error: null };
        }
    })
};

async function runBenchmark() {
    console.log("Running N+1 Query Baseline...");
    const startN1 = performance.now();
    const updatesN1 = Object.entries(settings).map(([key, value]) => {
        return mockSupabase
            .from('website_settings')
            .upsert({
                setting_key: key,
                setting_value: value,
                updated_at: new Date().toISOString()
            }, { onConflict: 'setting_key' });
    });
    await Promise.all(updatesN1);
    const endN1 = performance.now();
    console.log(`N+1 Query took: ${(endN1 - startN1).toFixed(2)} ms`);

    console.log("Running Batch Upsert...");
    const startBatch = performance.now();

    // Batch upsert format
    const updatesArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
    }));

    await mockSupabase
        .from('website_settings')
        .upsert(updatesArray, { onConflict: 'setting_key' });

    const endBatch = performance.now();
    console.log(`Batch Upsert took: ${(endBatch - startBatch).toFixed(2)} ms`);

    console.log(`Improvement: ${((endN1 - startN1) / (endBatch - startBatch)).toFixed(2)}x faster`);
    console.log(`Number of network requests saved: ${Object.keys(settings).length - 1}`);
}

runBenchmark();
