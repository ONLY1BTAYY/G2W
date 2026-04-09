const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// --- Name resolution ---

const PROFILE_FILE = path.join(os.homedir(), '.g2w', 'profile.json');

function loadProfile() {
  try {
    return JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveProfile(data) {
  fs.mkdirSync(path.dirname(PROFILE_FILE), { recursive: true });
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(data, null, 2));
}

function getName() {
  const profile = loadProfile();
  if (profile.name) return profile.name;

  // Try git config (skip if it looks like a handle — no spaces, all caps, etc.)
  try {
    const gitName = execSync('git config user.name', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    if (gitName && gitName.includes(' ')) return gitName.split(' ')[0];
  } catch {}

  return os.userInfo().username;
}

function setName(name) {
  const profile = loadProfile();
  profile.name = name;
  saveProfile(profile);
}

// --- Quote bank ---

const QUOTES = [
  // With "Remember, {name}..." prefix
  { text: "If you don't decide who you are, someone else will do it for you.", author: "Ocean Veau", prefixed: true },
  { text: "Life is not only about ourselves, it's about the impact we have on others.", prefixed: true },
  { text: "As a man thinketh in his heart, so is he. So whatever you believe you are — you're right.", prefixed: true },
  { text: "Great things are done by a series of small things brought together. One brick at a time my friend. You got this.", prefixed: true },
  { text: "What other people think of you is none of your business. Besides, it's not like they got anything better to talk about. :)", prefixed: true },
  { text: "Next time you look up into the stars, remember that you're looking at a mirror.", author: "Ocean Veau", prefixed: true },
  { text: "Money only has purpose & meaning when a human touches it so... who really has the power?", prefixed: true },
  { text: "It's going to work or it's going to work. Ain't no other options my friend.", prefixed: true },

  // Standalone
  { text: "A man grows by the greatness of his task.", prefixed: false },
  { text: "If you do what's easy, your life will be hard. But if you do what's hard, your life will be easy.", prefixed: false },
  { text: "Sometimes good things fall apart so better things can fall together.", prefixed: false },
  { text: "Ego says: \"Once everything falls into place, I'll feel peace.\" Spirit says: \"Find peace and everything will fall into place.\"", prefixed: false },
  { text: "Be kind, not nice. Nice is a mask that even your worst enemy can wear.", author: "Ocean Veau", prefixed: false },
  { text: "Rules were made to be broken, but principle will get you where you need to go.", author: "Ocean Veau", prefixed: false },
  { text: "The best time to plant a tree was 20 years ago. The second best time is right now.", author: "Chinese Proverb", prefixed: false },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", prefixed: false },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", prefixed: false },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche", prefixed: false },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", prefixed: false },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell", prefixed: false },
  { text: "You can't build a reputation on what you're going to do.", author: "Henry Ford", prefixed: false },
  { text: "Everybody wants to be a beast until it's time to do what beasts do.", prefixed: false },
  { text: "A society grows great when old men plant trees in whose shade they shall never sit.", author: "Greek Proverb", prefixed: false },
  { text: "They tried to bury us. They didn't know we were seeds.", author: "Mexican Proverb", prefixed: false },
  { text: "What you leave behind is not what is engraved in stone monuments, but what is woven into the lives of others.", author: "Pericles", prefixed: false },
];

function getCloseQuote() {
  const name = getName();
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const attribution = quote.author ? `  — ${quote.author}` : '';

  if (quote.prefixed) {
    return `\x1b[2m  Remember, ${name}... ${quote.text}${attribution}\x1b[0m`;
  }
  return `\x1b[2m  "${quote.text}"${attribution}\x1b[0m`;
}

// --- Greeting ---

function getGreeting() {
  const name = getName();
  return `\x1b[1m  Hey ${name}, let's make an impact and make some money while we're doing it.\x1b[0m
\x1b[2m  What are we building today?\x1b[0m`;
}

// --- Streak tracking ---

const STREAK_DIR = path.join(os.homedir(), '.g2w');
const STREAK_FILE = path.join(STREAK_DIR, 'streak.json');

function loadStreak() {
  try {
    return JSON.parse(fs.readFileSync(STREAK_FILE, 'utf8'));
  } catch {
    return { lastDate: null, count: 0 };
  }
}

function saveStreak(data) {
  fs.mkdirSync(STREAK_DIR, { recursive: true });
  fs.writeFileSync(STREAK_FILE, JSON.stringify(data, null, 2));
}

function recordSession() {
  const today = new Date().toISOString().split('T')[0];
  const streak = loadStreak();

  if (streak.lastDate === today) {
    return streak; // Already counted today
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streak.lastDate === yesterday) {
    streak.count++;
  } else {
    streak.count = 1;
  }

  streak.lastDate = today;
  saveStreak(streak);
  return streak;
}

function getStreakMessage() {
  const streak = recordSession();
  if (streak.count < 2) return null; // No message for day 1

  const name = getName();
  if (streak.count <= 3) {
    return `\x1b[2m  ${streak.count} days in a row, ${name}. Consistency compounds.\x1b[0m`;
  }
  if (streak.count <= 7) {
    return `\x1b[2m  ${streak.count}-day streak. This is how things get built, ${name}.\x1b[0m`;
  }
  if (streak.count <= 14) {
    return `\x1b[2m  ${streak.count} days straight. Most people quit by now. You didn't.\x1b[0m`;
  }
  return `\x1b[2m  ${streak.count}-day streak. At this point, it's not discipline — it's who you are.\x1b[0m`;
}

module.exports = { getName, setName, getGreeting, getCloseQuote, getStreakMessage, recordSession };
