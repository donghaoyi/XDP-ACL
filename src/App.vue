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
      :sortConfig="{ trigger: 'cell', orders: ['asc', 'desc', 'null'] }"
    >
      <ux-table-column
        field="priority"
        title="优先级"
        :sortable="true"
        align="center"
        width="80px"
      >
      </ux-table-column>
      <ux-table-column
        field="strategy"
        title="策略"
        width="60px"
        align="center"
      ></ux-table-column>
      <ux-table-column
        field="protos"
        title="协议类型"
        align="center"
      ></ux-table-column>
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
            <div slot="content">
              生效：{{ src_item.net_no }}/{{ src_item.mask }}
            </div>
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
              scope.row.port_src_arr.length > 0 &&
              Array.isArray(scope.row.port_src_arr)
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
            <div slot="content">
              生效：{{ dst_item.net_no }}/{{ dst_item.mask }}
            </div>
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
              scope.row.port_dst_arr.length > 0 &&
              Array.isArray(scope.row.port_dst_arr)
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

      <ux-table-column
        field="hitcount"
        title="命中次数"
        sortable
        align="center"
      >
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
          <el-button
            type="text"
            size="mini"
            @click="handleDelete(scope)"
            :disabled="
              scope.row.can_not_del != undefined && scope.row.can_not_del == 1
                ? true
                : false
            "
            >删除</el-button
          >
        </template>
      </ux-table-column>
    </ux-grid>
    <addForm
      @formSubmit="formSubmit"
      :dialog-form-visible="dialogFormVisible"
      :table-data="tableData.rules_arr"
      @formCancel="formCancel"
      v-if="dialogFormVisible"
    ></addForm>
    <div class="Dialogdeleta">
      <el-dialog
        title="提示"
        width="420px"
        v-if="dialogDeletaRule"
        :visible.sync="dialogDeletaRule"
      >
        <p>确定要删除优先级为 {{ deleteRuleObj.row.priority }} 的规则吗？</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deleteCancel" size="mini" plain>取 消</el-button>
          <el-button
            type="primary"
            @click="deleteRule()"
            size="mini"
            style="margin-left: 25px"
            plain
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
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
      tableData: {
        rules_arr: [],
        hitcount_arr: [],
      },
      dialogFormVisible: false,
      isFirstLoad: true,
      dialogDeletaRule: false,
      deleteRuleObj: {},
    };
  },
  mounted() {
    this.height = 600; // 动态设置高度
    this.getRules();
  },
  components: {
    addForm,
  },
  watch: {
    "tableData.rules_arr"() {
      this.$refs.rulesTable.reloadData(this.tableData.rules_arr);
    },
  },
  methods: {
    getRules() {
      instanceAxios
        .get("/xdp-acl/IPv4/rules")
        .then((result) => {
          if (result.status === 200) {
            this.$set(this.tableData, "rules_arr", result.data);
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
            this.mergeRulesHits();
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
    handleDelete(scope) {
      this.dialogDeletaRule = true;
      this.deleteRuleObj = scope;
    },
    deleteRule() {
      let priority = this.deleteRuleObj.row.priority;
      let rule_index = this.deleteRuleObj.rowIndex;
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
            this.tableData.rules_arr.splice(rule_index, 1);
            this.dialogDeletaRule = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    formSubmit(data) {
      this.tableData.rules_arr.unshift(this.tableDataFormat(data));
      this.dialogFormVisible = false;
      this.$notify({
        title: "提示",
        message: `添加优先级： ${data.priority} 规则成功`,
        type: "success",
        duration: 2000,
      });
    },
    formCancel() {
      this.dialogFormVisible = false;
    },
    deleteCancel() {
      this.dialogDeletaRule = false;
    },
    tableDataFormat(data) {
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
      let onlyContainICMP =
        protos_arr.includes("ICMP") && protos_arr.length == 1;
      // 源端口拼接,使用空格分割
      x.port_src_arr = this.portFilter(x.port_src_arr, onlyContainICMP);
      // 需要注意，当端口为空时，为all
      x.port_dst_arr = this.portFilter(x.port_dst_arr, onlyContainICMP);
      // 创建时间
      x.create_time = that.format(
        new Date(x.create_time),
        "yyyy-MM-dd hh:mm:ss"
      );
      return x;
    },

    mergeRulesHits() {
      let hit_count_obj = {};
      for (
        let hits_arr_index = 0;
        hits_arr_index < this.hitcount_arr.length;
        hits_arr_index++
      ) {
        hit_count_obj[
          this.hitcount_arr[hits_arr_index].priority
        ] = this.hitcount_arr[hits_arr_index];
      }
      for (
        let rules_arr_index = 0;
        rules_arr_index < this.tableData.rules_arr.length;
        rules_arr_index++
      ) {
        if (hit_count_obj[this.tableData.rules_arr[rules_arr_index].priority] == undefined) {
          continue;
        }
        this.$set(
          this.tableData.rules_arr[rules_arr_index],
          "hitcount",
          BigInt(
            hit_count_obj[this.tableData.rules_arr[rules_arr_index].priority]
              .hit_count
          )
        );
      }
      if (this.isFirstLoad) {
        this.tableData.rules_arr.map((x) => {
          this.tableDataFormat(x);
        });
        this.isFirstLoad = false;
      }
    },
    // 通过策略来控制端口的显示格式
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
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
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
.el-message-box {
  padding-bottom: 20px !important;
}
.el-message-box__btns > button {
  padding: 7px 15px;
}
.el-dialog > .el-dialog__body {
  padding: 10px 20px;
}
.el-dialog > .el-dialog__body > p {
  margin: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
