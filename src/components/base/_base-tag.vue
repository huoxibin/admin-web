<template>
  <div class="base-tag">
    <!-- tag list -->
    <el-tag v-for="item,index in list" :key="index" size="medium">{{ item }}</el-tag>
    <div class="tag-btn">
      <el-button type="primary" size="mini" @click="dialogVisible = true">浏 览</el-button>
    </div>

    <!-- tag dialog -->
    <el-dialog title="Tag词设置" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
      <h5>您希望把内容归属那类标签？</h5>
      <!-- tags -->
      <div class="tags" style="margin-top: 20px;" v-loading="loading" element-loading-text="拼命加载中">
        <el-checkbox-group v-model="checkboxGroup" size="mini">
          <el-popover
            v-for="item,index in tags"
            :key="item.id"
            placement="top-start"
            width="80"
            trigger="hover"
          >
            <!-- tag 删除 -->
            <div class="delete" style="display: flex;justify-content: center;">
              <el-button type="danger" size="mini" @click="handleDeleteTag(item,index)" plain>删除该标签</el-button>
            </div>
            <!-- tags 多选 -->
            <el-checkbox
              style="margin:5px"
              size="mini"
              slot="reference"
              :label="item.itemValue"
              border
            >{{item.itemValue}}</el-checkbox>
          </el-popover>
          <!-- 新增 tag -->
          <div class="add-tag">
            <el-input
              style="width: 150px;margin:5px"
              class="input-new-tag"
              v-if="inputVisible"
              v-model="tagValue"
              size="mini"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button
              style="margin:5px"
              type="primary"
              v-else
              class="button-new-tag"
              size="mini"
              @click="inputVisible = true"
            >+ New Tag</el-button>
          </div>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="tagSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "BaseTag",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    loading: false,
    tags: [],
    inputVisible: false,
    tagValue: "",
    dialogVisible: false,
    checkboxGroup: []
  }),
  watch: {
    list(now) {
      this.checkboxGroup = now;
    }
  },
  created() {
    this.getTags();
  },
  methods: {
    // 获取tag词列表
    getTags() {
      this.loading = true;
      this.$get("/data/my", {
        pathL: "/ap/sysDictItem/getValueByName",
        dictName: "articleTag"
      }).then(res => {
        this.loading = false;
        if (res.state === 0) {
          this.tags = res.data;
        } else {
          this.$message({
            message: res.msg,
            center: true
          });
        }
      });
    },
    // 新增tag
    handleInputConfirm() {
      const tagValue = this.tagValue;
      if (tagValue !== "") {
        this.$post(
          "/data/my",
          this.$qs.stringify({
            pathL: "/ap/sysDictItem/addByName",
            dictName: "articleTag",
            itemName: tagValue,
            itemValue: tagValue,
            sortInt: 0
          })
        ).then(res => {
          if (res.state === 0) {
            this.$message({
              message: "添加成功！",
              type: "success",
              center: true
            });
            this.getTags();
            this.inputVisible = false;
            this.tagValue = "";
          } else {
            this.$message({
              message: res.msg,
              center: true
            });
          }
        });
      }
    },
    // 删除tag
    handleDeleteTag(item, index) {
      this.$confirm("您确定要删除该标签吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$post(
            "/data/my",
            this.$qs.stringify({
              pathL: "/ap/sysDictItem/del",
              itemId: item.id
            })
          ).then(res => {
            if (res.state === 0) {
              this.$message({
                message: "删除成功",
                type: "success",
                center: true
              });
              this.checkboxGroup.splice(
                this.checkboxGroup.indexOf(item.itemName),
                1
              );
              this.$emit("handleClick", this.checkboxGroup);
              this.getTags();
            }
          });
        })
        .catch(() => {
          this.$message({
            message: "已取消删除",
            center: true
          });
        });
    },
    // 确认tag
    tagSubmit() {
      this.dialogVisible = false;
      this.$emit("handleClick", this.checkboxGroup);
    }
  }
};
</script>

<style>
</style>
