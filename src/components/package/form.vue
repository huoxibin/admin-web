<template>
  <el-form ref="form" :model="form" :rules="rules" :inline="inline" :label-width="labelWidth">
    <!-- form-item -->
    <el-form-item
      v-for="(item, index) in config"
      :key="item.value"
      :label="item.label"
      :prop="item.value"
      v-if="!item.hide"
      size="mini"
    >
      <div v-if="item.type=='text'">{{ form[item.value] }}</div>
      <!-- 动态组件 -->
      <component
        :rows="item.option.rows?item.option.rows:2"
        v-if="components[index].type === item.type"
        v-model="form[item.value]"
        :is="components[index].tag"
        :disabled="item.option.disabled"
        :type="item.option.type"
        :placeholder="item.option.placeholder"
        :editable="false"
        :options="item.option.cascader ? item.option.cascader.data : []"
        :picker-options="item.option.pickerOptions"
        :value-format="item.option.format"
        :filterable="item.option.cascader ? item.option.cascader.filterable : false"
        :change-on-select="item.option.cascader ? item.option.cascader.changeOnSelect : false"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="selectChange(item.option.selectOnChange)"
      >
        <div
          v-if="(typeof item.option.btnConfig) == 'object'"
          @click="btnClick(item.option.btnConfig.btnCallBack)"
        >{{ item.option.btnConfig.label }}</div>

        <!-- 动态组件子项 -->
        <div v-if="item.option.data && !item.hide" class="option">
          <component
            v-for="option in item.option.data"
            :key="option.value"
            :is="
              `el-${item.type === 'select' ? 'option' : components[index].type}`
            "
            :label="item.type === 'select' ? option.label : option.value"
            :value="option.value"
            :disabled="option.disabled"
          >{{ option.label }}</component>
        </div>
      </component>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "DkForm",
  props: {
    // 表单数据对象
    form: {
      type: Object,
      required: true
    },
    // 表单配置信息
    config: {
      type: Array,
      required: true
    },
    // 表单验证规则 用法参考 element-ui
    rules: {
      type: Object
    },
    // 行内表单模式
    inline: {
      type: Boolean,
      default: false
    },
    // 表单域标签的宽度
    labelWidth: {
      type: String,
      default: "80px"
    }
  },
  computed: {
    components() {
      const component = {
        input: "el-input",
        textarea: "el-input",
        button: "el-button",
        select: "el-select",
        date: "el-date-picker",
        switch: "el-switch",
        checkbox: "el-checkbox-group",
        radio: "el-radio-group",
        cascader: "el-cascader"
      };
      const config = this.config;
      const componentName = config.map(item => item.type);
      const components = componentName.map(item => {
        return {
          type: item,
          tag: component[item]
        };
      });

      return components;
    }
  },
  methods: {
    btnClick(funcName) {
      this.$parent.$parent[funcName]();
    },
		selectChange(funcName) {
      if(funcName!==undefined){
				this.$parent.$parent[funcName]();
      }
    }
  }
};
</script>
