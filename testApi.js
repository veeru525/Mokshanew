import * as XLSX from 'xlsx';
import fs from 'fs';
import http from 'http';

function run() {
    try {
        const fileBuf = fs.readFileSync('SampleProducts.xlsx');
        const workbook = XLSX.read(fileBuf);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        console.log("Sending", json.length, "items to API...");

        const payload = JSON.stringify(json);
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/products/bulk',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log("Success:", JSON.parse(data));
                } else {
                    console.error("Failed (HTTP", res.statusCode, "):", data);
                }
            });
        });

        req.on('error', (e) => {
            console.error("Request Error:", e.message);
        });

        req.write(payload);
        req.end();

    } catch (error) {
        console.error("Error:", error.message);
    }
}

run();
