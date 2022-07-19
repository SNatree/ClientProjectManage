<template>
  <a-layout id="layout-dashboard">
    <!-- Main Sidebar -->
    <DashboardSidebar v-model:theme="theme" v-model:collapsed="sidebarCollapsed" :menuItems="sidebarMenuItems"></DashboardSidebar>
    <!-- / Main Sidebar -->

    <!-- Layout Content -->
    <a-layout>
      <!-- Layout Header's Conditionally Fixed Wrapper  -->
      <DashboardHeader v-model:sidebarCollapsed="sidebarCollapsed" v-model:theme="theme" :langs="langs"></DashboardHeader>
      <!-- / Layout Header's Conditionally Fixed Wrapper -->

      <!-- Page Content -->
      <a-layout-content class="layout-dashboard-content">
        <div class="content">
          <router-view />
        </div>
      </a-layout-content>
      <!-- / Page Content -->

      <!-- Layout Footer -->
      <DashboardFooter></DashboardFooter>
      <!-- / Layout Footer -->
    </a-layout>
  </a-layout>
</template>

<script >
import { defineComponent, reactive, toRefs } from "vue";
import DashboardHeader from "./../components/Layouts/Dashboard/DashboardHeader.vue";
import DashboardFooter from "./../components/Layouts/Dashboard/DashboardFooter.vue";
import DashboardSidebar from "./../components/Sidebars/DashboardSidebar.vue";
export default defineComponent({
  components: {
    DashboardHeader,
    DashboardFooter,
    DashboardSidebar,
  },
  setup(props, { emit, slots, attrs }) {
    const dataState = reactive({
      langs: ["en", "th"],
      sidebarCollapsed: false,
      sidebarMenuItems: [],
      theme: "dark",
    });

    return { ...toRefs(dataState) };
  },
});
</script>


<style>
@import "./../styles/css/layouts/_dashboard.css";
</style>