import Axios from "axios";
async function getJson(url: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const { data } = await Axios.get(url);
  // fs.writeFileSync("swagger.json", JSON.stringify(data));

  return data;
}

export { getJson };
