import { Router } from 'express';
import { validateBody } from '../middlewares/validate-body';
import { CreateProductDto } from '../dto/product.dto';
import {
  createProduct,
  getProductsByFilters,
} from '../controllers/products.controller';

const productsRouter = Router();

productsRouter.post('/products', validateBody(CreateProductDto), createProduct);
productsRouter.get('/products', getProductsByFilters);

export { productsRouter };
