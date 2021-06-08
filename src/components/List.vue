<template>
  <div>
    <div class="project-header">
      <el-row>
        <el-col :span="7"></el-col>
        <el-col :span="7">
          <el-input
            v-model="listQuery.userName"
            placeholder="请输入用户名搜索"
            size="medium"
            class="project-input"
            clearable
            @keyup.enter="searchFn"
          >
          </el-input>
        </el-col>
        <el-button type="primary" size="medium" @click="searchFn">查 询</el-button>
        <el-button type="primary" size="medium" @click="addData">新 建</el-button>
      </el-row>
    </div>
    <el-table v-loading="loading" :data="tableList" align="center" class="table-box">
      <el-table-column align="center" label="用户名" prop="userName"> </el-table-column>
      <el-table-column align="center" label="英文名" prop="englishName"> </el-table-column>
      <el-table-column align="center" label="简称" prop="shortName"> </el-table-column>
      <el-table-column align="center" label="描述" prop="userDesc"> </el-table-column>
      <el-table-column align="center" label="年龄" prop="userAge"> </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="text" icon="el-icon-remove" @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-footer-box">
      <el-pagination
        class="text-right"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      v-model="visible"
      width="500px"
      :title="status ? '修改' : '新增'"
      @close="handleCloseDialog"
    >
      <el-form
        ref="ruleForm"
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="120px"
        style="padding: 0 20px"
      >
        <el-form-item :title="'用户名'" :label="'用户名'" prop="userName">
          <el-input v-model="formData.userName" :placeholder="'请输入用户名'"></el-input>
        </el-form-item>
        <el-form-item :title="'用户ID'" :label="'用户ID'" prop="id">
          <el-input v-model="formData.id" :placeholder="'请输入用户ID'"></el-input>
        </el-form-item>
        <el-form-item :title="'英文名称'" :label="'英文名称'" prop="englishName">
          <el-input v-model="formData.englishName" :placeholder="'英文名称'"></el-input>
        </el-form-item>
        <el-form-item :title="'简称'" :label="'简称'" prop="shortName">
          <el-input v-model="formData.shortName" :placeholder="'简称'"></el-input>
        </el-form-item>
        <el-form-item :title="'描述'" :label="'描述'" prop="userDesc">
          <el-input v-model="formData.userDesc" :placeholder="'描述'"></el-input>
        </el-form-item>
        <el-form-item :title="'年龄'" :label="'年龄'" prop="userAge">
          <el-input v-model="formData.userAge" :placeholder="'请输入年龄'"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="handleCloseDialog">取 消</el-button>
          <el-button type="primary" size="mini" @click="submitDialog">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { getList, deleteItem, addItem, updateItem } from '../api/list';
import { defineComponent, onMounted, ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { ListQuery, TableList, DataList } from '../typings';

export default defineComponent({
  name: 'userlist',
  props: {
    msg: {
      required: true,
      default: () => [],
      type: String,
    },
  },
  setup(props) {
    const status = ref(false);
    const formData = reactive<TableList>({
      id: '',
      userName: '',
      englishName: '',
      shortName: '',
      userDesc: '',
      userAge: 18,
    });
    const visible = ref(false);
    const ruleForm = ref<any>(null);
    const rules = {
      id: [{ required: true, message: '请输入商品id', trigger: 'blur' }],
      userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      englishName: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
      shortName: [{ required: true, message: '请输入简称', trigger: 'blur' }],
      userDesc: [{ required: true, message: '请输入用户描述', trigger: 'blur' }],
      userAge: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    };
    const addData = () => {
      visible.value = true;
      status.value = false;
      formData.id = '';
      formData.userName = '';
      formData.englishName = '';
      formData.shortName = '';
      formData.userDesc = '';
      formData.userAge = 18;
    };
    const handleEdit = (row: TableList) => {
      visible.value = true;
      status.value = true;
      formData.id = row.id;
      formData.userName = row.userName;
      formData.englishName = row.englishName;
      formData.shortName = row.shortName;
      formData.userDesc = row.userDesc;
      formData.userAge = row.userAge;
    };
    const handleCloseDialog = () => {
      formData.id = '';
      formData.userName = '';
      formData.englishName = '';
      formData.shortName = '';
      formData.userDesc = '';
      formData.userAge = 18;
      ruleForm.value.resetFields();
      visible.value = false;
    };
    const currentPage = ref<number>(1);
    const loading = ref<boolean>(false);
    const total = ref<number>(1);
    const tableList = ref<TableList[]>([
      {
        id: '',
        userName: '',
        englishName: '',
        shortName: '',
        userDesc: '',
        userAge: 18,
      },
    ]);
    const listQuery = reactive<ListQuery>({
      pageNo: 1, // 当前页码
      pageSize: 10, // 单页显示数量
      userName: '', // 项目名称
    });
    const getDataList = () => {
      getList<DataList<TableList>>(listQuery)
        .then((res) => {
          tableList.value = res.data.list;
          total.value = res.data.totalCount;
        })
        .finally(() => {
          loading.value = false;
        });
    };
    const handleDelete = (val: string) => {
      deleteItem<DataList<TableList>>({ id: val }).then(() => {
        ElMessage.success({
          message: '删除成功',
          type: 'success',
        });
        getDataList();
      });
    };
    const handleAdd = (val: TableList) => {
      addItem<DataList<TableList>>(val).then(() => {
        ElMessage.success({
          message: '添加成功',
          type: 'success',
        });
        getDataList();
      });
    };
    const updateData = (val: TableList) => {
      updateItem<DataList<TableList>>(val).then(() => {
        ElMessage.success({
          message: '修改成功',
          type: 'success',
        });
        getDataList();
      });
    };
    // 提交表单
    const submitDialog = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (!valid) return false;
        if (status.value) {
          visible.value = false;
          updateData(formData);
        } else {
          visible.value = false;
          handleAdd(formData);
        }
      });
    };
    onMounted(() => {
      loading.value = true;
      getDataList();
    });
    const searchFn = () => {
      getDataList();
    };
    const handleCurrentChange = (val: number) => {
      listQuery.pageNo = val;
      getDataList();
    };

    return {
      status,
      visible,
      ruleForm,
      currentPage,
      getList,
      rules,
      tableList,
      formData,
      listQuery,
      getDataList,
      handleCurrentChange,
      searchFn,
      loading,
      total,
      handleDelete,
      handleEdit,
      handleCloseDialog,
      submitDialog,
      addData,
    };
  },
});
</script>
<style scoped>
.table-box {
  height: 640px;
  overflow: auto;
}
.page-footer-box {
  text-align: right;
  margin-top: 15px;
}
</style>
