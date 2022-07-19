<template>
  <a-dropdown :trigger="['click']">
    <a-button :class="[theme === 'dark' ? 'header-btn-setting-dark' : 'header-btn-setting-light']" shape="circle" size="default" @click.prevent>
      <template #icon><UserOutlined /></template>
    </a-button>
    <template #overlay>
      <div class="card-user-setting">
        <a-skeleton :loading="loading" active avatar>
          <a-card>
            <!-- <template #cover>
            <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
          </template> -->
            <template #actions>
              <a-tooltip>
                <template #title> {{ t("label.logout") }}</template>
                <logout-outlined key="logout" @click="logout" />
              </a-tooltip>

              <a-tooltip>
                <template #title>{{ t("label.editprofile") }}</template>
                <edit-outlined key="edit" />
              </a-tooltip>

              <a-tooltip>
                <template #title>{{ t("label.settingprofile") }}</template>
                <setting-outlined key="setting" />
              </a-tooltip>
            </template>
            <a-card-meta :title="`${userInfo['username']}`">
              <template #description>
                <a-descriptions size="small">
                  <a-descriptions-item>
                    {{ userInfo["email"] }}<br />
                    {{ `${userInfo["firstname"]} ${userInfo["lastname"]}` }}
                  </a-descriptions-item>
                </a-descriptions>
              </template>
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-card-meta>
          </a-card>
        </a-skeleton>
      </div>
    </template>
  </a-dropdown>
</template>

<script >
import { defineComponent, ref } from "vue";
import { UserOutlined, SettingOutlined, EditOutlined, EllipsisOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { uLocalStorage } from "./../../services/index.js";
import uAxios from "./../../services/uAxios/index.js";
import { useI18n } from "vue-i18n";
export default defineComponent({
  components: {
    UserOutlined,
    SettingOutlined,
    EditOutlined,
    EllipsisOutlined,
    LogoutOutlined,
  },
  props: {
    theme: { type: String, default: "dark" },
  },
  setup() {
    const { t, locale } = useI18n();
    const userInfo = ref(undefined);
    const loading = ref(true);
    const { GET } = uAxios();
    (async () => {
      const caUser = await GET("/account/user");
      if (caUser["status"] === 200) {
        userInfo.value = caUser["data"][0];
      }
      loading.value = false;
    })();

    const logout = async () => {
      const caLogout = await GET("/account/logout");
      if (caLogout["status"] === 200) {
        const uLos = new uLocalStorage();
        uLos.clearToken();
        window.location.reload();
      }
    };
    return { logout, t, userInfo, loading };
  },
});
</script>

<style>
</style>

// https://www.codegrepper.com/code-examples/javascript/run+command+line+command+from+javascript