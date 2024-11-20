import { ActionLogs } from '../entities/action-logs.entity.js';
import { AppDataSource } from '../config/db.js';

export async function getActionLogsByFilters(req, res) {
  const {
    shop_id,
    product_plu,
    action,
    date_from,
    date_to,
    page = 1,
    limit = 10,
  } = req.query;

  const offset = (page - 1) * limit;

  let query =
    AppDataSource.getRepository(ActionLogs).createQueryBuilder('action_logs');

  if (product_plu) {
    query.andWhere('action_logs.product_plu LIKE :product_plu', {
      product_plu: `%${product_plu}%`,
    });
  }
  if (action) {
    query.andWhere('action_logs.action LIKE :action', {
      action: `%${action}%`,
    });
  }
  if (shop_id) {
    query.andWhere('action_logs.shop_id = :shop_id', { shop_id });
  }
  if (date_from) {
    query.andWhere('action_logs.created_at >= :date_from', { date_from });
  }
  if (date_to) {
    query.andWhere('action_logs.created_at <= :date_to', { date_to });
  }

  query.skip(offset).take(limit);

  try {
    const [actionLogs, total] = await query.getManyAndCount();
    res.status(200).json({ data: actionLogs, total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
