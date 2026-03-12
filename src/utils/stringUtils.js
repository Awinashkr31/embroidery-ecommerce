export const normalize = (str) => (str || '').toLowerCase().trim();

export const slugify = (str) => normalize(str).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
