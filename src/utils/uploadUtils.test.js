import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert';
import * as Module from 'node:module';

// Register the custom loader to mock browser-image-compression and supabase
Module.register('./__tests__/uploadUtils.loader.js', import.meta.url);

describe('compressImage', async () => {
  let compressImage;
  let setMockBehavior;
  let getLastOptions;

  before(async () => {
    // Dynamic import to ensure the loader takes effect before module evaluation
    const utils = await import('./uploadUtils.js');
    compressImage = utils.compressImage;
    const mockModule = await import('./__tests__/mock_bic.js');
    setMockBehavior = mockModule.setMockBehavior;
    getLastOptions = mockModule.getLastOptions;
  });

  beforeEach(() => {
    setMockBehavior('success');
  });

  test('successful compression with default maxWidth', async () => {
    // Create a dummy File object since we run in Node
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const result = await compressImage(file);

    assert.ok(result instanceof File);
    assert.strictEqual(result.name, 'compressed.jpg');
    assert.strictEqual(result.type, 'image/jpeg');

    const options = getLastOptions();
    assert.strictEqual(options.maxSizeMB, 0.2);
    assert.strictEqual(options.maxWidthOrHeight, 1920);
    assert.strictEqual(options.useWebWorker, true);
    assert.strictEqual(options.fileType, 'image/jpeg');
  });

  test('successful compression with custom maxWidth', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const result = await compressImage(file, 800);

    assert.ok(result instanceof File);
    const options = getLastOptions();
    assert.strictEqual(options.maxWidthOrHeight, 800);
  });

  test('fallback on error returns original file', async () => {
    setMockBehavior('error');
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const result = await compressImage(file);

    // Should return original file on error
    assert.strictEqual(result, file);
    assert.strictEqual(result.name, 'test.png');
  });
});
