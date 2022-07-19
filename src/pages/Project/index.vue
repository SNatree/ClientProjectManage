<template>
  <div id="dv-project-card">
    <a-page-header :title="appName" sub-title="">
      <template #tags>
        <a-tag color="red">DEV</a-tag>
      </template>
      <template #extra>
        <a-button key="2" type="primary" :disabled="activeKey === '3'" @click="onUploadClick">Upload</a-button>
        <a-button key="1" type="dashed" danger>Delete</a-button>
      </template>
      <a-row>
        <a-tabs v-model:activeKey="activeKey" style="width: 100%">
          <a-tab-pane key="1">
            <template #tab>
              <span>
                <!-- <apple-outlined /> -->
                Source Code
              </span>
            </template>
            <div class="page-header-file">
              <a-page-header :breadcrumb="{ routes }" @click="onRouteClick" style="padding-left: 8px" />
            </div>
            <a-table :columns="columns" :data-source="projectFiles" size="small" :pagination="false" :loading="loading">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'filename'">
                  <span>
                    <FileOutlined v-if="!record.isdir" />
                    <FolderFilled style="color: orange" v-if="record.isdir" />

                    <a class="ant-dropdown-link" @click="onOpenDirClick(record.filename)">
                      {{ record.filename }}
                    </a>
                  </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <span>
                    <a-popconfirm
                      :title="`Are you sure delete ${record.isdir ? 'directory' : 'file'} ${record.filename}?`"
                      ok-text="Yes"
                      cancel-text="No"
                      @confirm="onRemoveClick(record)"
                      @cancel="() => {}"
                    >
                      <a-button type="link" shape="circle">
                        <template #icon> <DeleteFilled style="color: #d2042d" /></template>
                      </a-button>
                    </a-popconfirm>
                  </span>
                </template>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <span>
                <!-- <android-outlined /> -->
                Publish
              </span>
            </template>
            <comPublish :appname="appName" />
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #tab>
              <span>
                <upload-outlined />
                Upload
              </span>
            </template>
            <div class="page-header-file">
              <a-page-header :breadcrumb="{ routes }" @click="onRouteClick" style="padding-left: 8px" />
            </div>
            <comUpload :newProject="projectFiles.length === 0" :appsRoute="routes" @onUploaded="onUploaded" />
          </a-tab-pane>
          <a-tab-pane key="4">
            <template #tab>
              <span>
                <fund-filled />
                Monitoring
              </span>
            </template>
          </a-tab-pane>
        </a-tabs>
      </a-row>
    </a-page-header>

    <!-- <a-skeleton :loading="loading" active avatar>
      <span>Loading</span>
    </a-skeleton> -->
  </div>
</template>

<script >
import { defineComponent, ref, reactive, onMounted, toRefs, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { uLocalStorage } from "./../../services/index.js";
import uAxios from "./../../services/uAxios/index.js";
import { DeleteFilled, FileOutlined, FolderFilled, UploadOutlined, FundFilled } from "@ant-design/icons-vue";
import comUpload from "./../../components/Upload/index.vue";
import comPublish from "./../../components/publish/index.vue";

const columns = [
  {
    key: "filename",
    title: "Filename",
    dataIndex: "filename",
  },
  {
    key: "modified",
    title: "Create Date",
    dataIndex: "modified",
    width: 200,
  },
  {
    key: "size",
    title: "Size",
    dataIndex: "size",
    width: 100,
  },

  {
    key: "action",
    title: "Actions",
    dataIndex: "action",
    width: 80,
  },
];
export default defineComponent({
  components: {
    DeleteFilled,
    FileOutlined,
    FolderFilled,
    UploadOutlined,
    comUpload,
    comPublish,
    FundFilled,
  },
  setup() {
    const router = useRoute();
    const { GET, POST, DELETE } = uAxios();
    const appName = router["query"]["appname"] || "";
    const { t, locale } = useI18n();
    const loading = ref(true);
    const activeKey = ref("1");
    const dataState = reactive({ projectFiles: [], directFile: [], routes: [] });
    const uploadAppsPathUrl = ref(`${appName}`);

    (async () => {
      const caProject = await GET(`/project?apppath=${appName}`);
      if (caProject["status"] === 200) {
        const resData = caProject["data"] || [];
        const projObj = resData.sort(function (a, b) {
          return a["sortno"] - b["sortno"];
        });
        dataState.directFile = [...projObj];
        dataState.projectFiles = projObj.map((m, i) => {
          return {
            key: i,
            filename: m["filename"],
            size: m["size"],
            isdir: m["isdir"],
            modified: m["modified"],
          };
        });
        defaultRoute();
      }
      loading.value = false;
    })([]);

    const defaultRoute = () => {
      if (dataState.routes.length === 0) {
        dataState.routes.push({
          path: `${dataState.routes.length + 1}`,
          breadcrumbName: `${appName}`,
        });
        uploadAppsPathUrl.value = dataState.routes.map((m) => m["breadcrumbName"]).join(",");
      }
    };

    const reloadProject = async () => {
      loading.value = true;
      dataState.projectFiles = [];
      defaultRoute();

      const routePath = [...dataState.routes.map((m) => m["breadcrumbName"])].join(",");
      const caLoadRoutePath = await GET(`/project?apppath=${routePath}`);

      if (caLoadRoutePath["status"] === 200) {
        if (caLoadRoutePath["data"].length > 0) {
          const projObj = caLoadRoutePath["data"].sort(function (a, b) {
            return a["sortno"] - b["sortno"];
          });
          dataState.projectFiles = projObj.map((m, i) => {
            return {
              key: i,
              filename: m["filename"],
              size: m["size"],
              isdir: m["isdir"],
              modified: m["modified"],
            };
          });
        }
      }
      loading.value = false;
    };

    const onOpenDirClick = async (dirname) => {
      const list = dataState.directFile.filter((f) => f["filename"] === dirname);
      const isExists = dataState.routes.filter((f) => f["breadcrumbName"] === dirname).length > 0;
      defaultRoute();
      if (!isExists) {
        dataState.routes.push({
          path: `${dataState.routes.length + 1}`,
          breadcrumbName: dirname,
        });
      }
      await reloadProject();
    };

    const onRouteClick = async () => {
      dataState.routes.pop(-1);
      await reloadProject();
    };

    const onRemoveClick = async (item) => {
      let routePath = [...dataState.routes.map((m) => m["breadcrumbName"])];
      if (routePath === "") {
        routePath.push(appName);
      }
      routePath.push(item["filename"]);
      // console.log("delete :>> ", `/project/remove?apppath=${routePath}&isdir=${item["isdir"]}`);

      const caRemove = await DELETE(`/project/remove-file?apppath=${routePath}&isdir=${item["isdir"]}`);
      if (caRemove["status"] === 200) {
        await reloadProject();
      }
    };

    const onUploadClick = () => (activeKey.value = "3");
    const onUploaded = async ({ files, success }) => {
      if (success) await reloadProject();
    };

    return {
      ...toRefs(dataState),
      t,
      appName,
      loading,
      activeKey,
      columns,
      uploadAppsPathUrl,
      onOpenDirClick,
      onRouteClick,
      onRemoveClick,
      onUploadClick,
      onUploaded,
    };
  },
});
</script>

<style>
@import "./../../styles/css/project/_project.css";
</style>