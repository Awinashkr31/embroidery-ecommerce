import { test, describe, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { DelhiveryService } from '../delhivery.js';

describe('DelhiveryService.createOrder', () => {
  let originalFetch;

  beforeEach(() => {
    // Setup mock fetch
    originalFetch = global.fetch;

    // Default fetch mock behavior
    global.fetch = mock.fn(async () => {
      return {
        ok: true,
        json: async () => ({ success: true, waybill: '123456789' })
      };
    });

    // Setup mock env
    process.env.VITE_DELHIVERY_TOKEN = 'test_token';
    process.env.VITE_DELHIVERY_WAREHOUSE_NAME = 'Test_Warehouse';

    // Mock the date to ensure deterministic tests
    mock.timers.enable({ apis: ['Date'], now: new Date('2024-03-01T12:00:00.000Z') });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    mock.timers.reset();
  });

  test('successfully creates a prepaid order', async () => {
    const orderDetails = {
      customerName: 'John Doe',
      address: '123 Test St',
      pincode: '110001',
      city: 'New Delhi',
      state: 'Delhi',
      phone: '9876543210',
      orderId: 'ORD-001',
      paymentMethod: 'prepaid',
      amount: 1500,
      items: [{ quantity: 2 }, { quantity: 1 }]
    };

    const result = await DelhiveryService.createOrder(orderDetails);

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.waybill, '123456789');

    assert.strictEqual(global.fetch.mock.calls.length, 1);
    const fetchCall = global.fetch.mock.calls[0];
    assert.strictEqual(fetchCall.arguments[0], '/delhivery-api/api/cmu/create.json');
    assert.strictEqual(fetchCall.arguments[1].method, 'POST');
    assert.strictEqual(fetchCall.arguments[1].headers.Authorization, 'Token test_token');

    // Ensure FormData is constructed correctly
    const formData = fetchCall.arguments[1].body;
    assert.strictEqual(formData.get('format'), 'json');

    const payloadData = JSON.parse(formData.get('data'));
    const shipment = payloadData.shipments[0];

    assert.strictEqual(shipment.name, 'John Doe');
    assert.strictEqual(shipment.payment_mode, 'Prepaid');
    assert.strictEqual(shipment.cod_amount, 0);
    assert.strictEqual(shipment.quantity, 3);
    assert.strictEqual(shipment.order_date, '2024-03-01T12:00:00.000Z');

    const pickup = payloadData.pickup_location;
    assert.strictEqual(pickup.name, 'Test_Warehouse');
  });

  test('successfully creates a COD order', async () => {
    const orderDetails = {
      customerName: 'Jane Smith',
      address: '456 Test Ave',
      pincode: '400001',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '9876543211',
      orderId: 'ORD-002',
      paymentMethod: 'cod',
      amount: 2500,
      items: [{ quantity: 1 }]
    };

    const result = await DelhiveryService.createOrder(orderDetails);
    assert.strictEqual(result.success, true);

    const fetchCall = global.fetch.mock.calls[0];
    const formData = fetchCall.arguments[1].body;
    const payloadData = JSON.parse(formData.get('data'));
    const shipment = payloadData.shipments[0];

    assert.strictEqual(shipment.payment_mode, 'COD');
    assert.strictEqual(shipment.cod_amount, 2500);
    assert.strictEqual(shipment.quantity, 1);
  });

  test('throws error if token is missing', async () => {
    delete process.env.VITE_DELHIVERY_TOKEN;

    await assert.rejects(
      async () => await DelhiveryService.createOrder({}),
      { message: 'Delhivery Token missing' }
    );
  });

  test('handles API error response', async () => {
    global.fetch = mock.fn(async () => {
      return {
        ok: false,
        text: async () => 'Invalid Pincode'
      };
    });

    const orderDetails = {
      customerName: 'Error User',
      address: 'Error St',
      pincode: '999999',
      city: 'Error City',
      state: 'Error State',
      phone: '9999999999',
      orderId: 'ORD-ERR',
      paymentMethod: 'prepaid',
      amount: 1000,
      items: [{ quantity: 1 }]
    };

    await assert.rejects(
      async () => await DelhiveryService.createOrder(orderDetails),
      { message: 'Delhivery Order Creation Failed: Invalid Pincode' }
    );
  });
});
