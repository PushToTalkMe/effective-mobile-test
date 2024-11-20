export interface ProductActionMessage {
  product_id: number;
  product_plu: string;
  product_name: string;
  action: string;
}

export interface ShopActionMessage {
  shop_id: number;
  shop_name: string;
  action: string;
}

export interface InventoryActionMessage {
  shop_id: number;
  product_id: number;
  product_plu: string;
  inventory_id: number;
  stock_quantity: number;
  order_quantity: number;
  action: string;
}
