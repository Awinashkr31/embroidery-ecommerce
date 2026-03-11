import test, { mock } from 'node:test';
import assert from 'node:assert';
import { DelhiveryService } from './delhivery.js';

test('DelhiveryService.createOrder', async (t) => {
    // Save original env
    const originalEnv = { ...process.env };

    t.afterEach(() => {
        // Restore env
        process.env = { ...originalEnv };
        // Restore mocks
        mock.restoreAll();
    });

    await t.test('throws Error when Delhivery Token is missing', async () => {
        delete process.env.VITE_DELHIVERY_TOKEN;

        await assert.rejects(
            async () => await DelhiveryService.createOrder({}),
            {
                name: 'Error',
                message: 'Delhivery Token missing'
            }
        );
    });

    await t.test('successfully creates order with proper payload mapping', async () => {
        process.env.VITE_DELHIVERY_TOKEN = 'mock-token';
        process.env.VITE_DELHIVERY_WAREHOUSE_NAME = 'mock-warehouse';

        // Mock system date to ensure deterministic tests
        mock.timers.enable({ apis: ['Date'], now: new Date('2025-01-01T12:00:00Z').getTime() });

        // Mock fetch
        mock.method(globalThis, 'fetch', async (url, options) => {
            assert.strictEqual(url, '/delhivery-api/api/cmu/create.json');
            assert.strictEqual(options.method, 'POST');
            assert.strictEqual(options.headers['Authorization'], 'Token mock-token');

            // Check form data
            const body = options.body;
            assert.strictEqual(body.get('format'), 'json');

            const data = JSON.parse(body.get('data'));

            // Validate payload mappings
            assert.strictEqual(data.pickup_location.name, 'mock-warehouse');

            const shipment = data.shipments[0];
            assert.strictEqual(shipment.name, 'John Doe');
            assert.strictEqual(shipment.add, '123 Main St');
            assert.strictEqual(shipment.pin, '110001');
            assert.strictEqual(shipment.payment_mode, 'COD');
            assert.strictEqual(shipment.cod_amount, 500);
            assert.strictEqual(shipment.total_amount, 500);
            assert.strictEqual(shipment.quantity, 3); // 1 + 2 items
            assert.strictEqual(shipment.order_date, '2025-01-01T12:00:00.000Z');

            return {
                ok: true,
                json: async () => ({ success: true, waybill: '123456789' })
            };
        });

        const orderDetails = {
            customerName: 'John Doe',
            address: '123 Main St',
            pincode: '110001',
            city: 'New Delhi',
            state: 'Delhi',
            phone: '9876543210',
            orderId: 'ORDER-123',
            paymentMethod: 'cod',
            mode: 'S',
            amount: 500,
            items: [
                { quantity: 1, name: 'Item 1' },
                { quantity: 2, name: 'Item 2' }
            ]
        };

        const result = await DelhiveryService.createOrder(orderDetails);
        assert.deepStrictEqual(result, { success: true, waybill: '123456789' });
    });

    await t.test('successfully creates order with prepaid mapping', async () => {
        process.env.VITE_DELHIVERY_TOKEN = 'mock-token';
        process.env.VITE_DELHIVERY_WAREHOUSE_NAME = 'mock-warehouse';

        mock.method(globalThis, 'fetch', async (url, options) => {
            const body = options.body;
            const data = JSON.parse(body.get('data'));
            const shipment = data.shipments[0];

            assert.strictEqual(shipment.payment_mode, 'Prepaid');
            assert.strictEqual(shipment.cod_amount, 0);

            return {
                ok: true,
                json: async () => ({ success: true })
            };
        });

        const orderDetails = {
            paymentMethod: 'prepaid',
            amount: 1000,
            items: []
        };

        const result = await DelhiveryService.createOrder(orderDetails);
        assert.deepStrictEqual(result, { success: true });
    });

    await t.test('throws error when Delhivery API fails', async () => {
        process.env.VITE_DELHIVERY_TOKEN = 'mock-token';

        mock.method(globalThis, 'fetch', async () => {
            return {
                ok: false,
                text: async () => 'Internal Server Error'
            };
        });

        const orderDetails = {
            items: []
        };

        // Suppress console.error for this test to avoid polluting test output
        const originalConsoleError = console.error;
        console.error = () => {};

        try {
            await assert.rejects(
                async () => await DelhiveryService.createOrder(orderDetails),
                {
                    name: 'Error',
                    message: 'Delhivery Order Creation Failed: Internal Server Error'
                }
            );
        } finally {
            console.error = originalConsoleError;
        }
    });
});
