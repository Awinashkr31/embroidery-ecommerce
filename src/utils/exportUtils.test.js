import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { exportToCSV } from './exportUtils.js';

describe('exportToCSV', () => {
    let originalConsoleWarn;
    let originalBlob;
    let originalDocument;
    let originalURL;

    beforeEach(() => {
        originalConsoleWarn = console.warn;
        originalBlob = global.Blob;
        originalDocument = global.document;
        originalURL = global.URL;

        console.warn = mock.fn();
    });

    afterEach(() => {
        console.warn = originalConsoleWarn;
        global.Blob = originalBlob;
        global.document = originalDocument;
        global.URL = originalURL;
        mock.restoreAll();
    });

    it('should warn and return early if data is falsy', () => {
        exportToCSV(null, 'test');
        assert.strictEqual(console.warn.mock.calls.length, 1);
        assert.strictEqual(console.warn.mock.calls[0].arguments[0], 'No data to export');
    });

    it('should warn and return early if data is an empty array', () => {
        exportToCSV([], 'test');
        assert.strictEqual(console.warn.mock.calls.length, 1);
        assert.strictEqual(console.warn.mock.calls[0].arguments[0], 'No data to export');
    });

    it('should correctly format and export CSV data, including DOM interactions', () => {
        const testData = [
            { id: 1, name: 'John "Doe", Jr.', age: null },
            { id: 2, name: 'Jane Smith', age: 30 }
        ];

        // Mock Blob
        let blobContent = [];
        let blobOptions = {};
        global.Blob = class {
            constructor(content, options) {
                blobContent = content;
                blobOptions = options;
            }
        };

        // Mock URL.createObjectURL
        global.URL = {
            createObjectURL: mock.fn(() => 'blob:test-url')
        };

        // Mock DOM element and document
        const mockLink = {
            setAttribute: mock.fn(),
            style: {},
            click: mock.fn(),
            download: ''
        };

        global.document = {
            createElement: mock.fn((tag) => {
                if (tag === 'a') return mockLink;
                return {};
            }),
            body: {
                appendChild: mock.fn(),
                removeChild: mock.fn()
            }
        };

        exportToCSV(testData, 'users_export');

        // Assert CSV Content formatting
        const expectedCsv = [
            'id,name,age',
            '"1","John ""Doe"", Jr.",""',
            '"2","Jane Smith","30"'
        ].join('\n');

        assert.strictEqual(blobContent.length, 1);
        assert.strictEqual(blobContent[0], expectedCsv);
        assert.deepStrictEqual(blobOptions, { type: 'text/csv;charset=utf-8;' });

        // Assert DOM interactions
        assert.strictEqual(global.document.createElement.mock.calls.length, 1);
        assert.strictEqual(global.document.createElement.mock.calls[0].arguments[0], 'a');

        assert.strictEqual(global.URL.createObjectURL.mock.calls.length, 1);

        assert.strictEqual(mockLink.setAttribute.mock.calls.length, 2);
        assert.deepStrictEqual(mockLink.setAttribute.mock.calls[0].arguments, ['href', 'blob:test-url']);
        assert.deepStrictEqual(mockLink.setAttribute.mock.calls[1].arguments, ['download', 'users_export.csv']);

        assert.strictEqual(mockLink.style.visibility, 'hidden');

        assert.strictEqual(global.document.body.appendChild.mock.calls.length, 1);
        assert.strictEqual(global.document.body.appendChild.mock.calls[0].arguments[0], mockLink);

        assert.strictEqual(mockLink.click.mock.calls.length, 1);

        assert.strictEqual(global.document.body.removeChild.mock.calls.length, 1);
        assert.strictEqual(global.document.body.removeChild.mock.calls[0].arguments[0], mockLink);
    });

    it('should not throw if link.download is undefined (old browser path)', () => {
         const testData = [{ a: 1 }];

         global.Blob = class {};

         const mockLink = {}; // no download property

         global.document = {
            createElement: () => mockLink
         };

         // Should execute without throwing errors
         exportToCSV(testData, 'test');
    });
});
