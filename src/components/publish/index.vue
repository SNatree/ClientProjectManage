<template>
  <div>
    <a-card :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-button type="primary" @click="onShowDrawerApp">
        <template #icon><PlusOutlined /></template>
        New Publish
      </a-button>
    </a-card>
    <div>
      <a-card :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-select
              v-model:value="publishSelect"
              label-in-value
              style="width: 100%"
              :options="publishOptions"
              @change="onPublishHandleChange"
            ></a-select>
          </a-col>
        </a-row>
        <br />
        <div v-if="publishSelectDesc.length > 0">
          <a-card>
            <a-descriptions
              bordered
              :title="`${publishSelectDesc[0]['publishenv'].toUpperCase()} : ${publishSelectDesc[0]['publishname']}`"
              size="small"
            >
              <template #extra>
                <a-button type="primary" @click="onPublishEdit">Edit</a-button>
              </template>
              <a-descriptions-item label="ENV">{{ publishSelectDesc[0]["publishenv"].toUpperCase() }}</a-descriptions-item>
              <a-descriptions-item label="Publish Name">{{ publishSelectDesc[0]["publishname"] }}</a-descriptions-item>
              <a-descriptions-item label="PID">{{ publishSelectDesc[0]["publishpid"] }}</a-descriptions-item>
              <a-descriptions-item label="Technology">{{ publishSelectDesc[0]["publishtechnology"] }}</a-descriptions-item>
              <a-descriptions-item label="Port">{{ publishSelectDesc[0]["publishport"] }}</a-descriptions-item>
              <a-descriptions-item label="Config Desc">
                {{ publishSelectDesc[0]["publishdesc"] }}
                <br />
              </a-descriptions-item>
            </a-descriptions>

            <template #actions>
              <a-row style="margin-left:10px">
                <a-button type="primary" :loading="pbloading" @click="onPublishFinish(publishSelectDesc[0])">Publish</a-button>
              </a-row>
            </template>
          </a-card>
        </div>
      </a-card>
    </div>

    <div>
      <a-drawer
        title="Publish application"
        :width="800"
        :visible="visibleDrawerApp"
        :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }"
        @close="onCloseDrawerApp"
      >
        <a-form ref="formPublishRef" :model="formState" name="form_publish" :rules="ruleState" layout="vertical" @finish="onPublishFinish">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Publish name" name="publishname">
                <a-input v-model:value="formState.publishname" autocomplete="off" placeholder="e.g. DEV" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Application Name" name="projectname">
                <a-input v-model:value="formState.projectname" autocomplete="off" disabled />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Technology" name="publishtechnology">
                <a-select v-model:value="formState.publishtechnology" placeholder="Please select technology">
                  <a-select-option value="node">Node Js</a-select-option>
                  <a-select-option value="dotnet">Dotnet</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Exec" name="publishexec">
                <a-input v-model:value="formState.publishexec" autocomplete="off" placeholder="e.g. index.js" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Description" name="publishdesc">
                <a-textarea v-model:value="formState.publishdesc" autocomplete="off" placeholder="" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="URL" name="publishurl">
                <a-input v-model:value="formState.publishurl" autocomplete="off" placeholder="e.g. http://127.0.0.1" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Swagger" name="publishswagger">
                <a-input v-model:value="formState.publishswagger" autocomplete="off" placeholder="e.g. swagger/v1" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="Port" name="publishport">
                <a-input-number v-model:value="formState.publishport" autocomplete="off" :min="0" placeholder="e.g. 5000" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider style="margin: 0" />
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item name="publishinti">
                <span style="margin-right: 20px">Init </span>
                <a-switch v-model:checked="formState.publishinti" style="margin-right: 20px" :disabled="formState.publishtechnology !== 'node'" />
                <span style="color: red">* Install node package</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider style="margin: 0" />
          <a-form-item label="Run on" name="publishenv">
            <a-radio-group v-model:value="formState.publishenv">
              <a-radio value="dev">DEV</a-radio>
              <a-radio value="prod">PROD</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="pbloading">Publish</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, reactive, ref, watch, computed } from "vue";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { message, notification } from "ant-design-vue";
