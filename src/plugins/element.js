import Vue from "vue";
import { Button, Form, FormItem, Input, Message } from "element-ui";

Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input);

// 弹窗需要挂载
Vue.prototype.$message = Message;
