import Axios from "axios";
import yaml from "js-yaml";

async function getJson(url: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const { data } = await Axios.get(url);

  // if url is yaml file convert it to json
  if (typeof data === "object") {
    return data;
  }
  return yaml.load(data);
}

export { getJson };
