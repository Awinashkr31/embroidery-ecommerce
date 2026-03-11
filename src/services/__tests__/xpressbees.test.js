import test from 'node:test';
import assert from 'node:assert';

import { XpressbeesService } from '../xpressbees.js';

test('checkServiceability - skips strictly when token is missing', async () => {
    // Save original
    const originalToken = process.env.VITE_XPRESSBEES_TOKEN;
    delete process.env.VITE_XPRESSBEES_TOKEN;

    const result = await XpressbeesService.checkServiceability('110001');
    assert.deepStrictEqual(result, { serviceable: true, city: '', state: '' });

    // Restore
    if (originalToken === undefined) {
        delete process.env.VITE_XPRESSBEES_TOKEN;
    } else {
        process.env.VITE_XPRESSBEES_TOKEN = originalToken;
    }
});

test('checkServiceability - success', async () => {
    // save original token and fetch
    const originalToken = process.env.VITE_XPRESSBEES_TOKEN;
    const originalFetch = global.fetch;
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;

    // suppress consoles
    console.warn = () => {};
    console.error = () => {};

    process.env.VITE_XPRESSBEES_TOKEN = 'mock-token';

    global.fetch = async (url, options) => {
        assert.ok(url.includes('pincode=110001'));
        assert.strictEqual(options.headers.Authorization, 'Bearer mock-token');

        return {
            ok: true,
            json: async () => ({
                status: true,
                data: {
                    serviceable: true,
                    city: 'Delhi',
                    state: 'Delhi',
                    cod: true
                }
            })
        };
    };

    const result = await XpressbeesService.checkServiceability('110001');
    assert.deepStrictEqual(result, {
        serviceable: true,
        city: 'Delhi',
        state: 'Delhi',
        codAvailable: true,
        details: {
            serviceable: true,
            city: 'Delhi',
            state: 'Delhi',
            cod: true
        }
    });

    // restore
    if (originalToken === undefined) {
        delete process.env.VITE_XPRESSBEES_TOKEN;
    } else {
        process.env.VITE_XPRESSBEES_TOKEN = originalToken;
    }
    global.fetch = originalFetch;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
});

test('checkServiceability - api non-ok response', async () => {
    const originalToken = process.env.VITE_XPRESSBEES_TOKEN;
    const originalFetch = global.fetch;
    const originalConsoleError = console.error;
    console.error = () => {};

    process.env.VITE_XPRESSBEES_TOKEN = 'mock-token';

    global.fetch = async () => ({
        ok: false
    });

    const result = await XpressbeesService.checkServiceability('110001');
    assert.strictEqual(result.serviceable, false);
    assert.strictEqual(result.error, 'Xpressbees API failed');

    if (originalToken === undefined) {
        delete process.env.VITE_XPRESSBEES_TOKEN;
    } else {
        process.env.VITE_XPRESSBEES_TOKEN = originalToken;
    }
    global.fetch = originalFetch;
    console.error = originalConsoleError;
});

test('checkServiceability - not serviceable status', async () => {
    const originalToken = process.env.VITE_XPRESSBEES_TOKEN;
    const originalFetch = global.fetch;

    process.env.VITE_XPRESSBEES_TOKEN = 'mock-token';

    global.fetch = async () => ({
        ok: true,
        json: async () => ({
            status: false,
            data: null
        })
    });

    const result = await XpressbeesService.checkServiceability('110001');
    assert.strictEqual(result.serviceable, false);

    if (originalToken === undefined) {
        delete process.env.VITE_XPRESSBEES_TOKEN;
    } else {
        process.env.VITE_XPRESSBEES_TOKEN = originalToken;
    }
    global.fetch = originalFetch;
});
