<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "psysWeb"
};
</script>

<style>
/* 全局配置 */
* {
  padding: 0;
  margin: 0;
  font-family: Arial, "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu;
}
/* table全局样式 */
.el-table td, .el-table th{
  padding: 0 !important;
}
.el-table .cell{
  line-height: 40px !important;
}
.el-table th > .cell{
      line-height: 40px !important;
}
.el-table{
      height: 625px;
}
.el-table__body-wrapper{
      height: 580px;
}
/* table全局样式 */
.el-table__body tr.current-row>td:first-of-type{
  border-left: 1px solid;
border-left-color: #338CE8 !important;

}
.el-table__body tr.current-row>td:last-child{
  border-right: 1px solid;
border-right-color:#338CE8  !important;
}
.el-table__body tr.current-row>td{
  border-top: 1px solid transparent; 
  border-bottom: 1px solid transparent; 
  border-bottom-color: #338CE8 !important;
  border-top-color: #338CE8 !important;
  background-color: #f5f7fa !important;
  color: #303133 !important;
}

.el-form-item--mini.el-form-item {
  margin-bottom: 0 !important;
}
/* table滑动 */
.el-table__body-wrapper{
    max-height: 600px !important;
    overflow-y: auto !important;
}
.el-table__fixed, .el-table__fixed-right{
      height: 100% !important;
      min-height: 100% !important;
}
/* 全局修改table里面的按钮颜色 */
.el-table .el-button--mini {
  color: #606266 !important;
}
/* 抽屉header选中 */
:focus {
  outline: 0;
}
/* 图标样式更改 */
.iconfont {
  padding-right: 5px;
}
/* 去掉抽屉的关闭按钮 */
.el-drawer__header .el-icon-close:before {
  content: "" !important;
}
/* 表格滑动 */
.el-table__body {
  overflow-y: auto;
}
/* 透明度抽屉 */
/* .el-drawer.ltr,
.el-drawer.rtl,
.el-drawer__container {
  opacity: 0.94;
} */
/* 抽屉的底部样式 */
.demo-drawer__footer {
  text-align: right;
  padding-right: 1rem;
  border-top: 1px solid #c8cfde;
  background-color: #f5f7fa;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 50px;
}
.box .v-modal {
  z-index: 200 !important;
  display: none !important;
  width: 50% !important;
}
[v-cloak] {
  display: none;
}
</style>
