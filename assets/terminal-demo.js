const o = '\x1b[0m';
const bold = '\x1b[1m';
const dim = '\x1b[2m';
const orange = '\x1b[38;5;208m';
const purple = '\x1b[38;5;141m';
const cyan = '\x1b[38;5;51m';
const white = '\x1b[97m';
const gray = '\x1b[90m';

const width = 38;
const line = '─'.repeat(width);

function card(color, num, icon, name, tagline, desc, vibes) {
  console.log(color + '┌' + line + '┐' + o);
  console.log(color + '│' + o + '  ' + icon + '  ' + bold + white + name.padEnd(width - 6) + o + color + '│' + o);
  console.log(color + '│' + o + '  ' + dim + gray + tagline.padEnd(width - 2) + o + color + '│' + o);
  console.log(color + '├' + line + '┤' + o);
  console.log(color + '│' + o + '  ' + gray + num.padEnd(width - 2) + color + '│' + o);
  console.log(color + '│' + o + ' '.repeat(width + 2) + color + '│' + o);

  // Word wrap desc to width - 4
  const words = desc.split(' ');
  let line1 = '', line2 = '';
  words.forEach(w => {
    if ((line1 + w).length < width - 6) line1 += w + ' ';
    else line2 += w + ' ';
  });
  console.log(color + '│' + o + '  ' + dim + line1.trim().padEnd(width - 2) + o + color + '│' + o);
  if (line2.trim()) console.log(color + '│' + o + '  ' + dim + line2.trim().padEnd(width - 2) + o + color + '│' + o);

  console.log(color + '│' + o + ' '.repeat(width + 2) + color + '│' + o);
  const vibeStr = vibes.map(v => color + '[' + v + ']' + o).join(' ');
  const vibeRaw = vibes.map(v => '[' + v + ']').join(' ');
  const pad = ' '.repeat(Math.max(0, width - 2 - vibeRaw.length));
  console.log(color + '│' + o + '  ' + vibeStr + pad + color + '│' + o);
  console.log(color + '│' + o + ' '.repeat(width + 2) + color + '│' + o);
  console.log(color + '│' + o + '  ' + dim + 'Choose → ' + o + bold + white + num.split('/')[0].trim() + o + ' '.repeat(width - 12) + color + '│' + o);
  console.log(color + '└' + line + '┘' + o);
  console.log();
}

console.log();
console.log(bold + white + '  G2W — build2gether' + o);
console.log(gray + '  ' + '─'.repeat(40) + o);
console.log(gray + '  Building: ' + white + 'social media monitor & runner' + o);
console.log();
console.log('  ' + bold + white + 'Who\'s building this with you?' + o);
console.log('  ' + gray + 'Pick the identity that fits how you want to work.' + o);
console.log();

card(
  orange, '01 / DATA-FIRST', '📈',
  'The Growth Engine',
  'Metrics. Velocity. ROI.',
  '"I think in metrics. I\'ll build a system that knows what\'s working before you do."',
  ['Analytics', 'Data-driven', 'ROI']
);

card(
  purple, '02 / LONG GAME', '💎',
  'The Brand Architect',
  'Voice. Consistency. Identity.',
  '"Every post is a brick. I\'ll protect your brand so everything feels like you, every time."',
  ['Brand', 'Voice', 'Identity']
);

card(
  cyan, '03 / ZERO MANUAL', '⚡',
  'The Automation Machine',
  'Pipelines. Schedules. Zero-touch.',
  '"Manual posting is dead. I\'ll wire it all together so your social media runs itself."',
  ['Auto', 'Pipelines', 'Efficient']
);

console.log(gray + '  or type your own → ' + white + 'describe the kind of builder you want' + o);
console.log();
