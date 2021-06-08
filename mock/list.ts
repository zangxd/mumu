// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mock = require('mockjs');
import { MockMethod } from 'vite-plugin-mock';
const count = 33;
const listNo = 10;
let getUserList = [];
for (let i = 0; i < count; i++) {
  getUserList.push(
    Mock.mock({
      id: '@id',
      'userName|1': ['木木', '林林', '森森'],
      'englishName|1': ['mumu', 'linlin', 'sensen'],
      'shortName|1': ['mm', 'll', 'ss'],
      'userDesc|1': ['木木啊', '林林啊', '森森啊'],
      'userAge|1': [18, 19, 20],
    }),
  );
}
export default [
  {
    url: '/getList',
    method: 'get',
    response: (config) => {
      const { pageNo, pageSize, userName } = config.query;
      let long = 0;
      let list = getUserList;
      if (userName) {
        list = getUserList.filter((item) => {
          const userNames = item.userName;
          if (userNames.includes(userName)) {
            return item;
          }
        });
      }
      long = list.length;
      list = list.slice((pageNo - 1) * listNo, pageSize * pageNo);
      return {
        code: 200,
        msg: '后端返回的提示信息！',
        data: {
          list,
          totalCount: long,
          pageNo: pageNo || 1,
          pageSize: pageSize || listNo,
        },
      };
    },
  },
  {
    url: '/addProject',
    method: 'put',
    response: (config) => {
      const list = config.body;
      return {
        code: 200,
        msg: 'success',
        data: {
          list,
          pageNo: 1,
          pageSize: listNo,
        },
      };
    },
  },
  {
    url: '/updateProject',
    method: 'post',
    response: (config) => {
      const list = config.body;
      return {
        code: 200,
        msg: 'success',
        data: {
          list,
          pageNo: 1,
          pageSize: listNo,
        },
      };
    },
  },
  {
    url: '/deleteProject',
    method: 'get',
    response: (config) => {
      const { id } = config.query;
      getUserList = getUserList.filter((item) => item.id !== id);
      const list = getUserList.slice(0, listNo);
      return {
        code: 200,
        msg: 'success',
        data: {
          list,
          pageNo: 1,
          pageSize: listNo,
        },
      };
    },
  },
] as MockMethod[];
