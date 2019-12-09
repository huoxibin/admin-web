<template>
  <div class="ql-container ql-snow">
    <div class="ql-editor" v-html="element"></div>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "BaseEditView",
  props: {
    element: String
  }
};
</script>
