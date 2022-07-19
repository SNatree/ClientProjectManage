<template>
  <a-button type="primary" @click="showDrawerApp">
    <template #icon><PlusOutlined /></template>
    New App
  </a-button>
  <a-table :columns="columns" :data-source="appsList" size="middle" @resizeColumn="handleResizeColumn" :loading="loading">
    <!-- <template #headerCell="{ column }">
      <template v-if="column.key === 'appname'">
        <span> Project </span>
      </template>
    </template> -->

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'appname'">
        <!-- { path: '/register', query: { plan: 'private' } }
          <a class="ant-dropdown-link">
            {{ record.project }}
          </a> -->
        <router-link :to="{ path: '/project', query: { appname: record.appname } }"> {{ record.appname }} </router-link>
      </template>
      <template v-if="column.key === 'url'">
        <a-tooltip :title="`Redirect to ${record.url}`" color="cyan">
          <a class="ant-dropdown-link" :href="record.url" target="_blank">{{ record.url }}</a>
        </a-tooltip>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag v-for="tag in record.tags" :key="tag" :color="tagColorsChange(tag)">
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a href="#" class="ant-dropdown-link">
            <a-button type="primary" size="small" @click="onEditApp(record)">Edit</a-button>
          </a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="`Are you sure delete this app (${record.appname})?`"
            ok-text="Yes"
            cancel-text="No"
            @confirm="onRemoveApp(record)"
            @cancel="() => {}"
          >
            <a href="#" class="ant-dropdown-link">
              <a-button type="primary" danger size="small" :loading="removeLoading">Remove</a-button>
            </a>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>

  <div>
    <!-- DRAWER Create app -->
    <a-drawer
      title="Create a new application"
      :width="450"
      :visible="visibleDrawerApp"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="closeDrawerApp"
    >
      <!-- Form Create app -->
      <a-form ref="formCreateAppRef" :model="formCreateApp" :rules="formCreateAppRules" layout="vertical" @finish="onValidateFinish">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Application Name" name="projectname">
              <a-input
                v-model:value="formCreateApp.projectname"
                autocomplete="off"
                placeholder="Please enter application name"
                :disabled="!formCreateApp.isnew"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Application Desc" name="projectdesc">
              <a-input v-model:value="formCreateApp.projectdesc" autocomplete="off" placeholder="Please enter application description" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="URL" name="projecturl">
              <a-input v-model:value="formCreateApp.projecturl" autocomplete="off" placeholder="e.g. http://127.0.0.1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Swaager Path" name="projectswagger">
              <a-input v-model:value="formCreateApp.projectswagger" autocomplete="off" placeholder="Please enter swagger" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Port" name="projectport">
              <a-input-number v-model:value="formCreateApp.projectport" autocomplete="off" :min="0" placeholder="e.g. 5000" />
            </a-form-item>
          </a-col>
        </a-row> -->

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Tag" name="projecttag">
              <a-select v-model:value="formCreateApp.projecttag" placeholder="Please select tag">
                <a-select-option value="api">API</a-select-option>
                <a-select-option value="web">WEB</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Technology" name="projecttechnology">
              <!-- <a-input v-model:value="formCreateApp.projecttechnology" placeholder="Please enter Technology" /> -->
              <a-select v-model:value="formCreateApp.projecttechnology" placeholder="Please select technology">
                <a-select-option value="nodejs">Node Js</a-select-option>
                <a-select-option value="dotnet">Dotnet</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Owner" name="owner">
              <a-select v-model:value="form.owner" placeholder="Please a-s an owner">
                <a-select-option value="xiao">Xiaoxiao Fu</a-select-option>
                <a-select-option value="mao">Maomao Zhou</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Type" name="type">
              <a-select v-model:value="form.type" placeholder="Please choose the type">
                <a-select-option value="private">Private</a-select-option>
                <a-select-option value="public">Public</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Approver" name="approver">
              <a-select v-model:value="form.approver" placeholder="Please choose the approver">
                <a-select-option value="jack">Jack Ma</a-select-option>
                <a-select-option value="tom">Tom Liu</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="DateTime" name="dateTime">
              <a-date-picker v-model:value="form.dateTime" style="width: 100%" :get-popup-container="(trigger) => trigger.parentElement" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Description" name="description">
              <a-textarea v-model:value="form.description" :rows="4" placeholder="please enter url description" />
            </a-form-item>
          </a-col>
        </a-row> -->
        <a-space>
          <a-button type="primary" html-type="submit" :loading="createLoading">{{ formCreateApp.isnew ? "Create" : "Update" }}</a-button>
          <a-button @click="closeDrawerApp">Cancel</a-button>
        </a-space>
      </a-form>
    </a-drawer>
  </div>
</template>

<script >
import { defineComponent, reactive, ref, toRefs } from "vue";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons-vue";
import { message, notification } from "ant-design-vue";
import uAxios from "./../../services/uAxios/index.js";

