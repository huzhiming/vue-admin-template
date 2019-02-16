<template>
  <div class="app-container">
    <!-- height="100%" -->
    <Table
      :tableColumn="tableColumn"
      :data="tableData"
      :stripe="!true"
      :border="!true"
      :row-class-name="tableRowClassName"
      highlight-current-row
    >
      <!-- <template slot="select" slot-scope="scope">
        kkkkkkkk{{scope}}
      </template> -->
      <template
        slot="table-column"
        slot-scope="scope"
      >
        dddd {{ scope }}
      </template>
      <!-- <template slot="otherButtons">
        sss
      </template> -->
    </Table>
  </div>
</template>
<script>
import { getList, getBaseList } from '@/api/table'
import { Table } from '@/components'

const tableColumn = [
  { type: 'index', prop: '', label: '#', width: '40', sortable: true },
  { prop: 'id', label: '数据库id', width: '180' },
  { prop: 'title', label: '标题', width: '180' },
  { prop: 'display_time', label: '日期', width: '180' }
]

export default {
  components: {
    Table
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      tableData: null,
      tableColumn
    }
  },
  created() {
    console.log(this)
    this.fetchData()
  },
  methods: {
    fetchData() {
      // this.listLoading = true
      getList({
        jsonParam: {
          columnName: ''
        },
        page: 1,
        rows: 10
      }).then(response => {
        this.tableData = response.data.items
        console.log(this.list)
        // this.listLoading = false
      })
    },
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
