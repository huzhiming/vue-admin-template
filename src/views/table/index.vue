<template>
  <div class="app-container">
    <Table
      key="0"
      :tableColumn="tableColumn"
      :data="tableData"
      :total="total"
      :page="queryStr.page"
      :rows="queryStr.rows"

      :v-loading="listLoading"
      :row-class-name="tableRowClassName"
      stripe
      border
      fit
      highlight-current-row
      @handleFetchTableData="fetchTableData"
      @pagination="handlePageChange"
    >

      <!-- <template slot="select" slot-scope="scope">
        kkkkkkkk{{scope}}
      </template> -->
      <template slot="table-column">
        dddd
      </template>
      <!-- <template slot="otherButtons">
        sss
      </template> -->
    </Table>
  </div>
</template>
<script>
import { fetchArticleList, fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { Table } from '@/components'

const tableColumn = [
  { type: 'index', prop: '', label: '#', width: '40', sortable: true },
  { prop: 'articleId', label: '数据库id', width: '180' },
  { prop: 'title', label: '标题', width: '180' },
  { prop: 'auditorName', label: '发布人', width: '180' }
]

export default {
  components: {
    Table
  },
  data() {
    return {
      tableColumn,
      listLoading: true,
      tableData: null,
      total: 0,

      queryStr: {
        jsonParam: {
          auditStatus: '',
          belongStoreType: '',
          columnId: '20180305150041A5A8EDD6A7CE6693C7',
          groupList: [
            {
              delFlag: '0',
              groupId: '2017112318014618A8DD688BF05FDBE1',
              groupLeave: '9',
              groupName: 'A发布组',
              roleId: '2017112318014618A8DD688BF05FDBE8',
              userId: '201711011423461CBD8C56D60A7D868D'
            }
          ],
          loginName: 'admin',
          pushFlag: '',
          searchText: '',
          userId: '201711011423461CBD8C56D60A7D868D'
        },
        page: 1,
        rows: 10
      }

    }
  },
  created() {},
  methods: {
    /**
     *@ description: 初始化获取表格数据，
     *@ author: huzhiming
     *@ date: 2019-02-19 00:14:31
     *@ variable1: 变量1
    */
    fetchTableData() {
      this.listLoading = true
      fetchArticleList(this.queryStr).then(response => {
        const { sendData, count } = response.data
        const { articleList, permissionList } = sendData
        this.tableData = articleList
        this.total = count
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    /**
     *@ description: 表格组件页码切换
     *@ author: huzhiming
     *@ date: 2019-02-19 00:11:43
     *@ variable1: page 当前表格页码
     *@ variable2: limit 一页行数
    */
    handlePageChange({ page, limit }) {
      this.queryStr.page = page
      this.queryStr.rows = limit
      this.fetchTableData({ page, limit });
    },

    /**
     *@ description: 自定义表格行样式
     *@ author: huzhiming
     *@ date: 2019-02-19 00:15:53
     *@ variable1: 当前行信息
     *@ variable2: 当前行索引
    */
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
