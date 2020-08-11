const { default: Axios } = require("axios");
const fs = require("fs");

Axios.get("http://94.182.181.229:8090/swagger/v1/swagger.json").then(
  ({ data }) => {
    fs.writeFileSync("swagger.json", JSON.stringify(data));
  }
);
