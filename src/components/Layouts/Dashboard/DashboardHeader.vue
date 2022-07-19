<template>
  <a-layout-header id="layout-dashboard-header" :class="[theme === 'dark' ? 'dashboard-header-dark' : 'dashboard-header-light']">
    <a-button id="btn-dashboard-head-toggle" type="text" @click.prevent="toggleSidebarCollapse">
      <menu-unfold-outlined
        :style="{ fontSize: '26px' }"
        v-if="sidebarCollapsed"
        :class="['trigger', theme === 'dark' ? 'dash-icon-dark' : 'dash-icon-light']"
      />
      <menu-fold-outlined :style="{ fontSize: '26px' }" v-else :class="['trigger', theme === 'dark' ? 'dash-icon-dark' : 'dash-icon-light']" />
    </a-button>
    <a-row justify="end" :gutter="16">
      <a-col >
        <a-switch id="head-switch" :checked="theme === 'dark'"  checked-children="Dark" un-checked-children="Light" @change="changeTheme" />
      </a-col>
      <a-col>
        <Setting :theme="theme" />
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script >
import { defineComponent } from "vue";
import { MenuUnfoldOutlined, MenuFoldOutlined,BulbFilled } from "@ant-design/icons-vue";
import Setting from "./../../Setting/index.vue";
export default defineComponent({
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    Setting,BulbFilled
  },
  props: {
    sidebarCollapsed: { type: Boolean, default: false },
    theme: { type: String, default: "dark" },
    langs: { type: Array, default: [] },
  },
  setup(props, { emit }) {
    const toggleSidebarCollapse = () => {
      emit("update:sidebarCollapsed", !props.sidebarCollapsed);
    };
    const changeTheme = (checked) => {
      emit("update:theme", checked ? "dark" : "light");
    };
    return { toggleSidebarCollapse, changeTheme };
  },
});
</script>

<style scoped>
/* #head-switch {
  position: absolute;
  right: 0;
  margin-top: 20px;
  margin-right: 15px;
} */
</style>