<template>
  <div class="addForm">
    <el-dialog
      title="添加规则"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
      :before-close="formCancel"
      top="12vh"
      width="500px"
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
          label="编号 :"
          prop="priority"
          type="number"
          :label-width="formLabelWidth"
          class="form-item-view form-item-little"
        >
          <el-input
            class="input-little"
            v-model="form.priority"
            type="number"
            oninput="if(value>10239)value=10239;if(value<1)value=1"
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
            class="input-view"
            @change="selectChange"
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
        <el-form-item
          label="源 IP ："
          :label-width="formLabelWidth"
          prop="addr_src.ip_user"
          class="form-item-view"
        >
          <template slot="label">
            <span style="">
              <el-tooltip style="" class="item" effect="light" placement="top">
                <div slot="content">
                  <p class="assist-text">0.0.0.0 表示所有 IP</p>
                </div>
                <span
                  >源 IP
                  <i class="el-icon-warning-outline ico-pre" style="font-size: 10px"></i
                ></span>
              </el-tooltip>
            </span>
            :
          </template>
          <el-input
            class="input-small"
            v-model="form.addr_src.ip_user"
            autocomplete="off"
            placeholder="示例 : 123.123.123.123"
          ></el-input>
          /
          <el-input-number
            v-model="form.addr_src.mask"
            controls-position="right"
            :min="0"
            :max="32"
            style="width: 80px"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="源端口："
          :label-width="formLabelWidth"
          prop="port_src"
          class="form-item-view"
        >
          <template slot="label">
            <span style="">
              <el-tooltip style="" class="item" effect="light" placement="top">
                <div slot="content">
                  <p class="assist-text">• 端口范围 : 0~65535</p>
                  <p class="assist-text">• 多个端口用空格分割</p>
                  <p class="assist-text">• 空白不填表示所有端口</p>
                </div>
                <span
                  >源端口
                  <i class="el-icon-warning-outline ico-pre" style="font-size: 10px"></i
                ></span>
              </el-tooltip>
            </span>
            :
          </template>
          <el-input
            class="input-view"
            v-model="form.port_src"
            autocomplete="off"
            placeholder="示例 : 1 60 80"
            :disabled="isICMP"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="目的 IP："
          :label-width="formLabelWidth"
          prop="addr_dst.ip_user"
          class="form-item-view"
        >
          <template slot="label">
            <span style="">
              <el-tooltip style="" class="item" effect="light" placement="top">
                <div slot="content">
                  <p class="assist-text">0.0.0.0 表示所有 IP</p>
                </div>
                <span
                  >目的 IP
                  <i class="el-icon-warning-outline ico-pre" style="font-size: 10px"></i
                ></span>
              </el-tooltip>
            </span>
            :
          </template>
          <el-input
            class="input-small"
            v-model="form.addr_dst.ip_user"
            autocomplete="off"
            placeholder="示例 : 123.123.123.123"
          ></el-input>
          /
          <el-input-number
            v-model.number="form.addr_dst.mask"
            controls-position="right"
            :min="0"
            :max="32"
            style="width: 80px"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="目的端口："
          :label-width="formLabelWidth"
          prop="port_dst"
          class="form-item-view"
        >
          <template slot="label">
            <span style="">
              <el-tooltip style="" class="item" effect="light" placement="top">
                <div slot="content">
                  <p class="assist-text">• 端口范围 : 0~65535</p>
                  <p class="assist-text">• 多个端口用空格分割</p>
                  <p class="assist-text">• 空白不填表示所有端口</p>
                </div>
                <span
                  >目的端口
                  <i class="el-icon-warning-outline ico-pre" style="font-size: 10px"></i
                ></span>
              </el-tooltip>
            </span>
            :
          </template>
          <el-input
            class="input-view"
            v-model="form.port_dst"
            autocomplete="off"
            placeholder="示例 : 1 60 80"
            :disabled="isICMP"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right: 70px; padding-top: 0">
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
      if (!values.length) {
        callback(new Error("IP不可为空"));
      } else {
        let ip_mask_pattern = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
        let mask = that.form[rules.field.split(".")[0]].mask;
        if (!ip_mask_pattern.test(values + "/" + mask)) {
          callback(new Error("IP格式错误"));
          return false;
        } else {
          callback();
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
        addr_src: {
          ip_user: "0.0.0.0",
          mask: 24,
        },
        port_src: "",
        addr_dst: {
          ip_user: "0.0.0.0",
          mask: 0,
        },
        port_dst: "",
      },
      rules: {
        priority: [
          { required: true, message: "请输入编号", trigger: "blur" },
          {
            validator(rules, values, callback) {
              if (Number(values) < 1 || Number(values) > 10239) {
                callback(new Error("编号范围:1~10239"));
              } else {
                that.tableData.forEach((item) => {
                  if (Number(values) == item.priority) {
                    callback(new Error("编号已存在"));
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
        "addr_src.ip_user": [
          {
            validator: validatorIP,
            trigger: "blur",
          },
        ],
        "addr_dst.ip_user": [
          {
            validator: validatorIP,
            trigger: "blur",
          },
        ],
        port_src: [
          {
            validator: validatorPORT,
            trigger: "blur",
          },
        ],
        port_dst: [
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
            error[0].querySelector("input").focus();
          }, 100);
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
      formData.port_src =
        formData.port_src.length == 0 ? [] : this.portFilter(formData.port_src);
      formData.port_dst =
        formData.port_dst.length == 0 ? [] : this.portFilter(formData.port_dst);
      instanceAxios
        .post("/xdp-acl/IPv4/rule", formData)
        .then((res) => {
          if (res.status === 201) {
            this.$emit("formSubmit", res.data);
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
    portFilter(port) {
      let portArry = port.trim().split(/\s+/).map(Number);
      return portArry;
    },
    selectChange(data) {
      if (!data.length) {
        this.czfas.map((item) => {
          item.disabled = false;
          this.isICMP = false;
        });
      } else {
        if (data.includes("ICMP")) {
          // 选择ICMP的处理方法：
          this.czfas.map((item) => {
            if (item.id != "ICMP") {
              item.disabled = true;
              this.isICMP = true;
              this.form.port_src = "";
              this.form.port_dst = "";
            }
          });
        } else {
          this.czfas.map((item) => {
            if (item.id == "ICMP") {
              item.disabled = true;
              this.isICMP = false;
            }
          });
        }
      }
    },
  },
};
</script>

<style>
/* 去掉input[number]默认样式 */
input[type="number"] {
  -moz-appearance: textfield;
}
/* MAC与IOS兼容设置 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.input-view {
  width: 280px !important;
}
.el-form-item {
  margin-bottom: 18px;
}
.input-little {
  width: 110px !important;
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
.el-dialog .el-dialog__body {
  padding: 10px 0px 0px;
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
.el-dialog .el-dialog__body {
  padding: 10px 10px 0px 10px;
}
.el-dialog__footer {
  padding-top: 0px !important;
}
input[disabled] {
  background: #949597;
}
</style>
