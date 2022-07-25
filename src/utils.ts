import { Config } from "./types";
import { exec } from "child_process";

function isAscending(a: string, b: string) {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
}

function majorVersionsCheck(expectedV: string, inputV?: string) {
  if (!inputV) {
    throw new Error(
      `Swagger-Typescript working with openApi v3/ swagger v2, seem your json is not openApi openApi v3/ swagger v2`,
    );
  }

  const expectedVMajor = expectedV.split(".")[0];
  const inputVMajor = inputV.split(".")[0];
  function isValidPart(x: string) {
    return /^\d+$/.test(x);
  }
  if (!isValidPart(expectedVMajor) || !isValidPart(inputVMajor)) {
    throw new Error(
      `Swagger-Typescript working with openApi v3/ swagger v2 your json openApi version is not valid "${inputV}"`,
    );
  }

  const expectedMajorNumber = Number(expectedVMajor);
  const inputMajorNumber = Number(inputVMajor);

  if (expectedMajorNumber <= inputMajorNumber) {
    return;
  }

  throw new Error(
    `Swagger-Typescript working with openApi v3/ swagger v2 your json openApi version is ${inputV}`,
  );
}

function isMatchWholeWord(stringToSearch: string, word: string) {
  return new RegExp("\\b" + word + "\\b").test(stringToSearch);
}

async function getCurrentUrl({ url, branch: branchName }: Config) {
  const urls = url as Exclude<Config["url"], undefined | string>;
  if (!branchName) {
    branchName = await execAsync("git branch --show-current");

    branchName = branchName?.split("/")[0];

    branchName = urls.find((item) => branchName === item.branch)?.branch;
  }
  if (!branchName) {
    branchName = (await getSourceBranch()).find((treeItem) =>
      urls.find((item) => treeItem === item.branch),
    ) as string;
  }

  const currentUrl =
    urls.find((item) => branchName === item.branch)?.url || urls[0].url;

  return currentUrl;
}

async function getSourceBranch() {
  const result = await execAsync('git log --format="%D"');
  const branchesTree = result
    .split("\n")
    .flatMap((item) => item.split(", "))
    .map((branch) => {
      branch = branch.trim();

      branch = branch.replace("HEAD -> ", "");
      branch = branch.trim();

      return branch;
    });

  return branchesTree;
}

async function execAsync(command: string) {
  return new Promise<string>((resolve, reject) => {
    const child = exec(command, (error, stdout) => {
      child.kill();
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });
}

export { getCurrentUrl, majorVersionsCheck, isAscending, isMatchWholeWord };
