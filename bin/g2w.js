#!/usr/bin/env node

const [,, command = 'help'] = process.argv;

if (command === 'install') {
  require('../lib/install').run();
} else if (command === 'update') {
  require('../lib/install').update();
} else if (command === 'uninstall') {
  require('../lib/install').uninstall();
} else {
  console.log(`
G2W — It's going to work or it's going to work.

Usage:
  g2w install    — set up G2W (choose global or local)
  g2w update     — update skills to latest version
  g2w uninstall  — remove G2W
`);
}
