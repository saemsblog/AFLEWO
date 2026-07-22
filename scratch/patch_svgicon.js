const fs = require('fs');
let code = fs.readFileSync('src/components/ui/SvgIcon.tsx', 'utf8');
const replacements = JSON.parse(fs.readFileSync('scratch/svg_replacements.json', 'utf8'));

for (const [key, val] of Object.entries(replacements)) {
    const regex = new RegExp(`\\n\\s*${key}:\\s*\\([\\s\\S]*?\\n\\s*\\),`, 'g');
    const newContent = `\n    ${key}: (\n        ${val}\n    ),`;
    
    // Check if the key exists before replacing, just in case
    if (regex.test(code)) {
        code = code.replace(regex, newContent);
        console.log(`Replaced ${key}`);
    } else {
        console.log(`Key ${key} not found for replacement.`);
    }
}

fs.writeFileSync('src/components/ui/SvgIcon.tsx', code);
console.log('Successfully patched SvgIcon.tsx');
