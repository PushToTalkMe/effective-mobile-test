import { Router } from 'express';
import { validateBody } from '../middlewares/validate-body';
import { CreateShopDto } from '../dto/shop.dto';
import { createShop } from '../controllers/shops.controller';

const shopsRouter = Router();

shopsRouter.post('/shops', validateBody(CreateShopDto), createShop);

export { shopsRouter };
