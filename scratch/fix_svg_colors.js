const fs = require('fs');
const path = require('path');

function processSvg(filePath, name) {
    let content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/<svg[\s\S]*<\/svg>/i);
    if (!match) return 'null';
    let svg = match[0];
    
    // Remove width and height attributes from the root <svg> tag
    svg = svg.replace(/^<svg[^>]*>/i, (tag) => {
        let newTag = tag.replace(/\s+(width|height)=['"][^'"]*['"]/gi, '');
        // Add fill="currentColor" if not present so paths without fill inherit it
        if (!/fill=/i.test(newTag)) {
            newTag = newTag.replace(/<svg/i, '<svg fill="currentColor"');
        }
        return newTag;
    });
    
    // Fix styles: style="opacity:0.1;fill:#141616;" => style={{ opacity: '0.1', fill: 'currentColor' }}
    svg = svg.replace(/style=['"]([^'"]*)['"]/g, (m, styleStr) => {
        const parts = styleStr.split(';').filter(Boolean);
        const objParts = [];
        
        let customOpacity = null;

        for (const p of parts) {
            const [k, v] = p.split(':').map(s => s.trim());
            const camelK = k.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            let newV = v;

            if (k === 'fill' || k === 'stroke') {
                if (v !== 'none' && v !== 'transparent') {
                    // It's a hardcoded color
                    newV = 'currentColor';
                    
                    // Assign opacity based on color for the piano/video/dance
                    if (v.includes('#FEF6EA') || v.includes('#FFFDF7')) {
                        customOpacity = '0.2';
                    } else if (v.includes('#303233')) {
                        customOpacity = '0.8';
                    } else if (v.includes('#59564F') || v.includes('rgb(44, 169, 188)') || v.includes('#66757F')) {
                        customOpacity = '0.6';
                    } else if (v.includes('#524C46')) {
                        customOpacity = '0.4';
                    }
                }
            }
            objParts.push(`${camelK}: '${newV}'`);
        }
        
        if (customOpacity && !objParts.some(p => p.startsWith('opacity:'))) {
            objParts.push(`opacity: '${customOpacity}'`);
        }

        return `style={{ ${objParts.join(', ')} }}`;
    });

    // Replace hardcoded fill="..." and stroke="..."
    svg = svg.replace(/(fill|stroke)=['"]([^'"]*)['"]/g, (m, attr, val) => {
        if (val === 'none' || val === 'transparent' || val === 'currentColor') {
            return m; // keep it
        }
        
        // Map color to currentColor, maybe inject an opacity attribute if needed
        let newOpacity = null;
        if (val === '#FEF6EA' || val === '#FFFDF7') {
            newOpacity = '0.2';
        } else if (val === '#303233') {
            newOpacity = '0.8';
        } else if (val === '#59564F' || val === '#66757F' || val === 'rgb(44, 169, 188)') {
            newOpacity = '0.6';
        } else if (val === '#524C46') {
            newOpacity = '0.4';
        }

        if (newOpacity) {
            return `${attr}="currentColor" opacity="${newOpacity}"`;
        }
        return `${attr}="currentColor"`;
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
    output[key] = processSvg(fullPath, key);
}

fs.writeFileSync('scratch/svg_replacements.json', JSON.stringify(output, null, 2));

let code = fs.readFileSync('src/components/ui/SvgIcon.tsx', 'utf8');

for (const [key, val] of Object.entries(output)) {
    const regex = new RegExp(`\\n\\s*${key}:\\s*\\([\\s\\S]*?\\n\\s*\\),`, 'g');
    const newContent = `\n    ${key}: (\n        ${val}\n    ),`;
    if (regex.test(code)) {
        code = code.replace(regex, newContent);
        console.log(`Replaced ${key}`);
    } else {
        console.log(`Key ${key} not found for replacement.`);
    }
}

fs.writeFileSync('src/components/ui/SvgIcon.tsx', code);
console.log('Successfully patched SvgIcon.tsx with recolored SVGs');
