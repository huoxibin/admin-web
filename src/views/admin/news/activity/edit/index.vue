<template>
  <div class="activity-edit">
    <el-form
      ref="form"
      :model="form"
      v-loading="loading"
      :rules="rules"
      size="mini"
      label-width="100px"
    >
      <!-- 活动基本信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>活动基本信息</span>
        </div>
        <!-- 活动名称 -->
        <el-form-item label="活动名称" prop="name">
          <p v-if="type==='detail'">{{form.name}}</p>
          <el-input v-else v-model="form.name"></el-input>
        </el-form-item>
        <!-- 活动时间 -->
        <el-form-item label="活动时间" prop="date">
          <p v-if="type==='detail'">{{form.date}}</p>
          <el-date-picker
            v-else
            v-model="form.date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <!-- 活动地址 -->
        <el-form-item label="活动地址" prop="linkUrl">
          <p v-if="type==='detail'">{{form.linkUrl}}</p>
          <el-input v-else v-model="form.linkUrl"></el-input>
        </el-form-item>
        <!-- 活动类型 -->
        <el-form-item label="活动类型" prop="tag">
          <div v-if="type==='detail'" class="msg">
            <p v-if="form.tag === 'doctor_invite_get_packet'">邀请人红包活动</p>
            <p v-if="form.tag==='doctor_by_invaite_get_packet'">被邀请人红包活动</p>
          </div>
          <el-radio-group v-else v-model="form.tag">
            <el-radio label="doctor_invite_get_packet">邀请人红包活动</el-radio>
            <el-radio label="doctor_by_invaite_get_packet">被邀请人红包活动</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>
      <!-- 活动规则设置 -->
      <el-card class="box-card" style="margin:20px 0">
        <div slot="header" class="clearfix">
          <span>活动规则设置</span>
        </div>
        <el-form
          ref="former"
          v-for="item,index in form.rule"
          :key="index"
          :model="item"
          inline
          :rules="ruleser"
          size="mini"
          label-width="100px"
        >
          <el-form-item :label="'规则'+index" prop="awardType">
            <el-select v-model="item.awardType" disabled>
              <el-option label="谢谢" :value="1"></el-option>
              <el-option label="现金" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <div v-show="index===0 && type!=='detail'" class="now"></div>
          <el-form-item v-if="index!==0" prop="unitAmount">
            <p style="margin-left:20px;" v-if="type==='detail'">{{item.unitAmount}}</p>
            <el-input
              v-else
              v-show="index!==0"
              style="width:200px"
              v-model="item.unitAmount"
              placeholder="请输入金额"
            ></el-input>
          </el-form-item>
          <el-form-item label="发放个数" prop="count">
            <p v-if="type==='detail'">{{item.count}}</p>
            <el-input v-else style="width:200px" v-model="item.count" placeholder="请输入数字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="index>1 && type!=='detail'"
              @click="removeRule(index)"
              style="margin:0 20px;"
              type="danger"
            >删除</el-button>
            <p v-else style="width:96px"></p>
            <span style="margin:0 20px;" v-show="index!==0">成本</span>
            <span
              v-show="item.unitAmount && item.count && index!==0"
            >{{`¥ ${Number(item.unitAmount)*Number(item.count)}`}}</span>
          </el-form-item>
        </el-form>
        <div class="flex" style="width:800px;justify-content:center;">
          <el-button
            v-if="form.rule.length<10 && type!=='detail'"
            style="width:100px;"
            @click="addRule"
            size="mini"
            type="primary"
          >添加规则</el-button>
        </div>
      </el-card>
      <!-- 活动成本信息 -->
      <el-card class="box-card" style="margin:20px 0">
        <div slot="header" class="clearfix">
          <span>活动成本信息</span>
        </div>
        <div class="flex">
          <el-form-item label="活动发放总数">{{total.num}}</el-form-item>
          <el-form-item style="margin:0 100px;" label="活动总成本">{{'¥'+total.money}}</el-form-item>
        </div>
        <el-form-item>
          <el-button v-if="type!=='detail'" @click="submit" type="primary">保 存</el-button>
          <el-button v-if="type!=='detail'" @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-card>
      <!-- 活动情况 -->
      <el-card v-if="type==='detail'" class="box-card" style="margin:20px 0">
        <div slot="header" class="clearfix">
          <span>活动情况</span>
        </div>
        <div class="flex">
          <el-form-item label="已发放总数">{{totalNum}}</el-form-item>
          <el-form-item style="margin:0 100px;" label="累积中奖内容">{{totalMount}}</el-form-item>
        </div>
        <el-table :data="data" border stripe style="width: 100%">
          <el-table-column prop="doctorName" label="姓名" align="center"></el-table-column>
          <el-table-column prop="platform" label="平台" align="center"></el-table-column>
          <el-table-column prop="amount" label="中奖内容" align="center"></el-table-column>
          <el-table-column prop="createTime" label="中奖时间" align="center"></el-table-column>
          <el-table-column prop="date" label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="list-pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageLength"
          ></el-pagination>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { isValidMoney, isValidFiveNumberZero } from "@/utils/RegExp.js";
