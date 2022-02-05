const core = require('@actions/core');

// const PROTECTED_INPUT_VARS = ['INPUT_OVERWRITE'];

const allowOverwrite = () => core.getInput('overwrite') === 'true';

exports.setEnvironmentVariable = (key, value) => {
  console.log(key)
  console.log(value)
  if (process.env[key] !== undefined && !allowOverwrite()) {
    throw new Error(`Unable to overwrite existing environment variable ${key}`);
  }
  core.exportVariable(key, value);
};
