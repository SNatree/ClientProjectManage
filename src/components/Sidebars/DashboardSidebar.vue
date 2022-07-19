<template>
  <a-layout-sider id="sidebar-menu" v-model:collapsed="collapsed" :trigger="null" :collapsible="collapsible">
    <div class="sidebar-logo"></div>
    <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" :theme="theme">
      <a-menu-item key="1" to="/">
        <template #icon>
          <HomeOutlined />
        </template>
        <router-link to="/"> {{ t("route.home") }} </router-link>
      </a-menu-item>
      <a-menu-item key="2" to="/setting">
        <template #icon>
          <SettingOutlined />
        </template>
        <router-link to="/setting"> {{ t("route.setting") }} </router-link>
      </a-menu-item>
      <!-- <a-menu-item key="2" to="/project">
        <template #icon>
          <MailOutlined />
        </template>
        <router-link to="/project"> {{ t("route.project") }} </router-link>
      </a-menu-item> -->
      <!-- <a-menu-item key="2">
        <template #icon>
          <CalendarOutlined />
        </template>
        <router-link to="/login"> Login </router-link>
      </a-menu-item>
      <a-sub-menu key="info">
        <template #icon>
          <AppstoreOutlined />
        </template>
        <template #title>Navigation Three</template>
        <a-menu-item key="3">Option 3</a-menu-item>
        <a-menu-item key="4">Option 4</a-menu-item>
        <a-sub-menu key="sub1-2" title="Submenu">
          <a-menu-item key="5">Option 5</a-menu-item>
          <a-menu-item key="6">Option 6</a-menu-item>
        </a-sub-menu>
      </a-sub-menu> -->
      <!-- <a-sub-menu key="error">
        <template #icon>
          <SettingOutlined />
        </template>
        <template #title>Error Status</template>
        <a-menu-item key="7"> <router-link to="/:catchAll(.*)"> 404 </router-link></a-menu-item>
      </a-sub-menu> -->
    </a-menu>
  </a-layout-sider>
</template>

<script >
import { defineComponent, ref, toRefs, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { MailOutlined, CalendarOutlined, AppstoreOutlined, SettingOutlined,HomeOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: {
    HomeOutlined,
    CalendarOutlined,
    AppstoreOutlined,
    SettingOutlined,
  },
  props: {
    collapsed: { type: Boolean, default: false },
    collapsible: { type: Boolean, default: true },
    theme: { type: String, default: "dark" },
    menuItems: { type: Array, default: [] },
  },
  setup(props) {
    const router = useRouter();
    const { t, locale } = useI18n();
    const currPath = router.currentRoute.value;
    const dataState = reactive({
      selectedKeys: ["1"],
      openKeys: ["error"],
    });

    // load menu
    // ;(async () => {
    //       for (let index = 0; index < props.menus.length; index++) {
    //           const menu = props.menus[index]

    //           if (menu['is_system'] !== false) continue
    //           const componentPath = menu['component_path']
    //           console.log('object :>> ', new URL('./404/index.vue', import.meta.url));
    //           const page = (await import(/* @vite-ignore */ `./../../pages/404/index.vue`))
    //           router.addRoute({
    //               name: `${menu['name']}`,
    //               path: `${menu['path']}`,
    //               // component: () => import(`./../../pages${menu['component_path']}.vue`),
    //               component: () => page,
    //               meta: {
    //                   layout: `${menu['layout']}`,
    //                   requiresAuth: menu['requires_auth'],
    //               },
    //           })
    //       }

    //       await router.isReady()
    //       selectedKeys.value = [currPath['path']]
    //       router.push(`${currPath['path']}`)
    //   })()

    return { ...toRefs(dataState), t };
  },
});
</script>

<style>
</style>