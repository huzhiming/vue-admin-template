<template>
  <div>
    <slot :item="$attrs.data" name="select" />

    <el-table
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-table-column v-for="(item) in $attrs.tableColumn" :key="item.prop" v-bind="item" />
      <!-- <el-table-column
        label="日期"
        width="180"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      -->
      <el-table-column label="操作">
        <template slot-scope="scope">

          <slot name="otherButtons">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  inheritAttrs: false,
  mounted() {
    console.log(this.$attrs)
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>
