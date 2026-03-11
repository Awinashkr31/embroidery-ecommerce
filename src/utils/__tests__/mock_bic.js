let mockBehavior = 'success';
let lastOptions = null;

export function setMockBehavior(behavior) {
  mockBehavior = behavior;
}

export function getLastOptions() {
  return lastOptions;
}

export default async function imageCompression(file, options) {
  lastOptions = options;
  if (mockBehavior === 'error') {
    throw new Error('Compression failed mock error');
  }
  return new File([file], 'compressed.jpg', { type: 'image/jpeg' });
}
