<template>
  <div id="app">
    <!-- 一个button按钮 -->
    <el-button
      class="addButton"
      type="primary"
      size="small"
      plain
      @click="dialogFormVisible = true"
      >添加规则</el-button
    >
    <ux-grid
      ref="rulesTable"
      row-class-name="tableRowClassName"
      cell-class-name="tablCellClassName"
      size="small"
      style="font-size: 12px"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      :fit="true"
      stripe
      :height="height"
      :border="false"
    >
      <ux-table-column
        field="priority"
        title="编号"
        sortable
        align="center"
        width="80px"
      ></ux-table-column>
      <ux-table-column
        field="strategy"
        title="策略"
        width="60px"
        align="center"
      ></ux-table-column>
      <ux-table-column field="protos" title="协议类型" align="center"></ux-table-column>
      <ux-table-column
        field="addr_src.ip_mask"
        title="源 IP"
        :show-overflow-tooltip="false"
        width="140px"
        align="center"
      >
        <!-- 悬浮提示 -->
        <template slot-scope="scope">
          <el-tooltip
            placement="top-start"
            effect="light"
            v-for="(src_item, src_index) in scope.row.addr_src_arr"
            :key="src_index"
          >
            <div slot="content">生效：{{ src_item.net_no }}/{{ src_item.mask }}</div>
            <p style="cursor: pointer" class="dst_text">
              {{ src_item.ip_user }}/{{ src_item.mask }}
            </p>
          </el-tooltip>
        </template>

        <!-- end -->
      </ux-table-column>
      <ux-table-column field="port_src_arr" title="源端口" align="center">
        <template slot-scope="scope">
          <div
            class="port-view"
            v-if="
              scope.row.port_src_arr.length > 0 && Array.isArray(scope.row.port_src_arr)
            "
          >
            <span
              v-for="(item, index) in scope.row.port_src_arr"
              :key="index"
              class="port-span"
              >{{ item }}&nbsp;</span
            >
          </div>
          <div v-else>{{ scope.row.port_src_arr }}</div>
        </template>
      </ux-table-column>
      <ux-table-column
        title="目的 IP"
        width="140px"
        align="center"
        :show-overflow-tooltip="false"
      >
        <template slot-scope="scope">
          <el-tooltip
            placement="top-start"
            effect="light"
            v-for="(dst_item, dst_index) in scope.row.addr_dst_arr"
            :key="dst_index"
          >
            <div slot="content">生效：{{ dst_item.net_no }}/{{ dst_item.mask }}</div>
            <p style="cursor: pointer" class="dst_text">
              {{ dst_item.ip_user }}/{{ dst_item.mask }}
            </p>
          </el-tooltip>
        </template>
      </ux-table-column>
      <ux-table-column field="port_dst_arr" title="目的端口" align="center">
        <template slot-scope="scope">
          <div
            class="port-view"
            v-if="
              scope.row.port_dst_arr.length > 0 && Array.isArray(scope.row.port_dst_arr)
            "
          >
            <span
              v-for="(item, index) in scope.row.port_dst_arr"
              :key="index"
              class="port-span"
              >{{ item }}
            </span>
          </div>
          <div v-else>{{ scope.row.port_dst_arr }}</div>
        </template>
      </ux-table-column>

      <ux-table-column field="hitcount" title="命中次数" sortable align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hitcount }}</span>
        </template>
      </ux-table-column>

      <ux-table-column
        field="create_time"
        title="创建时间"
        width="160px"
        sortable
        align="center"
      ></ux-table-column>
      <ux-table-column field="" title="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelete(scope)"
            >删除</el-button
          >
        </template>
      </ux-table-column>
    </ux-grid>
    <addForm
      @formSubmit="formSubmit"
      :dialog-form-visible="dialogFormVisible"
      :table-data="tableData"
      @formCancel="formCancel"
      v-if="dialogFormVisible"
    ></addForm>
  </div>
</template>

