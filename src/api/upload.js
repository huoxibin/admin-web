import { get } from "@/utils/request";

// 获取上传时携带的参数
const getOption = () => get("/data/my", { pathL: "/ap/aliyunOss/getPolicy" });

export { getOption };
