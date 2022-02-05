var git = require('git-last-commit');

exports.getLastCommit = () => new Promise(async (resolve, reject) => {
  git.getLastCommit(function (err, commit) {
    if (err) {
      return reject(err);
    }
    resolve(commit);
  });
});