<script>
import instanceAxios from "./api/axios-init";
import baseData from "./api/helpers";
import addForm from "./components/addForm";
import axios from "axios";
export default {
  name: "acl",
  data() {
    return {
      height: 0,
      hitcount_arr: [],
      dialogFormVisible: false,
      isFirstLoad: true,
    };
  },
  mounted() {
    this.height = 600; // 动态设置高度
    this.getTableData();
  },
  components: {
    addForm,
  },
  watch: {
    hitcount_arr() {},
  },
  methods: {
    getTableData() {
      instanceAxios
        .get("/xdp-acl/IPv4/rules")
        .then((result) => {
          if (result.status === 200) {
            this.tableData = result.data;
            // this.$set(this, "tableData", result.data);
            this.getHitcount();
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    getHitcount() {
      axios
        .get(baseData.URL + "/xdp-acl/IPv4/rules/hitcount")
        .then((result) => {
          if (result.status === 200) {
            this.hitcount_arr = result.data;
            let hit_count_obj = {};
            for (let i = 0; i < this.hitcount_arr.length; i++) {
              hit_count_obj[this.hitcount_arr[i].priority] = this.hitcount_arr[i];
            }
            for (let i = 0; i < this.tableData.length; i++) {
              this.tableData[i].hitcount = BigInt(
                hit_count_obj[this.tableData[i].priority].hit_count
              );
            }
            if (this.isFirstLoad) {
              this.tableDataDispose();
            }
          }
          setTimeout(() => {
            this.getHitcount();
          }, baseData.timeInterval);
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            this.getHitcount();
          }, baseData.timeInterval);
        });
    },
    // 时间格式化
    format(data, fmt) {
      let newDate = new Date(data);
      var o = {
        "M+": newDate.getMonth() + 1, //月份
        "d+": newDate.getDate(), //日
        "h+": newDate.getHours(), //小时
        "m+": newDate.getMinutes(), //分
        "s+": newDate.getSeconds(), //秒
        "q+": Math.floor((newDate.getMonth() + 3) / 3), //季度
        S: newDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (newDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },
    handleDelete(scope) {
      let priority = scope.row.priority;
      let rule_index = scope.rowIndex;
      console.log("deleteStart:", this.tableData.length);

      this.$set(this, "tableData", this.tableData.splice(rule_index, 1));
      this.$forceUpdate();
      console.log("deleteEnd:", this.tableData.length, this.tableData);

      this.$confirm(`确定要删除编号为 ${priority} 的规则吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (action) => {
          if (action === "confirm") {
            instanceAxios
              .delete("/xdp-acl/IPv4/rule" + `?priority=${priority}`)
              .then((res) => {
                if (res.status === 200) {
                  this.$notify({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                    duration: 3000,
                  });

                  // for (var i = 0; i < this.tableData.length; i++) {
                  //   if (this.tableData[i].priority == row.priority) {
                  //     break;
                  //   }
                  // }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
      });
    },
    formSubmit(data) {
      this.tableData.unshift(data);
      this.dialogFormVisible = false;
      this.$notify({
        title: "提示",
        message: `添加编号： ${data.priority} 规则成功`,
        type: "success",
        duration: 2000,
      });
      this.tableDataDispose(false);
    },
    formCancel() {
      this.dialogFormVisible = false;
    },

    tableDataDispose() {
      const that = this;
      if (this.isFirstLoad) {
        this.tableData.map((item) => {
          that.dataSet(item);
        });
        this.isFirstLoad = false;
      } else {
        that.dataSet(this.tableData[0]);
      }
      this.$refs.rulesTable.reloadData(this.tableData);
    },
    dataSet(data) {
      const that = this;
      let x = data;
      // 策略重新赋值：1 拒绝，2允许
      x.strategy = x.strategy == 1 ? "拒绝" : "允许";
      // 协议类型判断：未实现
      let protos_arr = [];
      if ((x.protos & 0x01) > 0) {
        protos_arr.push("TCP");
      }
      if (((x.protos >> 1) & 0x01) > 0) {
        protos_arr.push("UDP");
      }
      if (((x.protos >> 2) & 0x01) > 0) {
        protos_arr.push("ICMP");
      }

      x.protos = protos_arr.join(" ");
      let onlyContainICMP = protos_arr.includes("ICMP") && protos_arr.length == 1;
      // 源ip+端口拼接
      // let addr_src = x.addr_src;
      // x.addr_src.ip_mask = addr_src.ip_user + "/" + addr_src.mask;
      // 源端口拼接,使用空格分割
      x.port_src_arr = this.portFilter(x.port_src_arr, onlyContainICMP);
      // 目的IP拼接
      // let addr_dst = x.addr_dst;
      // x.addr_dst.ip_mask = addr_dst.ip_user + "/" + addr_dst.mask;
      // 需要注意，当端口为空时，为all
      x.port_dst_arr = this.portFilter(x.port_dst_arr, onlyContainICMP);
      // 创建时间
      x.create_time = that.format(new Date(x.create_time), "yyyy-MM-dd hh:mm:ss");
      // return x;
    },
    portFilter(portArray, onlyContainICMP) {
      if (onlyContainICMP) {
        return "-";
      } else {
        if (!portArray.length) {
          return "ALL";
        } else {
          return portArray;
        }
      }
    },
  },
};
</script>

<style>
.addButton.el-button {
  margin-bottom: 24px;
  font-size: 13px;
}
.tablCellClassName.el-table td {
  padding: 10px 0;
}
.el-tag--plain.el-tag--info {
  margin-right: 5px;
}
.port-span {
  word-break: keep-all;
}
.port-view {
  white-space: pre-wrap;
}
.elx-cell.c--ellipsis {
  max-height: none !important;
}
.elx-table.size--small {
  font-size: 12px !important;
}
.dst_text {
  line-height: 10px;
}
.el-message-box__btns > button {
  padding: 7px 15px;
}
</style>
