const fs = require('fs');

const files = [
    'context/icons ALL/piano-keyboard-svgrepo-com.svg',
    'context/icons ALL/acrobatic-2-svgrepo-com.svg',
    'context/icons ALL/security-medium-rtl-svgrepo-com.svg',
    'context/icons ALL/customer-service-2-svgrepo-com.svg',
    'context/icons ALL/video-camera-svgrepo-com.svg'
];

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    
    let scale = 1;
    let vbMatch = c.match(/viewBox="0 0 ([0-9.]+) ([0-9.]+)"/);
    if (vbMatch) {
        scale = 24 / parseFloat(vbMatch[1]);
    } else {
        let wMatch = c.match(/width="([0-9.]+)"/);
        if (wMatch) scale = 24 / parseFloat(wMatch[1]);
    }

    c = c.replace(/<\?xml[^>]*>/g, '')
         .replace(/<!DOCTYPE[^>]*>/g, '')
         .replace(/<!--[\s\S]*?-->/g, '')
         .replace(/<svg[^>]*>/g, '')
         .replace(/<\/svg>/g, '')
         .replace(/\n/g, '')
         .replace(/\s+/g, ' ')
         .replace(/class="[^"]*"/g, '')
         .replace(/style="([^"]+)"/g, () => 'fill="currentColor"')
         .replace(/fill="[^"]*"/g, 'fill="currentColor"')
         .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
         .replace(/stroke-width/g, 'strokeWidth')
         .replace(/stroke-linecap/g, 'strokeLinecap')
         .replace(/stroke-linejoin/g, 'strokeLinejoin')
         .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
         .replace(/fill-rule/g, 'fillRule')
         .replace(/clip-rule/g, 'clipRule')
         .replace(/fill-opacity/g, 'fillOpacity')
         .replace(/xml:space="[^"]*"/g, '');

    let g = `<g${scale !== 1 ? ` transform="scale(${scale})"` : ''}>`;
    console.log(`\n=== ${f.split('/').pop().split('.')[0]} ===\n`);
    console.log(`${g}${c}</g>`);
});
