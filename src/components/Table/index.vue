<template>
  <!-- <div class="app-container"> -->
  <div>
    {{ $attrs }}
    <!-- 头部筛选区域 -->
    <div ref="table-filter" class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入标题"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.importance"
        placeholder="重要性"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <!-- v-waves -->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>

      <!-- v-waves -->
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        style="margin-left:15px;"
        @change="tableKey=tableKey+1"
      >评论</el-checkbox>
    </div>
    <!-- 表格组件主体 -->
    <!-- <el-table
      v-loading="listLoading"
      ref="table"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    > -->
    <el-table
      ref="table"
      :key="tableKey"
      :data="data"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-table-column v-for="(item) in $attrs.tableColumn" :key="item.prop" v-bind="item" />

      <!-- <el-table-column
        v-bind="$attrs.tableColumn"
      >
        <template slot-scope="scope">
          <slot name="row-tag">
            <el-tag type="danger" size="mini">{{ scope.row.columnName }}</el-tag>
          </slot>
          <span
            class="link-type"
            @click="handleUpdate(scope.row)"
          >{{ scope.row.title }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column
        label="Id"
        prop="articleId"
        sortable="custom"
        align="center"
        width="65"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.articleId }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="标题"
        min-width="150px"
      >
        <template slot-scope="scope">
          <slot name="row-tag">
            <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
            <el-tag type="danger" size="mini">{{ scope.row.columnName }}</el-tag>
          </slot>
          <span
            class="link-type"
            @click="handleUpdate(scope.row)"
          >{{ scope.row.title }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="时间"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.timestamp }}
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="作者"
        width="110px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        v-if="showReviewer"
        label="评论人"
        width="110px"
        align="center"
      >
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="重要性"
        width="80px"
      >
        <template slot-scope="scope">
          <svg-icon
            v-for="n in +scope.row.importance"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="阅读数"
        align="center"
        width="95"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.pageviews"
            class="link-type"
            @click="handleFetchPv(scope.row.pageviews)"
          >{{ scope.row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        label="状态"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <slot name="otherButtons">
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.status!='published'"
              size="mini"
              type="success"
              @click="handleModifyStatus(scope.row,'published')"
            >发布
            </el-button>
            <el-button
              v-if="scope.row.status!='draft'"
              size="mini"
              @click="handleModifyStatus(scope.row,'draft')"
            >草稿
            </el-button>
            <el-button
              v-if="scope.row.status!='deleted'"
              size="mini"
              type="danger"
              @click="handleModifyStatus(scope.row,'deleted')"
            >删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件区域 -->
    <slot name="pagination">
      <pagination v-show="$attrs.total>0" :total="$attrs.total" :page.sync="$attrs.page" :limit.sync="$attrs.rows" @pagination="$listeners.pagination" />
    </slot>

    <!-- dialog组件区域 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <slot ref="dataForm" name="dialog-form">
        <h2>根据页面不同，预留表单插槽入口</h2>
      </slot>
      <!-- <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { fetchArticleList, fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
// import waves from '@/directive/waves' // Waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'ComplexTable',
  components: { Pagination },
  // directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
    // total: {
    //   type: Number,
    //   default: 0
    // },
    // page: {
    //   type: Number,
    //   default: 1
    // },
    // rows: {
    //   type: Number,
    //   default: 10
    // }
  },
  data() {
    return {
      // queryStr: {
      //   jsonParam: {
      //     auditStatus: '',
      //     belongStoreType: '',
      //     columnId: '20180305150041A5A8EDD6A7CE6693C7',
      //     groupList: [
      //       {
      //         delFlag: '0',
      //         groupId: '2017112318014618A8DD688BF05FDBE1',
      //         groupLeave: '9',
      //         groupName: 'A发布组',
      //         roleId: '2017112318014618A8DD688BF05FDBE8',
      //         userId: '201711011423461CBD8C56D60A7D868D'
      //       }
      //     ],
      //     loginName: 'admin',
      //     pushFlag: '',
      //     searchText: '',
      //     userId: '201711011423461CBD8C56D60A7D868D'
      //   },
      //   page: 1,
      //   rows: 10
      // },

      tableKey: 0,
      list: null,
      // total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    // this.getList()
    this.$listeners.handleFetchTableData();
    console.log('fetchTableData', this);
  },
  methods: {
    fetchTableData() {
      // this.$emit('handleFetchTableData', item);
      // this.$listeners.handleFetchTableData();
      // this.listLoading = true
      // fetchArticleList(this.queryStr).then(response => {
      //   const { sendData, count } = response.data
      //   // console.log('fetchArticleList======', response, sendData)
      //   const { articleList, permissionList } = sendData
      //   this.list = articleList
      //   this.total = count
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      console.log('下载表格')
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
      //   const data = this.formatJson(filterVal, this.list)
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: 'table-list'
      //   })
      //   this.downloadLoading = false
      // })
    }
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // }
  }
}
</script>
<style lang="scss" scoped>
.link-type, .link-type:focus {
  color: #337ab7;
  cursor: pointer;
  &:hover {
    color: #20a0ff;
  }
}

.filter-container {
  padding-bottom: 10px;
}
.el-button+.el-button {
  margin-left: 0
}
.el-button--mini, .el-button--mini.is-round {
  padding: 2px 4px;
}
</style>
