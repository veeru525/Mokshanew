import * as XLSX from 'xlsx';
import { products } from './src/data/productsData.js';

const worksheet = XLSX.utils.json_to_sheet(products);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
XLSX.writeFile(workbook, "SampleProducts.xlsx");
console.log("SampleProducts.xlsx created successfully! You can use this to test the Excel upload feature.");
