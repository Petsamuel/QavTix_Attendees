const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, 'src', 'actions');
let count = 0;

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;
            
            // Match any "try {" followed by cookie fetching or axios fetching
            // and move those lines ABOVE the try block.
            
            const regexCookies = /try\s*\{\s*(const\s+[a-zA-Z0-9_]+\s*=\s*await\s+cookies\(\)\s*[\r\n]+(?:\s*const\s+[a-zA-Z0-9_]+\s*=\s*[^\n]*?\?\.[a-zA-Z0-9_]+\s*[\r\n]+)?)/g;
            newContent = newContent.replace(regexCookies, '$1try {\n');
            
            const regexAxios = /try\s*\{\s*(const\s+[a-zA-Z0-9_]+\s*=\s*await\s+getServerAxios\(\)\s*[\r\n]+(?:\s*const\s+[a-zA-Z0-9_]+\s*=\s*[^\n]*?\?\.[a-zA-Z0-9_]+\s*[\r\n]+)?)/g;
            newContent = newContent.replace(regexAxios, '$1try {\n');

            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Modified:', fullPath);
                count++;
            }
        }
    }
}

processDirectory(actionsDir);
console.log('Modified ' + count + ' files.');
