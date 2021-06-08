import request from '../utils/request';
import { ListQuery, IdQuery, TableList } from '../typings';

export function getList<T>(params: ListQuery): Promise<T> {
  return request.get<T, T>(
    `/getList?pageNo=${params.pageNo}&pageSize=${params.pageSize}&userName=${params.userName}`,
  );
}
export function deleteItem<T>(params: IdQuery): Promise<T> {
  return request.get<T, T>(`/deleteProject?id=${params.id}`);
}
export function addItem<T>(params: TableList): Promise<T> {
  return request.put<T, T>('/addProject', params);
}
export function updateItem<T>(params: TableList): Promise<T> {
  return request.post<T, T>('/updateProject', params);
}
