module.exports = {
  "release-test": {
    variables: [
      { key: "APPLICATION_ENVIRONMENT", value: `bpay101-test` },
      // { key: "SENTRY_ENVIRONMENT", value: `test` },
    ]
  },
  "release-stage": {
    variables: [
      { key: "APPLICATION_ENVIRONMENT", value: `bpay101-stage` },
      // { key: "SENTRY_ENVIRONMENT", value: `test` },
    ]
  },
  "release-prod": {
    variables: [
      { key: "APPLICATION_ENVIRONMENT", value: `bpay101-prod` },
      // { key: "SENTRY_ENVIRONMENT", value: `prod` },
    ]
  },

}