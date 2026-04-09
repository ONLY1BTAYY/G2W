#!/usr/bin/env node

const { LOGO } = require('../lib/logo');
const [,, command = 'help'] = process.argv;

if (command === 'install') {
  require('../lib/install').run();
} else if (command === 'update') {
  require('../lib/install').update();
} else if (command === 'power-ups' || command === 'powerups') {
  require('../lib/install').powerups();
} else if (command === 'uninstall') {
  require('../lib/install').uninstall();
} else {
  process.stdout.write(`${LOGO}
Usage:
  g2w update     — update skills, hooks, and tools to latest
  g2w power-ups  — show optional tools and setup links
  g2w uninstall  — remove G2W

`);
}
