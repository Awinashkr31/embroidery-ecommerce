const fs = require('fs');
const current = fs.readFileSync('tailwind.config.js', 'utf8');

const newColors = {
  'surface-tint': '#a5384a',
  'error': '#ba1a1a',
  'surface-container': '#faeaea',
  'primary-fixed': '#ffdadb',
  'on-tertiary-container': '#fff6f4',
  'primary-fixed-dim': '#ffb2b9',
  'background': '#fff8f7',
  'on-surface-variant': '#564243',
  'surface-cream': '#FBF8F5',
  'on-primary-fixed': '#40000f',
  'on-error-container': '#93000a',
  'surface-variant': '#efdfde',
  'tertiary-fixed-dim': '#fbb6a8',
  'pistachio-text': '#3F5F49',
  'inverse-primary': '#ffb2b9',
  'surface-container-low': '#fff0f0',
  'surface-dim': '#e6d6d6',
  'outline-variant': '#ddc0c1',
  'on-primary-fixed-variant': '#852033',
  'surface-blush': '#F6ECE8',
  'secondary-container': '#caebd1',
  'border-warm': '#EFE5DE',
  'secondary': '#486551',
  'on-secondary': '#ffffff',
  'pistachio-badge': '#EAF0EA',
  'surface': '#fff8f7',
  'on-secondary-container': '#4e6b56',
  'on-tertiary-fixed-variant': '#6a3930',
  'terracotta-dark': '#8C2F3D',
  'surface-container-lowest': '#ffffff',
  'inverse-on-surface': '#fdedec',
  'on-background': '#221a1a',
  'on-tertiary': '#ffffff',
  'on-secondary-fixed': '#042011',
  'surface-bright': '#fff8f7',
  'on-primary': '#ffffff',
  'on-error': '#ffffff',
  'secondary-fixed-dim': '#aeceb6',
  'on-surface': '#221a1a',
  'tertiary-fixed': '#ffdad3',
  'primary-container': '#be4b5c',
  'tertiary-container': '#9c6358',
  'surface-card': '#FFFFFF',
  'on-tertiary-fixed': '#351009',
  'on-secondary-fixed-variant': '#314d3a',
  'surface-container-high': '#f4e5e4',
  'primary': '#9e3345',
  'error-container': '#ffdad6',
  'tertiary': '#804b41',
  'surface-container-highest': '#efdfde',
  'inverse-surface': '#372e2e',
  'on-primary-container': '#fff6f6',
  'secondary-fixed': '#caebd1',
  'outline': '#897173',
  'espresso-muted': '#6E6363'
};

const newSpacing = {
  'space-2xl': '2rem',
  'space-xs': '0.375rem',
  'space-2xs': '0.25rem',
  'space-xl': '1.5rem',
  'space-md': '0.75rem',
  'space-3xl': '3rem',
  'margin-desktop': '2.5rem',
  'gutter-desktop': '1.25rem',
  'gutter': '0.75rem',
  'space-lg': '1rem',
  'space-sm': '0.5rem'
};

const newFonts = {
  'label-sm': ['Plus Jakarta Sans'],
  'body-sm': ['Plus Jakarta Sans'],
  'headline-lg-mobile': ['Playfair Display'],
  'headline-lg': ['Playfair Display'],
  'price-lg': ['Plus Jakarta Sans'],
  'headline-xl': ['Playfair Display'],
  'body-lg': ['Plus Jakarta Sans'],
  'title-md': ['Plus Jakarta Sans'],
  'price-sm': ['Plus Jakarta Sans'],
  'headline-xl-mobile': ['Playfair Display'],
  'body-md': ['Plus Jakarta Sans'],
  'title-lg': ['Plus Jakarta Sans'],
  'headline-md': ['Playfair Display'],
  'label-md': ['Plus Jakarta Sans']
};

const newFontSizes = {
  'label-sm': ['11px', { 'lineHeight': '14px', 'fontWeight': '600' }],
  'body-sm': ['12px', { 'lineHeight': '16px', 'fontWeight': '400' }],
  'headline-lg-mobile': ['22px', { 'lineHeight': '30px', 'fontWeight': '600' }],
  'headline-lg': ['28px', { 'lineHeight': '36px', 'fontWeight': '600' }],
  'price-lg': ['18px', { 'lineHeight': '22px', 'fontWeight': '700' }],
  'headline-xl': ['36px', { 'lineHeight': '44px', 'fontWeight': '600' }],
  'body-lg': ['16px', { 'lineHeight': '24px', 'fontWeight': '400' }],
  'title-md': ['16px', { 'lineHeight': '22px', 'fontWeight': '600' }],
  'price-sm': ['14px', { 'lineHeight': '18px', 'fontWeight': '600' }],
  'headline-xl-mobile': ['28px', { 'lineHeight': '36px', 'fontWeight': '600' }],
  'body-md': ['14px', { 'lineHeight': '20px', 'fontWeight': '400' }],
  'title-lg': ['18px', { 'lineHeight': '24px', 'fontWeight': '700' }],
  'headline-md': ['20px', { 'lineHeight': '28px', 'fontWeight': '600' }],
  'label-md': ['13px', { 'lineHeight': '16px', 'fontWeight': '600' }]
};

const insertObjStr = (obj) => {
  return Object.entries(obj).map(([k, v]) => `        '${k}': ${JSON.stringify(v)}`).join(',\n');
};

let output = current;
output = output.replace('colors: {', 'colors: {\n' + insertObjStr(newColors) + ',');
output = output.replace('fontFamily: {', 'fontFamily: {\n' + insertObjStr(newFonts) + ',');
// add spacing and fontSize to extend
output = output.replace('extend: {', 'extend: {\n      spacing: {\n' + insertObjStr(newSpacing) + '\n      },\n      fontSize: {\n' + insertObjStr(newFontSizes) + '\n      },');

fs.writeFileSync('tailwind.config.js', output);
console.log('updated tailwind.config.js');
