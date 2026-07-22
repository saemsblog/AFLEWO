const fs = require('fs');
let c = fs.readFileSync('context/icons ALL/piano-keyboard-svgrepo-com.svg', 'utf8');

c = c.replace(/<\?xml[^>]*>/, '')
     .replace(/<!DOCTYPE[^>]*>/, '')
     .replace(/<!--[^>]*-->/, '')
     .replace(/<svg[^>]*>/, '')
     .replace(/<\/svg>/, '')
     .replace(/\n/g, '')
     .replace(/\s+/g, ' ')
     .replace(/style="fill:[^"]+"/g, 'fill="currentColor"');

console.log('<g transform="scale(0.046875)">' + c + '</g>');