const CheckMoney = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入金额"));
  } else if (!isValidMoney(value)) {
    callback(new Error("请输入正确的金额"));
  } else {
    callback();
  }
};
const CheckFiveNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入发放个数"));
  } else if (!isValidFiveNumberZero(value)) {
    callback(new Error("请输入正确的发放个数"));
  } else {
    callback();
  }
};
export default {
  name: "ActivityEdit",
  computed: {
    total() {
      const rule = [...this.form.rule];
      delete rule[0];
      const [num, money] = [[], []];
      rule.forEach((item, index) => {
        num.push(Number(item.count));
        money.push(Number(item.unitAmount) * Number(item.count));
      });
      return {
        num: num.reduce((a, b) => a + b),
        money: money.reduce((a, b) => a + b)
      };
    }
  },
  data() {
    return {
      loading: false,
      type: this.$route.params.type,
      form: {
        name: "", //活动名称
        date: "", //活动时间
        linkUrl: "", //活动地址
        tag: "",
        rule: [
          {
            awardType: 1, //规则选择
            unitAmount: "", //规则金额
            count: "" //发放个数
          },
          {
            awardType: 2, //规则选择
            unitAmount: "", //规则金额
            count: "" //发放个数
          }
        ]
      },
      data: [],
      rules: {
        name: [
          {
            required: this.$route.params.type !== "detail",
            message: "请输入活动名称",
            trigger: "blur"
          },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        date: {
          required: this.$route.params.type !== "detail",
          message: "请选择活动时间"
        },
        linkUrl: {
          required: this.$route.params.type !== "detail",
          message: "请填写活动地址"
        },
        tag: {
          required: this.$route.params.type !== "detail",
          message: "请选择活动类型"
        }
      },
      ruleser: {
        unitAmount: {
          required: this.$route.params.type !== "detail",
          validator: CheckMoney,
          trigger: "blur"
        },
        count: [
          {
            required: this.$route.params.type !== "detail",
            validator: CheckFiveNum,
            trigger: "blur"
          }
        ]
      },
      totalNum: "",
      totalMount: "",
      pageNum: 1,
      pageSize: 8,
      pageLength: 0,
      // 活动时间限制
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      dialogVisible: false
    };
  },
  created() {
    this.getInfo();
    this.getList();
  },
  methods: {
    // 获取详情
    getInfo() {
      if (this.$route.params.type !== "add") {
        this.loading = true;
        this.$post("/data/my", {
          pathL: "/doctor/activityInfo/details",
          id: this.$route.query.id
        }).then(res => {
          this.loading = false;
          if (res.state === 0) {
            this.form = res.data;
            if (this.$route.params.type === "detail") {
              this.form.date = `${res.data.beginTime} - ${res.data.endTime}`;
            } else {
              this.form.date = [res.data.beginTime, res.data.endTime];
            }
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        });
      }
    },
    // 获取中奖列表
    getList() {
      if (this.$route.params.type === "detail") {
        this.loading = true;
        this.$post("/data/my", {
          pathL: "/doctor/activityAward/list",
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          id: this.$route.query.id
        }).then(res => {
          this.loading = false;
          if (res.state === 0) {
            this.data = res.data.result.list;
            this.totalMount = res.data.result.totalMount;
            this.totalNum = res.data.result.totalNum;
            this.pageLength = res.data.total;
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        });
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    // 添加规则
    addRule() {
      const rule = {
        awardType: 2, //规则选择
        unitAmount: "", //规则金额
        count: "" //发放个数
      };
      this.form.rule.push(rule);
    },
    // 删除规则
    removeRule(index) {
      this.form.rule.splice(index, 1);
    },
    // 提交
    submit() {
      const data = {
        pathL: "/doctor/activityInfo/add",
        name: this.form.name,
        beginTime: this.form.date === null ? "" : this.form.date[0],
        endTime: this.form.date === null ? "" : this.form.date[1],
        linkUrl: this.form.linkUrl,
        tag: this.form.tag,
        rule: JSON.stringify(this.form.rule),
        createrName: this.$store.getters.userInfo.userName
      };
      if (this.$route.params.type !== "add") {
        data.pathL = "/doctor/activityInfo/edit";
        data.id = this.$route.query.id;
      }
      let flag = false;
      let flager = false;
      this.$refs.form.validate(valid => {
        if (valid) {
          flag = true;
        } else {
          this.$message({
            message: "请正确填写表单",
            center: true
          });
        }
      });
      for (let i = 0; i < this.$refs.former.length; i++) {
        this.$refs.former[i].validate(valid => {
          if (valid) {
            flager = true;
          } else {
            flager = false;
            this.$message({
              message: "请正确填写表单",
              center: true
            });
          }
        });
      }
      if (flag && flager) {
        this.$post("/data/my", data).then(res => {
          if (res.state === 0) {
            this.$message({
              type: "success",
              message: "保存成功！",
              center: true
            });
            this.$router.push("/news/activity/list");
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
        });
      }
    },
    // 查看中奖列表详情
    detail(row) {
      const { doctorId, teamId, checkFlag } = row;
      this.$router.push({
        name: "医护管理/医护管理/查看",
        query: {
          id: doctorId,
          teamId,
          checkFlag
        }
      });
    }
  }
};
</script>

<style scoped>
.activity-edit {
  padding: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: space-around;
}
.flex {
  display: flex;
}
.now {
  display: inline-block;
  width: 210px;
}
.tags {
  margin-right: 20px;
}
.select {
  width: 100%;
  height: 400px;
  display: flex;
}
.select-left,
.select-right {
  flex: 5;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;
  overflow: auto;
}
.select-left p,
.select-right p {
  margin: 10px 0;
}
.select-switch {
  flex: 1;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
</style>
