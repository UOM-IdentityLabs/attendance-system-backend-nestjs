import { DeleteResult } from 'typeorm';

export interface IRepository<T, D, B, C> {
  create(createDto: D, req?: any): Promise<T | T[]>;
  getAll(query: B, req?: any);
  getById(id: number | string, query: B): Promise<T>;
  update(id: number | string, updateDto: C): Promise<T>;
  delete(id: number | string): Promise<DeleteResult>;
}
