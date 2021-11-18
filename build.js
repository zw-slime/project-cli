// build.js
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const packages = fs.readdirSync(path.join(__dirname, './packages'));

packages.forEach((package) => {
  const targetPath = path.join(__dirname, './packages', package);

  console.log(`build ${targetPath} ...`);
  childProcess.execSync('rm -rf build', {
    cwd: targetPath,
  });
  childProcess.execSync('yarn build', {
    cwd: targetPath,
  });
});
