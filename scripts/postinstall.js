const path = require('path');
const { spawnSync } = require('child_process');

require('../lib/install').run();

spawnSync(process.execPath, [path.join(__dirname, '../bin/g2w.js')], { stdio: 'inherit' });
