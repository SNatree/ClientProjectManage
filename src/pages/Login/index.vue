<template>
  <div id="login-main-card">
    <a-row justify="center" align="center" :style="{ marginTop: '8rem', padding: '1rem' }">
      <a-col :xs="24" :sm="18" :md="12" :lg="8" :xl="7" :xxl="6">
        <a-card id="login-content">
          <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item :label="t('label.username')" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
              <a-input v-model:value="formState.username">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item :label="t('label.password')" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
              <a-input-password v-model:value="formState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <div class="login-form-wrap">
              <!-- <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
              </a-form-item> -->
              <a class="login-form-forgot" href="">{{ t("label.forgotpassword") }}</a>
            </div>

            <a-form-item>
              <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button"> {{ t("label.login") }}</a-button>
              Or
              <a href="">{{ t("label.registeracccount") }}</a>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script >
import { defineComponent, reactive, computed, ref } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { uLocalStorage } from "./../../services/index.js";
import uAxios from "./../../services/uAxios/index.js";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },

  setup() {
    const { t, locale } = useI18n();

    const { POST } = uAxios();
    const formState = reactive({
      username: "u1234",
      password: "P@ssw0rd",
      remember: true,
    });

    const onFinish = async (values) => {
      const caLogin = await POST("/account/login", {
        data: {
          ...formState,
        },
      });
      if (caLogin["status"] === 200) {
        const uLos = new uLocalStorage();
        uLos.setToken(caLogin["data"]);
        const useSSL = import.meta.env.VITE_USESSL === "true";
        window.location.href = `${useSSL ? "https://" : "http://"}${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/`;
      
      }
    };

    const onFinishFailed = async (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    const disabled = computed(() => {
      return !(formState.username && formState.password);
    });
    return {
      t,
      formState,
      onFinish,
      onFinishFailed,
      disabled,
    };
  },
});
</script>

<style scoped>
@import "./../../styles/css/login/_login.css";
</style>