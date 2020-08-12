import Axios from "axios";

async function getSwaggerJson(url: string) {
  const { data } = await Axios.get(url);
  // fs.writeFileSync("swagger.json", JSON.stringify(data));

  return data;
}

export { getSwaggerJson };
