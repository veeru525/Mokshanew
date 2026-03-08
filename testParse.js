import * as XLSX from 'xlsx';
import fs from 'fs';

try {
    const fileBuf = fs.readFileSync('SampleProducts.xlsx');
    // Using simple read
    const workbook = XLSX.read(fileBuf);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);

    console.log("Successfully parsed Excel. Row count:", json.length);
    console.log("First row preview:", Object.keys(json[0]));
} catch (error) {
    console.error("XLSX Parsing Error:", error.message);
}