export default defineComponent({
  components: {
    DeleteFilled,
    PlusOutlined,
  },
  setup() {
    const { GET, POST, DELETE } = uAxios();
    const formCreateAppRef = ref();
    const columns = ref([
      {
        dataIndex: "id",
        title: "id",
        key: "id",
        resizable: true,
        width: 80,
        minWidth: 80,
        maxWidth: 100,
      },
      {
        dataIndex: "appname",
        title: "Appication name",
        key: "appname",
        resizable: true,
        width: 350,
        minWidth: 150,
        maxWidth: 500,
      },
      // {
      //   title: "URL",
      //   key: "url",
      //   dataIndex: "url",
      //   width: 350,
      // },
      // {
      //   title: "Port",
      //   key: "port",
      //   dataIndex: "port",
      //   width: 80,
      // },
      {
        title: "Technology",
        dataIndex: "technology",
        key: "technology",
        width: 120,
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        width: 100,
      },
      {
        title: "Created Date",
        key: "createddate",
        dataIndex: "createddate",
        width: 200,
      },
      {
        title: "Action",
        key: "action",
         width: 120,
      },
    ]);

    const removeLoading = ref(false);
    const createLoading = ref(false);
    const loading = ref(false);
    const tagColors = { web: "green", api: "geekblue", loser: "volcano" };
    const dataState = reactive({
      appsList: [],
      formCreateApp: {
        // projectid: "",
        projectname: "",
        projectdesc: "",
        // projecttemp: "", //current temp upload name
        // projecturl: "",
        // projectswagger: "",
        // projectport: null,
        projecttag: "",
        projecttechnology: "",
        isnew: true,
        // isactive: true,
      },
      formCreateAppRules: {
        projectname: [{ required: true, message: "Please enter user application name" }],
        // projectport: [{ required: true, message: "Please enter user application port" }],
        projecttag: [{ required: true, message: "Please enter user application tag" }],
        projecttechnology: [{ required: true, message: "Please enter user application technology" }],
      },
    });

    const noti = (title, message, type) => {
      // success, info, warning, error
      notification[type]({
        message: `${title}`,
        description: `${message}`,
        duration: 3,
      });
    };

    const loadApplicationList = async () => {
      loading.value = true;
      dataState.appsList = [];
      const caProject = await GET(`/project/available`);
      if (caProject["status"] === 200) {
        for (let i = 0; i < caProject["data"].length; i++) {
          const app = caProject["data"][i];
          dataState.appsList.push({
            key: app["projectid"],
            id: i + 1,
            appname: app["projectname"],
            technology: app["projecttechnology"],
            // url: `${app["projecturl"]}:${app["projectport"]}/${app["projectswagger"]}`,
            // port: app["projectport"],
            tags: [app["projecttag"]],
            createddate: app["createddate"],
          });
        }
      }
      loading.value = false;
    };

    (async () => {
      await loadApplicationList();
    })([]);

    const tagColorsChange = (tag) => {
      return tagColors[tag];
    };

    const onRemoveApp = async (item) => {
      removeLoading.value = true;
      const caRemove = await DELETE(`/project/remove-app?appname=${item["appname"]}`);
      if (caRemove["status"] === 200) {
        noti("Remove Application", "Remove application successfully ", "success");
        await loadApplicationList();
      }
      removeLoading.value = false;
    };

    const onEditApp = async (item) => {
      const caProject = await GET(`/project/available?appname=${item["appname"]}`);
      if (caProject["status"] === 200) {
        const resData = caProject["data"];
        if (resData.length > 0) {
          const props = Object.keys(dataState.formCreateApp);
          for (let i = 0; i < props.length; i++) {
            const p = props[i];
            dataState.formCreateApp[p] = resData[0][p];
          }
          dataState.formCreateApp = { ...dataState.formCreateApp, isnew: false };
          showDrawerApp();
        }
      }
    };

    const visibleDrawerApp = ref(false);

    const showDrawerApp = () => {
      visibleDrawerApp.value = true;
    };

    const closeDrawerApp = () => {
      visibleDrawerApp.value = false;
    };

    const onValidateFinish = async (values) => {
      const dataForSave = { ...values, isactive: true };
      createLoading.value = true;
      let url = "/project/create";
      let title = "Create";
      if (!values["isnew"]) {
        url = "/project/update";
        title = "Update";
      }
      const caProjectCreate = await POST(`${url}`, { data: dataForSave });
      if (caProjectCreate["status"] === 200) {
        noti(`${title} Application`, `${title} application successfully`, "success");
        await loadApplicationList();
        formCreateAppRef.value.resetFields();
      }
      createLoading.value = false;
      closeDrawerApp();
    };

    return {
      formCreateAppRef,
      columns,
      tagColorsChange,
      fixedTop: ref(false),
      handleResizeColumn: (w, col) => {
        col.width = w;
      },
      onRemoveApp,
      removeLoading,
      createLoading,
      loading,
      showDrawerApp,
      closeDrawerApp,
      visibleDrawerApp,
      onValidateFinish,
      onEditApp,
      ...toRefs(dataState),
    };
  },
});
</script>

<style>
</style>