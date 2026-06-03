import { getProducts } from './controllers/productController.js';

// Mock Express req and res
const req = {
  query: {
    page: '1',
    limit: '10'
  }
} as any;

const res = {
  json: (data: any) => {
    console.log("PRODUCTS API SUCCESS DATA:", JSON.stringify(data, null, 2));
  },
  status: (code: number) => {
    console.log("PRODUCTS API STATUS:", code);
    return res;
  }
} as any;

getProducts(req, res).catch(console.error);
