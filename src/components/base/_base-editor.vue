<template>
  <quill-editor
    aria-disabled="true"
    v-model="context"
    style="width: 100%;height: 100%;margin-bottom: 80px;"
    :options="editorOption"
    @focus="onEditorFocus($event)"
  ></quill-editor>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
Quill.register("modules/ImageExtend", ImageExtend);
export default {
  name: "BaseEditor",
  components: { quillEditor },
  model: {
    prop: "edit",
    event: "editor"
  },
  props: {
    edit: String,
    disable: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    context: "",
    editorOption: {
      modules: {
        ImageExtend: {
          loading: true,
          name: "file",
          action: "/data/uploadImg",
          response: res => res.data.url
        },
        toolbar: {
          container,
          handlers: {
            image: function() {
              QuillWatch.emit(this.quill.id);
            }
          }
        }
      }
    }
  }),
  watch: {
    context(now) {
      this.$emit("editor", now);
    },
    edit: {
      handler(now) {
        this.context = now;
      },
      immediate: true
    }
  },
  methods: {
    onEditorFocus(val) {
      // 获得焦点时的事件
      //debugger
      val.enable(this.disable); // 在获取焦点的时候禁用
    }
  }
};
</script>

<style>
</style>
