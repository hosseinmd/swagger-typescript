import Axios from "axios";

async function getSwaggerJson(url: string) {
  const { data } = await Axios.get(url);
  
  return data;
}

export { getSwaggerJson };
