import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { generateXpressbeesCSV } from './xpressbeesCSV.js';

describe('generateXpressbeesCSV', () => {
    beforeEach(() => {
        mock.method(console, 'warn', () => {});
        mock.method(console, 'log', () => {});
    });

    afterEach(() => {
        mock.restoreAll();
    });

    it('returns null for null or empty orders', () => {
        assert.strictEqual(generateXpressbeesCSV(null), null);
        assert.strictEqual(generateXpressbeesCSV([]), null);
    });

    it('skips orders with invalid phone', () => {
        const orders = [
            {
                id: '123',
                customer: { phone: '12345' }, // Less than 10 digits
                items: [{ id: '1', quantity: 1, price: 10 }]
            }
        ];
        const result = generateXpressbeesCSV(orders);
        // Only headers should be returned since the order is skipped
        const rows = result.split('\n');
        assert.strictEqual(rows.length, 1);
        assert.ok(rows[0].startsWith('Order ID'));
    });

    it('skips orders with no items', () => {
        const orders = [
            {
                id: '124',
                customer: { phone: '1234567890' },
                items: []
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        assert.strictEqual(rows.length, 1);
    });

    it('generates standard order CSV row with proper escaping', () => {
        const orders = [
            {
                id: '125',
                paymentMethod: 'prepaid',
                total: 100,
                customer: {
                    firstName: 'John',
                    lastName: 'Doe, Jr.', // Contains comma, should be escaped
                    address: '123 Main St, Apt 4B',
                    phone: '9876543210',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001'
                },
                items: [
                    { id: 'item1', name: 'T-Shirt "Cool"', sku: 'TS1', quantity: 2, price: 50, weight: 0.2 } // Weight 0.2 kg -> 200 gm
                ]
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        assert.strictEqual(rows.length, 2);

        const dataRow = rows[1];
        // Split considering CSV quotes logic is complex, simple checks:
        assert.ok(dataRow.startsWith('125,Prepaid,0,John,"Doe, Jr.","123 Main St, Apt 4B",.,9876543210,,New York,NY,10001,200,10,10,5'));
        assert.ok(dataRow.includes('TS1,"T-Shirt ""Cool""",2,50,100'));
    });

    it('handles COD orders correctly', () => {
        const orders = [
            {
                id: '126',
                paymentMethod: 'cod',
                total: 500,
                customer: { phone: '1234567890' },
                items: [{ id: '2', sku: 'SKU2', name: 'Item', quantity: 1, price: 500 }]
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        assert.strictEqual(rows.length, 2);
        const dataRow = rows[1];
        // COD, 500
        assert.ok(dataRow.startsWith('126,COD,500,'));
    });

    it('splits large orders (more than 10 items) and handles COD properly', () => {
        const items = Array.from({ length: 15 }, (_, i) => ({
            id: `item${i}`,
            sku: `SKU${i}`,
            name: `Item ${i}`,
            quantity: 1,
            price: 10,
            weight: 100 // 100gm each
        }));

        const orders = [
            {
                id: '127',
                paymentMethod: 'cod',
                total: 150, // total cod
                customer: { phone: '1234567890' },
                items
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        assert.strictEqual(rows.length, 3); // Headers + 2 chunks

        const chunk1 = rows[1];
        const chunk2 = rows[2];

        // First row should have COD Amount = 150, Second row should have 0
        assert.ok(chunk1.startsWith('127,COD,150,'));
        assert.ok(chunk2.startsWith('127,COD,0,'));

        // Weight for 10 items = 1000gm
        assert.ok(chunk1.includes(',1000,10,10,5,0,0,0,'));
        // Weight for 5 items = 500gm
        assert.ok(chunk2.includes(',500,10,10,5,0,0,0,'));

        // SKU check for first row and second row
        assert.ok(chunk1.includes('SKU0,Item 0,1,10,10'));
        assert.ok(chunk2.includes('SKU10,Item 10,1,10,10'));
    });

    it('splits address > 100 chars properly', () => {
        const longAddress = 'A'.repeat(120);
        const orders = [
            {
                id: '128',
                customer: {
                    phone: '1234567890',
                    address: longAddress
                },
                items: [{ id: '1', quantity: 1, price: 10 }]
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        assert.strictEqual(rows.length, 2);
        const addr1 = 'A'.repeat(100);
        const addr2 = 'A'.repeat(20);
        // payment=Prepaid, cod=0, first=, last=.
        assert.ok(rows[1].includes(`Prepaid,0,,.,${addr1},${addr2},1234567890`));
    });

    it('displays MRP when originalPrice > price', () => {
        const orders = [
            {
                id: '129',
                customer: { phone: '1234567890' },
                items: [
                    { id: '1', sku: 'S1', name: 'Discounted Shirt', originalPrice: 1000, price: 750, quantity: 1 }
                ]
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        // Expected format: SKU, Product Name (MRP ₹1000), 1, 750, 750
        assert.ok(rows[1].includes('S1,Discounted Shirt (MRP ₹1000),1,750,750'));
    });

    it('handles phone numbers starting with 91 and > 10 chars', () => {
        const orders = [
            {
                id: '130',
                customer: { phone: '919876543210' }, // 12 digits starting with 91
                items: [{ id: '1', quantity: 1, price: 10 }]
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        assert.ok(rows[1].includes('9876543210')); // Check if 91 is stripped
    });

    it('falls back to 500g weight if not provided', () => {
        const orders = [
            {
                id: '131',
                customer: { phone: '1234567890' },
                items: [{ id: '1', quantity: 1, price: 10 }] // No weight
            }
        ];
        const result = generateXpressbeesCSV(orders);
        const rows = result.split('\n');
        assert.ok(rows[1].includes(',500,10,10,5,0,0,0,'));
    });
});
