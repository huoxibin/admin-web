<template>
  <div>
    <el-row class="landpage">
      <el-col :span="13">
        <DkDeskwork :dataList="panesData"></DkDeskwork>
        <!--//////////排行内容//////////////-->

        <el-header class="head-txt m-t-10 m-b-10 bgd">
          业绩排行（成功签约数）
          <el-select v-model="value" size="mini" class="pull-right" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-header>
        <dk-table
          border
          stripe
          :data="tableData"
          :config="tableConfig"
          index
          :pageNum="1"
          :pageSize="5"
          max-height="250"
        ></dk-table>
      </el-col>
      <el-col :span="11">
        <!--我是日历-->
        <full-calendar
          :events="fcEvents"
          locale="en"
          @changeMonth="changeMonth"
          @eventClick="eventClick"
          @dayClick="dayClick"
          @moreClick="moreClick"
        ></full-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "landPage",
  components: {
    "full-calendar": require("vue-fullcalendar")
  },
  data() {
    return {
      //日历相关
      value: "",
      fcEvents: [
        {
          title: "看见了一只猫", // 事件内容
          start: "2019-05-12", // 事件开始时间
          end: "2019-05-12", // 事件结束时间
          content: "内容"
        },
        {
          title: "吃了顿饭", // 事件内容
          start: "2019-05-12", // 事件开始时间
          end: "2019-05-12", // 事件结束时间
          content: "内容"
        }
      ],
      panesData: [
        {
          name: "简报",
          column: [
            {
              title: "线索",
              data: [
                {
                  num: 7,
                  unit: "个",
                  desc: "待处理线索",
                  link: "/custorm/clue/list"
                },
                {
                  num: 18,
                  unit: "个",
                  desc: "关闭线索",
                  link: "http://www.baidu.com"
                },
                {
                  num: 22,
                  unit: "个",
                  desc: "已处理线索",
                  link: "http://www.baidu.com"
                }
              ]
            },
            {
              title: "意向客户",
              data: [
                {
                  num: 7,
                  unit: "个",
                  desc: "待跟进的客户",
                  link: "http://www.baidu.com"
                },
                {
                  num: 18,
                  unit: "个",
                  desc: "跟进中的客户",
                  link: "http://www.baidu.com"
                },
                {
                  num: 22,
                  unit: "个",
                  desc: "正式客户",
                  link: "http://www.baidu.com"
                }
              ]
            }
          ]
        },
        {
          name: "审批中心",
          column: [
            {
              title: "意向客户",
              data: [
                {
                  num: 7,
                  unit: "个",
                  desc: "待我审核",
                  link: "/custorm/clue/list"
                },
                {
                  num: 18,
                  unit: "个",
                  desc: "审核中",
                  link: "http://www.baidu.com"
                },
                {
                  num: 22,
                  unit: "个",
                  desc: "审核通过",
                  link: "http://www.baidu.com"
                },
                {
                  num: 22,
                  unit: "个",
                  desc: "审核拒绝",
                  link: "http://www.baidu.com"
                },
                {
                  num: 22,
                  unit: "个",
                  desc: "抄送我的",
                  link: "http://www.baidu.com"
                }
              ]
            },
            {
              title: "意向客户",
              data: [
                {
                  num: 7,
                  unit: "个",
                  desc: "待跟进的客户",
                  link: "http://www.baidu.com"
                },
                {
                  num: 18,
                  unit: "个",
                  desc: "跟进中的客户",
                  link: "http://www.baidu.com"
                },
                {
                  num: 22,
                  unit: "个",
                  desc: "正式客户",
                  link: "http://www.baidu.com"
                }
              ]
            }
          ]
        }
      ],

      ///排行相关/
      tableData: [],
      tableConfig: [
        {
          type: "",
          label: "姓名",
          value: "name",
          tooltip: true
        },
        {
          type: "",
          label: "完成业绩",
          value: "type",
          tooltip: true
        }
      ],
      options: [
        {
          label: "本月",
          value: "1"
        },
        {
          label: "上月",
          value: "2"
        },
        {
          label: "本季度",
          value: "3"
        },
        {
          label: "上季度",
          value: "4"
        },
        {
          label: "本年",
          value: "5"
        }
      ]
    };
  },
  methods: {
    // 选择月份
    changeMonth(start, end, current) {
      //console.log("changeMonth", start, end, current);
    },
    // 点击事件
    eventClick(event, jsEvent, pos) {
      //console.log("eventClick", event, jsEvent, pos);
    },
    // 点击当天
    dayClick(day, jsEvent) {
     // console.log("dayClick", day, jsEvent);
    },
    // 查看更多
    moreClick(day, events, jsEvent) {
      //console.log("moreCLick", day, events, jsEvent);
    }
  }
};
</script>

<style lang="scss" scoped>
.is-selected {
  color: #f60;
}
</style>