import uAxios from "./../../services/uAxios/index.js";
export default defineComponent({
  components: { MinusCircleOutlined, PlusOutlined },
  props: {
    appname: { type: String, default: "" },
  },
  setup(props, { emit }) {
    const { GET, POST } = uAxios();
    const formPublishRef = ref();
    const pbloading = ref(false);
    const publishSelect = ref([]);
    const publishOptions = ref([]);
    const visibleDrawerApp = ref(false);
    let publishList = [];
    let publishSelectDesc = ref([]);

    const dataState = reactive({
      formState: {
        publishname: "",
        projectname: props["appname"], //default props["appname"]
        publishdesc: "",
        publishurl: "",
        publishswagger: "",
        publishport: null, //default null
        publishenv: "prod", //default prod
        publishtemp: "",
        publishexec: "",
        publishinti: true,
        publishtechnology: "",
      },
      ruleState: {
        publishname: [{ required: true, message: "Please enter publish name" }],
        publishport: [{ required: true, message: "Please enter publish port" }],
        publishexec: [{ required: true, message: "Please enter exec command" }],
        publishtechnology: [{ required: true, message: "Please enter technology" }],
      },
    });
    (async () => {
      const caPub = await GET(`/publish?appname=${props["appname"]}`);
      if (caPub["status"] === 200) {
        publishList = caPub["data"];
        for (let i = 0; i < caPub["data"].length; i++) {
          const pd = caPub["data"][i];
          publishOptions.value.push({ value: pd["publishname"], label: `${pd["publishenv"].toUpperCase()} : ${pd["publishname"]}` });
        }
      }
    })([]);

    const noti = (title, message, type) => {
      // success, info, warning, error
      notification[type]({
        message: `${title}`,
        description: `${message}`,
        duration: 3,
      });
    };

    const onPublishFinish = async (values) => {
      console.log("values :>> ", values);
      pbloading.value = true;
      const caPub = await POST(`/publish`, { data: { ...values, projectname: props["appname"] } });
      if (caPub["status"] === 200) {
        noti("Publish Application", "Publish application successfully ", "success");
        formPublishRef.value.resetFields();
      }
      pbloading.value = false;
    };

    const onPublishHandleChange = async (value) => {
      const pbsel = publishList.filter((f) => f["publishname"] === value["value"]);
      if (pbsel.length > 0) {
        publishSelectDesc.value.push({ ...pbsel[0] });
      }
    };

    const onShowDrawerApp = () => {
      dataState.formState = {
        publishname: "",
        projectname: props["appname"],
        publishdesc: "",
        publishurl: "",
        publishswagger: "",
        publishport: null,
        publishenv: "prod",
        publishtemp: "",
        publishexec: "",
        publishinti: true,
        publishtechnology: "",
      };
      visibleDrawerApp.value = true;
    };

    const onCloseDrawerApp = () => {
      visibleDrawerApp.value = false;
    };

    const onPublishEdit = () => {
      const props = Object.keys(dataState.formState);
      for (let i = 0; i < props.length; i++) {
        const p = props[i];
        dataState.formState[p] = publishSelectDesc.value[0][p];
      }
      dataState.formState = { ...dataState.formState, publishinti: false };
      visibleDrawerApp.value = true;
    };

    return {
      pbloading,
      formPublishRef,
      publishSelect,
      publishSelectDesc,
      publishOptions,
      visibleDrawerApp,
      onPublishFinish,
      onPublishHandleChange,
      onShowDrawerApp,
      onCloseDrawerApp,
      onPublishEdit,
      ...toRefs(dataState),
    };
  },
});
</script>


<style>
</style>