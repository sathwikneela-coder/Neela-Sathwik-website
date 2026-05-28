const fs = require('fs');
const path = require('path');

const dir = 'e:\\Website';

function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                scanDir(fullPath);
            }
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Look for any occurrences of 91107
            if (content.includes('91107') || content.includes('9110707247')) {
                console.log(`\nFound in file: ${fullPath}`);
                const lines = content.split('\n');
                lines.forEach((line, idx) => {
                    if (line.includes('91107')) {
                        console.log(`  Line ${idx + 1}: ${line.trim()}`);
                    }
                });
            }
        }
    });
}

scanDir(dir);
