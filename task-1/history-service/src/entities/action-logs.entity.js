import { EntitySchema } from 'typeorm';

export const ActionLogs = new EntitySchema({
  name: 'ActionLogs',
  tableName: 'action_logs',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    product_id: {
      type: 'int',
      nullable: true,
    },
    shop_id: {
      type: 'int',
      nullable: true,
    },
    inventory_id: {
      type: 'int',
      nullable: true,
    },
    product_plu: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    product_name: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    shop_name: {
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    stock_quantity: {
      type: 'int',
      nullable: true,
    },
    order_quantity: {
      type: 'int',
      nullable: true,
    },
    action: {
      type: 'varchar',
      length: 50,
    },
    created_at: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
});
