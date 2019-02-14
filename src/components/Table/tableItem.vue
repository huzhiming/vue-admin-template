<template>
  <!-- <el-table-column
    v-for="item in $attrs.tableColumn" :key="item.id"
    prop="display_time"
    label="日期"
    width="180">
  </el-table-column> -->
  <el-table-column
    v-bind="$attrs"
    prop="display_time"
    label="日期"
    width="180">
  </el-table-column>
</template>
