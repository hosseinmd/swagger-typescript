import Axios from "axios";

async function getJson(url: string) {
  const { data } = await Axios.get(url);
  // fs.writeFileSync("swagger.json", JSON.stringify(data));

  return data;
}

export { getJson };
