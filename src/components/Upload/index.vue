<template>
  <div>
    <a-card :bodyStyle="{ padding: '5px' }" style="margin-bottom: 5px">
      <div>
        <a-radio-group v-model:value="isInit">
          <a-radio value="0">New</a-radio>
          <a-radio value="1">Exists</a-radio>
        </a-radio-group>
      </div>
      <div style="margin-top: 10px">
        <span>Upload env: </span>
        <a-select
          v-model:value="valueEnv"
          size="small"
          label-in-value
          style="width: 120px"
          :options="selecEnvOptions"
          @change="handleSelectEnvChange"
          disabled
        ></a-select>
      </div>
    </a-card>
    <a-button type="primary" @click="onUploadClick">Upload</a-button>
    <a-upload-dragger
      v-model:fileList="fileList"
      :multiple="true"
      name="files"
      @change="handleChange"
      @drop="handleDrop"
      :beforeUpload="onBeforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <p class="ant-upload-text">Click or drag file to this area to upload</p>
      <p class="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
    </a-upload-dragger>
  </div>
</template>

<script >
import { InboxOutlined } from "@ant-design/icons-vue";
import { message, notification } from "ant-design-vue";
import { defineComponent, ref, toRefs, reactive } from "vue";
import { uLocalStorage } from "./../../services/uLocalStorage/index.js";
import uAxios from "./../../services/uAxios/index.js";
import formData from "form-data";

export default defineComponent({
  components: {
    InboxOutlined,
  },
  props: {
    newProject: { type: Boolean, default: false },
    appsRoute: { type: Array, default: [] },
  },
  emits: ["onUploaded"],
  setup(props, { emit }) {
    const uLos = new uLocalStorage();
    const isInit = ref(`${props.newProject === true ? "0" : "1"}`);
    const fileList = ref([]);
    let files = [];
    const { POST } = uAxios();
    const headers = ref({
      // "Content-Type": "multipart/form-data",
      "x-access-token": `${uLos.getAccessToken()}`,
      "x-refresh-token": `${uLos.getRefeshToken()}`,
    });

    const noti = (title, message, type) => {
      // success, info, warning, error
      notification[type]({
        message: `${title}`,
        description: `${message}`,
        duration: 3,
      });
    };

    const handleChange = (info) => {
      const status = info.file.status;
      files.push(info.file);
      // console.log("info.file :>> ", info.file);
      if (status === "removed") {
        files = files.filter((f) => f["uid"] !== info.file["uid"]);
      }
      // fd.append(`files`, info.file);
    };

    const handleDrop = (e) => {
      // console.log("handleDrop",e.target.files);
    };

    const onBeforeUpload = (file, fileList) => {
      return false;
    };

    const onUploadClick = async (ev) => {
      if (files.length === 0) {
        return;
      }
      var fd = new formData();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fd.append(`files`, file);
      }
      const routePath = [...props.appsRoute.map((m) => m["breadcrumbName"])].join(",");
      const res = await POST(`/upload?apppath=${routePath}`, {
        headers: {
          "content-type": "multipart/form-data",
        },
        data: fd,
      });
      if (res["status"] === 200) {
        noti("Upload", "Upload successfully ", "success");
        emit("onUploaded", { files, success: true });
        files = [];
        fileList.value = [];
      } else {
        noti("Upload", "Upload failed ", "error");
        emit("onUploaded", { files, success: false });
      }
    };

    const selecEnvOptions = ref([
      {
        value: "source",
        label: "Source Code",
      },
    ]);

    const valueEnv = ref({
      value: "source",
    });
    const handleSelectEnvChange = (value) => {
      console.log(value); // { key: "lucy", label: "Lucy (101)" }
    };

    return {
      handleChange,
      fileList,
      handleDrop,
      isInit,
      onBeforeUpload,
      onUploadClick,
      valueEnv,
      selecEnvOptions,
      handleSelectEnvChange,
    };
  },
});
</script>

<style>
</style>