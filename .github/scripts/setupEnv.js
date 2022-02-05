const core = require('@actions/core');
const fs = require('fs');
const { setEnvironmentVariable } = require('./envCreator');
const environmentVariables = require('./envVars');
// const { getVersionNumber } = require('./sssApi');
const { getLastCommit } = require('./getCurrentCommit');
const branchRef = process.env.GITHUB_REF;
const branchRefSplit = branchRef.split('/')
const branch = branchRefSplit[branchRefSplit.length - 1]
let exportEnv = environmentVariables[branch].variables;

(async () => {
  try {
    // const release = await getVersionNumber(branch);
    const currentVersion = '0.1';
    const lastCommit = await getLastCommit();
    const lastCommitHash = lastCommit.hash
    const lastCommitShortHash = lastCommit.shortHash;
    const packageName = `${currentVersion}-${lastCommitHash}`
    const ebVersionLabel = `${currentVersion}-${lastCommitShortHash}-${Date.now()}`;
    // console.log(release);
    // exportEnv.push({
    //   key: "SENTRY_RELEASE",
    //   value: currentVersion
    // });
    exportEnv.push({
      key: "DEPLOYMENT_PACKAGE_NAME",
      value: packageName
    });
    exportEnv.push({
      key: "DEPLOYMENT_CURRENT_BRANCH",
      value: branch
    });
    exportEnv.push({
      key: "GIT_SHORT_HASH",
      value: lastCommitShortHash
    });
    exportEnv.push({
      key: "AWS_EB_VERSION",
      value: ebVersionLabel
    });
    for (const i of exportEnv) {
      console.log(i);
      setEnvironmentVariable(i.key, i.value);
    }
  } catch (error) {
    core.setFailed(error.message);
    process.exit(1);
  }
})();
