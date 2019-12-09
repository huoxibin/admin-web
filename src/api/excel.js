import { get } from "@/utils/request";
import store from "@/store";
/**
 * @param { string } path 路径
 * @param { object } data 携带数据
 */
const exportExcel = (path, data) => {
  const realm = process.env.VUE_APP_URL;
  const version = process.env.VUE_APP_VERSION;
  const urlData = [];
  for (let item in data) {
    urlData.push(`${item}=${data[item]}`);
  }
  const url = `${realm}${path}?&version=${version}&accessToken=${
    store.getters.accessToken
  }&${urlData.join("&")}`;
  get("/data/exportExecl", { url }).then(res => {
    window.location.href = res.data.url;
  });
};

export default exportExcel;
