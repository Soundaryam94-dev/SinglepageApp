const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
};

function startServer() {
    const server = http.createServer((req, res) => {
        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error: ' + error.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });

    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is in use, trying ${PORT + 1}...`);
            PORT++;
            server.listen(PORT);
        } else {
            console.error('Server error:', e);
        }
    });

    server.listen(PORT, '127.0.0.1', () => {
        console.log(`\n==========================================`);
        console.log(`🎮 Game is ready!`);
        console.log(`🌐 Open your browser at: http://127.0.0.1:${PORT}/`);
        console.log(`==========================================\n`);
    });
}

startServer();
