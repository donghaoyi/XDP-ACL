<template>
  <div class="addForm">
    <el-dialog
      title="添加规则"
      :visible.sync="dialogFormVisible"
      :before-close="formCancel"
      top="12vh"
      width="520px"
      :destroy-on-close="true"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        status-icon
        :inline="true"
        size="mini"
        id="form-view"
        :hide-required-asterisk="true"
      >
        <el-form-item
          label="优先级 :"
          prop="priority"
          type="number"
          :label-width="formLabelWidth"
          class="form-item-view form-item-little"
        >
          <el-input
            class="input-little"
            v-model="form.priority"
            @mousewheel.native.prevent
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="策略 :"
          label-width="50px"
          class="form-item-view form-item-little"
        >
          <el-select v-model.number="form.strategy" class="input-little">
            <el-option label="允许" :value="2"></el-option>
            <el-option label="拒绝" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="protos"
          label="协议类型 :"
          :label-width="formLabelWidth"
          class="form-item-view"
        >
          <el-select
            v-model="form.protos"
            multiple
            placeholder="请选择"
            clearable
            class="one-line-select"
          >
            <el-option
              v-for="item in czfas"
              :key="item.value"
              :label="item.wsdFamc"
              :value="item.id"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <div class="addr-ip-view">
          <el-form-item
            label="源 IP ："
            :label-width="formLabelWidth"
            prop="addr_src_arr"
            class="form-item-view addr-ip-item"
          >
            <template slot="label">
              <span style="">
                <el-tooltip
                  style=""
                  class="item"
                  effect="light"
                  placement="top"
                >
                  <div slot="content">
                    <p class="assist-text">• 0.0.0.0/0 表示所有 IP</p>
                    <p class="assist-text">• 多IP段需分行输入</p>
                  </div>
                  <span
                    >源 IP
                    <i
                      class="el-icon-warning-outline ico-pre"
                      style="font-size: 10px"
                    ></i
                  ></span>
                </el-tooltip>
              </span>
              :
            </template>
            <el-input
              class="addr-ip-item-textarea"
              type="textarea"
              v-model="form.addr_src_arr"
              autocomplete="off"
              placeholder="123.123.123.123/24
124.123.123.123/24"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="目的 IP："
            :label-width="formLabelWidth"
            prop="addr_dst_arr"
            class="form-item-view addr-ip-item"
          >
            <template slot="label">
              <span style="">
                <el-tooltip
                  style=""
                  class="item"
                  effect="light"
                  placement="top"
                >
                  <div slot="content">
                    <p class="assist-text">• 0.0.0.0/0 表示所有 IP</p>
                    <p class="assist-text">• 多IP段需分行输入</p>
                  </div>
                  <span
                    >目的 IP
                    <i
                      class="el-icon-warning-outline ico-pre"
                      style="font-size: 10px"
                    ></i
                  ></span>
                </el-tooltip>
              </span>
              :
            </template>
            <el-input
              class="addr-ip-item-textarea"
              type="textarea"
              v-model="form.addr_dst_arr"
              autocomplete="off"
              placeholder="123.123.123.123/24
