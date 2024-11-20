import { Router } from 'express';
import { validateBody } from '../middlewares/validate-body';
import { CreateInventoryDto, UpdateInventoryDto } from '../dto/inventory.dto';
import {
  createInventory,
  decreaseInventory,
  getInventoryByFilters,
  increaseInventory,
} from '../controllers/inventory.controller';

const inventoryRouter = Router();

inventoryRouter.post(
  '/inventory',
  validateBody(CreateInventoryDto),
  createInventory,
);
inventoryRouter.get('/inventory', getInventoryByFilters);
inventoryRouter.patch(
  '/inventory/increase',
  validateBody(UpdateInventoryDto),
  increaseInventory,
);
inventoryRouter.patch(
  '/inventory/decrease',
  validateBody(UpdateInventoryDto),
  decreaseInventory,
);

export { inventoryRouter };
