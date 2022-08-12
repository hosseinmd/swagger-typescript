import Axios from "axios";
import { readFileSync } from "fs";
import yaml from "js-yaml";

async function getJson(url: string) {
  let input;
  if (url.startsWith("http")) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const { data } = await Axios.get(url);

    // if url is yaml file convert it to json
    input = data;
  } else {
    const data = readFileSync(url).toString();
    input = data;
  }

  if (typeof input === "object") {
    return input;
  } else if (url.endsWith("json")) {
    return JSON.parse(input);
  }
  return yaml.load(input);
}

export { getJson };
