import { createApp } from "vue";
import App from "./App.vue";

import { createI18n } from "vue-i18n";
import router from "./routes";
import store from "./stores";
/**Begin bootstrap 5 */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// import { createPopper } from '@popperjs/core';
// /*and not as you have above i.e*/
// import Popper from "@popperjs/core";
/**End bootstrap 5 */
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";

import "ant-design-vue/dist/antd.css";
import Antd from "ant-design-vue";

// import DefaultLayout from "./layouts/DefaultLayout.vue";
import DashboardLayout from "./layouts/DashboardLayout.vue";

const messages = {
  th: {
    route: {
      home: "หน้าแรก",
      project: "โครงการ",
      setting: "ตั้งค่า",
    },
    label: {
      hello: "สวัสดี",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ",
      editprofile: "แก้ไขโปรไฟล์",
      settingprofile: "ตั้งค่า",
      username: "ชื่อผู้ใช้",
      password: "รหัสผ่าน",
      remember: "จำฉันไว้",
      forgotpassword: "ลืมรหัสผ่าน",
      registeracccount: "สมัครสมาชิก!",
    },
  },
  en: {
    route: {
      home: "Home",
      project: "Project",
      setting: "Setting",
    },
    label: {
      hello: "Hello",
      login: "Login",
      logout: "Logout",
      editprofile: "Edit Profile",
      settingprofile: "Settings",
      username: "Username",
      password: "Password",
      remember: "Remember",
      forgotpassword: "Forgot password",
      registeracccount: "Register now!",
    },
  },
};
// your message resolver
const messageResolver = (obj, path) => {
  // simple message resolving!
  const msg = obj[path];
  return msg != null ? msg : null;
};
const i18n = createI18n({
  useScope: "global",
  legacy: false, // you must set `false`, to use Composition API
  locale: "en", // set locale
  messageResolver,
  fallbackLocale: "en", // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
});
const app = createApp(App);
// app.component("layout-default", DefaultLayout);
app.component("layout-dashboard", DashboardLayout);
app.use(store);
app.use(Antd);
app.use(router);
app.use(i18n);
router.isReady().then(() => {
  app.mount("#app");
});
