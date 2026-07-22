const fs = require('fs');
const path = require('path');

function processSvg(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/<svg[\s\S]*<\/svg>/i);
    if (!match) return 'null';
    let svg = match[0];
    
    // Remove width and height attributes from the root <svg> tag
    svg = svg.replace(/^<svg[^>]*>/i, (tag) => {
        return tag.replace(/\s+(width|height)=['"][^'"]*['"]/gi, '');
    });
    
    // Fix styles: style="opacity:0.1;fill:#141616;" => style={{ opacity: '0.1', fill: '#141616' }}
    svg = svg.replace(/style=['"]([^'"]*)['"]/g, (m, styleStr) => {
        const parts = styleStr.split(';').filter(Boolean);
        const obj = parts.map(p => {
            const [k, v] = p.split(':');
            const camelK = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return `${camelK}: '${v.trim()}'`;
        }).join(', ');
        return `style={{ ${obj} }}`;
    });
    
    // Convert common attributes to camelCase
    const attrs = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset'];
    attrs.forEach(attr => {
        const camel = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
        svg = svg.replace(new RegExp(attr + '=', 'g'), camel + '=');
    });
    
    // Replace class= with className=
    svg = svg.replace(/\sclass=/g, ' className=');
    
    // Replace HTML comments
    svg = svg.replace(/<!--[\s\S]*?-->/g, '');

    // Replace xml:space
    svg = svg.replace(/xml:space=['"][^'"]*['"]/g, '');

    // Remove standalone xmlns:* that might cause issues, though normally fine in JSX if camelCased,
    // actually React wants xmlnsXlink for xmlns:xlink.
    svg = svg.replace(/xmlns:xlink/g, 'xmlnsXlink');
    svg = svg.replace(/xlink:href/g, 'xlinkHref');
    
    return svg;
}

const icons = {
    track_dance: 'context/icons ALL/acrobatic-2-svgrepo-com.svg',
    track_security: 'context/icons ALL/security-medium-rtl-svgrepo-com.svg',
    track_ushering: 'context/icons ALL/customer-service-2-svgrepo-com.svg',
    track_video: 'context/icons ALL/video-camera-svgrepo-com.svg',
    track_piano: 'context/icons ALL/piano-keyboard-svgrepo-com.svg'
};

const output = {};
for (const [key, relativePath] of Object.entries(icons)) {
    const fullPath = path.resolve('d:/AFLEWO/af v001', relativePath);
    output[key] = processSvg(fullPath);
}

fs.writeFileSync('scratch/svg_replacements.json', JSON.stringify(output, null, 2));
console.log('Saved to scratch/svg_replacements.json');