124.123.123.123/24"
            ></el-input>
          </el-form-item>
        </div>
        <div class="addr-ip-view">
          <el-form-item
            label="源端口："
            :label-width="formLabelWidth"
            prop="port_src_arr"
            class="form-item-view addr-ip-item"
          >
            <template slot="label">
              <span style="">
                <el-tooltip
                  style=""
                  class="item"
                  effect="light"
                  placement="top"
                >
                  <div slot="content">
                    <p class="assist-text">• 端口范围 : 0~65535</p>
                    <p class="assist-text">• 多个端口用空格分割</p>
                    <p class="assist-text">• 空白不填表示所有端口</p>
                  </div>
                  <span
                    >源端口
                    <i
                      class="el-icon-warning-outline ico-pre"
                      style="font-size: 10px"
                    ></i
                  ></span>
                </el-tooltip>
              </span>
              :
            </template>
            <el-input
              class="addr-ip-item-textarea"
              v-model="form.port_src_arr"
              autocomplete="off"
              placeholder="1 60 80"
              :disabled="isICMP"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="目的端口："
            :label-width="formLabelWidth"
            prop="port_dst_arr"
            class="form-item-view addr-ip-item"
          >
            <template slot="label">
              <span style="">
                <el-tooltip
                  style=""
                  class="item"
                  effect="light"
                  placement="top"
                >
                  <div slot="content">
                    <p class="assist-text">• 端口范围 : 0~65535</p>
                    <p class="assist-text">• 多个端口用空格分割</p>
                    <p class="assist-text">• 空白不填表示所有端口</p>
                  </div>
                  <span
                    >目的端口
                    <i
                      class="el-icon-warning-outline ico-pre"
                      style="font-size: 10px"
                    ></i
                  ></span>
                </el-tooltip>
              </span>
              :
            </template>
            <el-input
              class="addr-ip-item-textarea"
              v-model="form.port_dst_arr"
              autocomplete="off"
              placeholder="1 60 80"
              :disabled="isICMP"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="margin-right: 55px; padding-top: 0"
      >
        <el-button @click="formCancel" size="mini" plain>取 消</el-button>
        <el-button
          type="primary"
          @click="formSubmit('form')"
          size="mini"
          style="margin-left: 25px"
          plain
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import instanceAxios from "../api/axios-init";
export default {
  name: "HelloWorld",
  props: ["dialogFormVisible", "tableData"],
  data() {
    const that = this;
    let validatorIP = function (rules, values, callback) {
      if (values == undefined) {
        callback(new Error("IP不可为空"));
      } else {
        if (that.splitIpArray(values).length) {
          callback();
        } else {
          callback(new Error(that.splitIpArray(values).errText));
        }
      }
    };
    let validatorPORT = function (rules, values, callback) {
      if (!values.length) {
        callback();
      } else {
        let normalData = /^[\s\d]*$/;
        if (!normalData.test(values)) {
          callback(new Error("存在无效字符"));
        }
        let valuesArr = that.portFilter(values);
        let newsArr = [];
        valuesArr.forEach((item) => {
          if (Number(item) < 0 || Number(item) > 65535) {
            callback(new Error("端口超出范围"));
          }
          if (!newsArr.includes(item)) {
            newsArr.push(item);
          } else {
            callback(new Error("端口重复"));
          }
        });
        callback();
      }
    };
    return {
      isICMP: false,
      czfas: [
        {
          value: 1,
          wsdFamc: "TCP",
          id: "TCP",
          disabled: false,
        },
        {
          value: 2,
          wsdFamc: "UDP",
          id: "UDP",
          disabled: false,
        },
        {
          value: 3,
          wsdFamc: "ICMP",
          id: "ICMP",
          disabled: false,
        },
      ],
      form: {
        priority: "",
        strategy: 2,
        protos: [],
        addr_src_arr: "",
        port_src_arr: "",
        addr_dst_arr: "",
        port_dst_arr: "",
      },
      rules: {
        priority: [
          { required: true, message: "请输入优先级", trigger: "blur" },
          {
            validator(rules, values, callback) {
              if (Number(values) < 1 || Number(values) > 10239) {
                callback(new Error("优先级范围:1~10239"));
              } else {
                that.tableData.forEach((item) => {
                  if (Number(values) == item.priority) {
                    callback(new Error("优先级已存在"));
                  }
                });
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        protos: [
          { type: "array", required: true, message: "请至少选择一种协议" },
          {
            validator(rules, values, callback) {
              if (!values.length) {
                callback(new Error("请至少选择一种协议"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        addr_src_arr: [
          {
            validator: validatorIP,
            trigger: "blur",
          },
        ],
        addr_dst_arr: [
          {
            validator: validatorIP,
            trigger: "blur",
          },
        ],
        port_src_arr: [
          {
            validator: validatorPORT,
            trigger: "blur",
          },
        ],
        port_dst_arr: [
          {
            validator: validatorPORT,
            trigger: "blur",
          },
        ],
      },

      formLabelWidth: "120px",
    };
  },
  methods: {
    formSubmit(ruleForm) {
      let isValid = true;
      this.$refs[ruleForm].validate((valid) => {
        console.log("开始验证表单数据");
        console.log("------验证结果-----：", valid);
        isValid = valid;
        if (!valid) {
          setTimeout(() => {
            let error = document.getElementsByClassName("is-error");
            error[0].querySelector('div').focus();
          }, 1);
        }
      });
      if (!isValid) {
        return false;
      }
      let formData = JSON.parse(JSON.stringify(this.form));
      // 检测选择的协议类型
      let protos = 0;
      formData.protos.map((item) => {
        switch (item) {
          case "TCP":
            protos |= 1;
            break;
          case "UDP":
            protos |= 1 << 1;
            break;
          case "ICMP":
            protos |= 1 << 2;
            break;
        }
      });
      formData.protos = protos;
      formData.priority = Number(formData.priority);
      formData.port_src_arr =
        formData.port_src_arr.length == 0
          ? []
          : this.portFilter(formData.port_src_arr);
      formData.port_dst_arr =
        formData.port_dst_arr.length == 0
          ? []
          : this.portFilter(formData.port_dst_arr);
      formData.addr_src_arr = this.splitIpArray(formData.addr_src_arr);
      formData.addr_dst_arr = this.splitIpArray(formData.addr_dst_arr);
      instanceAxios
        .post("/xdp-acl/IPv4/rule", formData)
        .then((res) => {
          if (res.status === 201) {
            let newRuleObj = Object.assign(res.data, { hitcount: 0 });
            this.$emit("formSubmit", newRuleObj);
          }
          this.czfas.map((item) => {
            item.disabled = false;
            this.isICMP = false;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formCancel() {
      this.$emit("formCancel", false);
    },
    splitIpArray(data) {
      let raw_ip_arr = data.trim().split(/\s+/);
      let new_ip_arr = [];
      let ip_mask_pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

      for (let ip_index = 0; ip_index < raw_ip_arr.length; ip_index++) {
        let ip_index_arr = raw_ip_arr[ip_index].split("/");
        if (ip_index_arr.length < 2) {
          return { errText: "IP不完整", state: false };
        }
        if (Number(ip_index_arr[2]) > -1 && Number(ip_index_arr[2]) < 33) {
          return { errText: "子网掩码超出范围", state: false };
        }
        if (!ip_mask_pattern.test(raw_ip_arr[ip_index])) {
          return { errText: `第${++ip_index}行IP格式错误`, state: false };
        }
        new_ip_arr.push({
          cidr_user: raw_ip_arr[ip_index],
        });
      }
      return new_ip_arr;
    },
    portFilter(port) {
      let portArry = port.trim().split(/\s+/).map(Number);
      return portArry;
    },
    // selectChange(data) {
    // if (!data.length) {
    //   this.czfas.map((item) => {
    //     item.disabled = false;
    //     this.isICMP = false;
    //   });
    // } else {
    //   if (data.includes("ICMP")) {
    //     // 选择ICMP的处理方法：
    //     this.czfas.map((item) => {
    //       if (item.id != "ICMP") {
    //         item.disabled = true;
    //         this.isICMP = true;
    //         this.form.port_src = "";
    //         this.form.port_dst_arr = "";
    //       }
    //     });
    //   } else {
    //     this.czfas.map((item) => {
    //       if (item.id == "ICMP") {
    //         item.disabled = true;
    //         this.isICMP = false;
    //       }
    //     });
    //   }
    // }
    // },
  },
};
</script>

<style>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.input-view {
  width: 280px !important;
}
.el-form-item {
  margin-bottom: 18px;
}
.input-little {
  width: 140px !important;
}
.input-small {
  width: 186px !important;
}

.form-item-view .el-form-item__label,
.el-select-dropdown__list .el-select-dropdown__item {
  font-size: 12px;
}
.el-input-number.is-controls-right .el-input__inner {
  padding-right: 45px !important;
}

.input-assist-view {
  display: inline-block;
  color: #909399;
  position: absolute;
  bottom: -5px;
}
.assist-text {
  margin-top: 12px;
  font-size: 9px;
  transform: scale(0.9, 0.9);
  line-height: 2px;
  white-space: nowrap;
}
.addForm .el-dialog .el-dialog__body {
  padding: 10px 30px 0px 2px!important;
}
.addForm .el-dialog__footer {
  padding-top: 0px !important;
  padding-right: 0!important;
}
input[disabled] {
  background: #949597;
}
.addr-ip-view {
  display: flex;
  width: 360px;
  margin-left: 54px;
  justify-content: space-between;
}
.addr-ip-view > .addr-ip-item label {
  text-align: left;
}
.addr-ip-view > .addr-ip-item .addr-ip-item-textarea {
  width: 199px;
}
.addr-ip-view > .addr-ip-item .addr-ip-item-textarea > textarea {
  height: 65px;
}
.el-textarea__inner{
  padding: 10px!important;
}
.el-input__inner{
  padding:0 10px!important;
}
/* .el-input.el-input--mini.el-input--suffix{
  width: 315px;
} */
.one-line-select{
  width: 340px;
}
</style>
