export interface TableList {
  id: string;
  userName: string;
  englishName: string;
  shortName: string;
  userDesc: string;
  userAge: number;
}
export interface ListQuery {
  pageNo: number;
  pageSize: number;
  userName?: string;
}
export interface IdQuery {
  id: string;
}
export interface DataList<T> {
  code: string;
  msg: string;
  data: {
    list: T[];
    ageNo: string;
    pageSize: string;
    totalCount: number;
  };
}
