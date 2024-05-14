import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CONNECTION_POOL } from './database.module-definition';

@Injectable()
class DatabaseService {
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown[]) {
    return this.pool.query(query, params);
  }
  // async test() {
  //   return this.pool.find();
  //   return "222222222222";
  // }
}

export default DatabaseService;
