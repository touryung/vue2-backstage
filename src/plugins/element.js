import Vue from "vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
} from "element-ui";

Vue.use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem);

// 弹窗需要挂载
Vue.prototype.$message = Message;
