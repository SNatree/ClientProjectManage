import axios from "axios";
import routes from "./../../routes.js";
import { uLocalStorage } from "./../uLocalStorage/index.js";
import { stringify } from "querystring";
const uLos = new uLocalStorage();

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest.url !== `${import.meta.env.VITE_API_V1}/account/login`) {
      uLos.clearToken();
      // routes.push("/login");
      const useSSL = import.meta.env.VITE_USESSL === "true";
      window.location.href = `${useSSL ? "https://" : "http://"}${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/`;
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default function uAxios() {
  const defaultHeaders = {
    "content-type": "application/x-www-form-urlencoded",
    "x-access-token": `${uLos.getAccessToken()}`,
    "x-refresh-token": `${uLos.getRefeshToken()}`,
  };

  const GET = async (url, { query = {}, params = {}, headers = {}, fullURL = false } = {}) => {
    let resp = {};
    headers = { ...defaultHeaders, ...headers }; /**spread operator [ES6]*/
    if (Object.keys(query).length > 0) {
      url = `${url}?${stringify(query)}`; /**Template literals or Template String */
    }

    const options = {
      method: "GET",
      headers: headers,
      url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
      params,
    };

    try {
      resp = await axios(options);
    } catch (error) {
      resp = error["response"];
    }
    return resp;
  };

  const POST = async (url, { data = {}, query = {}, params = {}, headers = {}, fullURL = false } = {}) => {
    let resp = {};
    headers = { ...defaultHeaders, "content-type": "application/json", ...headers };
    //   "content-type": "application/json; charset=utf-8;",
    if (Object.keys(query).length > 0) {
      url = `${url}?${stringify(query)}`;
    }
    const options = {
      method: "POST",
      headers: headers,
      url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
      params,
      data,
    };
    try {
      resp = await axios(options);
    } catch (error) {
      resp = error["response"];
    }
    return resp;
  };

  const PUT = async (url, { data = {}, query = {}, params = {}, headers = {}, fullURL = false } = {}) => {
    let resp = {};
    headers = { ...defaultHeaders, "content-type": "application/json", ...headers };
    if (Object.keys(query).length > 0) {
      url = `${url}?${stringify(query)}`;
    }
    const options = {
      method: "PUT",
      headers: headers,
      url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
      params,
      data,
    };
    try {
      resp = await axios(options);
    } catch (error) {
      resp = error["response"];
    }
    return resp;
  };

  const PATCH = async (url, { data = {}, query = {}, params = {}, headers = {}, fullURL = false } = {}) => {
    let resp = {};
    headers = { ...defaultHeaders, "content-type": "application/json", ...headers };
    if (Object.keys(query).length > 0) {
      url = `${url}?${stringify(query)}`;
    }
    const options = {
      method: "PATCH",
      headers: headers,
      url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
      params,
      data,
    };

    try {
      resp = await axios(options);
    } catch (error) {
      resp = error["response"];
    }
    return resp;
  };

  const DELETE = async (url, { query = {}, params = {}, headers = {}, fullURL = false } = {}) => {
    let resp = {};
    headers = { ...defaultHeaders, ...headers };
    if (Object.keys(query).length > 0) {
      url = `${url}?${stringify(query)}`;
    }

    const options = {
      method: "DELETE",
      headers: headers,
      url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
      params,
    };
    try {
      resp = await axios(options);
    } catch (error) {
      resp = error["response"];
    }
    return resp;
  };

  const DOWNLOAD = async (url, { query = {}, params = {}, headers = {}, responseType = "blob", fullURL = false } = {}) => {
    let resp = {};
    headers = { ...defaultHeaders, ...headers }; /**spread operator [ES6]*/
    if (Object.keys(query).length > 0) {
      url = `${url}?${stringify(query)}`; /**Template literals or Template String */
    }

    const options = {
      method: "GET",
      headers: headers,
      url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
      params,
      responseType: responseType,
    };
    try {
      resp = await axios(options);
    } catch (error) {
      resp = error["response"];
    }
    return resp;
  };

  return {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    DOWNLOAD,
  };
}

// function useAxios() {
//   const uLos = new uLocalStorage();
//   this.defaultHeaders = {
//     "content-type": "application/x-www-form-urlencoded",
//     "x-access-token": `${uLos.getAccessToken()}`,
//     "x-refresh-token": `${uLos.getRefeshToken()}`,
//   };
// }

// useAxios.prototype.GET = function (url, { query = {}, params = {}, headers = {}, fullURL = false } = {}) {
//   headers = { ...this.defaultHeaders, ...headers }; /**spread operator [ES6]*/
//   if (Object.keys(query).length > 0) {
//     url = `${url}?${stringify(query)}`; /**Template literals or Template String */
//   }

//   const options = {
//     method: "GET",
//     headers: headers,
//     url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
//     params,
//   };
//   return axios(options);
// };

// useAxios.prototype.POST = function (url, { data = {}, query = {}, params = {}, headers = {}, fullURL = false } = {}) {
//   headers = { "content-type": "application/json", ...headers };
//   //   "content-type": "application/json; charset=utf-8;",
//   if (Object.keys(query).length > 0) {
//     url = `${url}?${stringify(query)}`;
//   }
//   const options = {
//     method: "POST",
//     headers: headers,
//     url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
//     params,
//     data,
//   };
//   // (async () => {
//   //   resp = await axios(options);
//   // })();
//   return axios(options);
// };

// useAxios.prototype.PUT = function (url, { data = {}, query = {}, params = {}, headers = {}, fullURL = false } = {}) {
//   headers = { "content-type": "application/json", ...headers };
//   if (Object.keys(query).length > 0) {
//     url = `${url}?${stringify(query)}`;
//   }
//   const options = {
//     method: "PUT",
//     headers: headers,
//     url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
//     params,
//     data,
//   };
//   return axios(options);
// };

// useAxios.prototype.PATCH = function (url, { data = {}, query = {}, params = {}, headers = {}, fullURL = false } = {}) {
//   headers = { "content-type": "application/json", ...headers };
//   if (Object.keys(query).length > 0) {
//     url = `${url}?${stringify(query)}`;
//   }
//   const options = {
//     method: "PATCH",
//     headers: headers,
//     url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
//     params,
//     data,
//   };
//   return axios(options);
// };

// useAxios.prototype.DELETE = function (url, { query = {}, params = {}, headers = {}, fullURL = false } = {}) {
//   headers = { ...this.defaultHeaders, ...headers };
//   if (Object.keys(query).length > 0) {
//     url = `${url}?${stringify(query)}`;
//   }

//   const options = {
//     method: "DELETE",
//     headers: headers,
//     url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
//     params,
//   };
//   return axios(options);
// };

// useAxios.prototype.DOWNLOAD = function (url, { query = {}, params = {}, headers = {}, responseType = "blob", fullURL = false } = {}) {
//   headers = { ...this.defaultHeaders, ...headers }; /**spread operator [ES6]*/
//   if (Object.keys(query).length > 0) {
//     url = `${url}?${stringify(query)}`; /**Template literals or Template String */
//   }

//   const options = {
//     method: "GET",
//     headers: headers,
//     url: fullURL ? `${url}` : `${import.meta.env.VITE_API_V1}${url}`,
//     params,
//     responseType: responseType,
//   };
//   return axios(options);
// };

// export const uAxios = useAxios;
// export default uAxios;
