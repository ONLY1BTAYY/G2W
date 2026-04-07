#!/usr/bin/env node

const { LOGO } = require('../lib/logo');
const [,, command = 'help'] = process.argv;

if (command === 'install') {
  require('../lib/install').run();
} else if (command === 'update') {
  require('../lib/install').update();
} else if (command === 'uninstall') {
  require('../lib/install').uninstall();
} else {
  process.stdout.write(`${LOGO}
Usage:
  g2w update     — update skills to latest version
  g2w uninstall  — remove G2W

`);
}
