#!/usr/bin/env node
// G2W Resource Limits — PreToolUse hook
// Tracks tool calls, plan revisions, and file edits per session.
// Warns at thresholds, hard blocks at limits. Logs session summaries.
// Config: ~/.g2w/resource-limits.json | State: ~/.g2w/session-limits.json

const fs = require('fs');
const path = require('path');
const os = require('os');

const G2W_DIR = path.join(os.homedir(), '.g2w');
const CONFIG_FILE = path.join(G2W_DIR, 'resource-limits.json');
const STATE_FILE = path.join(G2W_DIR, 'session-limits.json');
const LOG_FILE = path.join(G2W_DIR, 'session-log.jsonl');
const CURRENT_MD = path.join(G2W_DIR, 'CURRENT.md');

const DEFAULTS = {
  enabled: true,
  maxToolCalls: 200,
  warnAtToolCallPercent: 80,
  maxPlanRevisions: 5,
  maxFileEdits: 8,
  maxUniqueFiles: 25,
  sessionTimeoutHours: 4
};

function loadJSON(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function saveJSON(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch {}
}

function appendLog(line) {
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, JSON.stringify(line) + '\n');
  } catch {}
}

function getActiveProject() {
  try {
    const content = fs.readFileSync(CURRENT_MD, 'utf8');
    const match = content.match(/^active:\s*(.+)/m);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

function loadConfig() {
  const global = loadJSON(CONFIG_FILE, {});
  const project = getActiveProject();
  let projectConfig = {};
  if (project) {
    const projectConfigPath = path.join(G2W_DIR, 'projects', project, 'resource-limits.json');
    projectConfig = loadJSON(projectConfigPath, {});
  }
  return { ...DEFAULTS, ...global, ...projectConfig };
}

function freshState(project) {
  return {
    startedAt: new Date().toISOString(),
    project: project || 'unknown',
    counters: {
      totalToolCalls: 0,
      writes: 0,
      edits: 0,
      bashCalls: 0,
      uniqueFilesTouched: [],
      planRevisions: 0,
      fileEditCounts: {}
    },
    warnings: {
      toolCallWarningFired: false,
      planLoopWarningFired: false
    }
  };
}

function logSession(state) {
  if (!state || state.counters.totalToolCalls === 0) return;
  const start = new Date(state.startedAt);
  const now = new Date();
  const durationMinutes = Math.round((now - start) / 60000);
  appendLog({
    project: state.project,
    startedAt: state.startedAt,
    endedAt: now.toISOString(),
    totalToolCalls: state.counters.totalToolCalls,
    writes: state.counters.writes,
    edits: state.counters.edits,
    bashCalls: state.counters.bashCalls,
    uniqueFiles: state.counters.uniqueFilesTouched.length,
    planRevisions: state.counters.planRevisions,
    durationMinutes
  });
}

function isSessionExpired(state, timeoutHours) {
  if (!state || !state.startedAt) return true;
  const elapsed = (Date.now() - new Date(state.startedAt).getTime()) / 3600000;
  return elapsed > timeoutHours;
}

function output(message) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: message
    }
  }));
}

let input = '';
const stdinTimeout = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (input += chunk));
process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name;

    // Only track Write, Edit, Bash
    if (toolName !== 'Write' && toolName !== 'Edit' && toolName !== 'Bash') {
      process.exit(0);
    }

    const config = loadConfig();

    // Kill switch
    if (!config.enabled) {
      process.exit(0);
    }

    const project = getActiveProject();
    let state = loadJSON(STATE_FILE, null);

    // Reset if expired or missing
    if (!state || isSessionExpired(state, config.sessionTimeoutHours)) {
      logSession(state);
      state = freshState(project);
    }

    const c = state.counters;
    const filePath = data.tool_input?.file_path || '';
    const normalizedPath = filePath ? path.normalize(filePath) : '';

    // Increment counters
    c.totalToolCalls++;
    if (toolName === 'Write') c.writes++;
    if (toolName === 'Edit') c.edits++;
    if (toolName === 'Bash') c.bashCalls++;

    // Track unique files and per-file edits (Write/Edit only)
    if ((toolName === 'Write' || toolName === 'Edit') && normalizedPath) {
      if (!c.uniqueFilesTouched.includes(normalizedPath)) {
        c.uniqueFilesTouched.push(normalizedPath);
      }
      c.fileEditCounts[normalizedPath] = (c.fileEditCounts[normalizedPath] || 0) + 1;

      // Track PLAN.md revisions
      if (path.basename(filePath).toUpperCase() === 'PLAN.MD') {
        c.planRevisions++;
      }
    }

    // Save state before checking limits (so counters persist even on block)
    saveJSON(STATE_FILE, state);

    // --- Check limits (severity order: hard blocks first, then warnings) ---

    // Hard block: total tool calls
    if (c.totalToolCalls >= config.maxToolCalls) {
      output(
        `🛑 G2W RESOURCE LIMIT: Session hit ${c.totalToolCalls} tool calls (limit: ${config.maxToolCalls}). ` +
        'Stop and wrap up. Run /g2w:ready2save to hand off cleanly. ' +
        'To reset: delete ~/.g2w/session-limits.json'
      );
      process.exit(1);
    }

    // Hard block: plan revision loop
    if (c.planRevisions >= config.maxPlanRevisions) {
      output(
        `🛑 G2W LOOP DETECTED: PLAN.md has been revised ${c.planRevisions} times (limit: ${config.maxPlanRevisions}). ` +
        'The Visionary/Challenger loop is stuck. Stop iterating and escalate to the user. ' +
        'Ask: "The plan has been revised ' + c.planRevisions + ' times. Should we lock it as-is, break the task smaller, or take a different approach?"'
      );
      process.exit(1);
    }

    // Hard block: too many unique files (scope creep)
    if (c.uniqueFilesTouched.length >= config.maxUniqueFiles) {
      output(
        `🛑 G2W SCOPE CREEP: ${c.uniqueFilesTouched.length} unique files touched (limit: ${config.maxUniqueFiles}). ` +
        'This session is touching too many files. Stop and re-scope with the user.'
      );
      process.exit(1);
    }

    // Warning: file edit loop (specific file edited too many times)
    if (normalizedPath && c.fileEditCounts[normalizedPath] >= config.maxFileEdits && !state.warnings[`fileLoop_${normalizedPath}`]) {
      state.warnings[`fileLoop_${normalizedPath}`] = true;
      saveJSON(STATE_FILE, state);
      output(
        `⚠️ G2W FIX LOOP WARNING: "${path.basename(filePath)}" has been edited ${c.fileEditCounts[normalizedPath]} times this session. ` +
        'Possible Inspector/Builder fix loop. Consider whether the approach needs to change.'
      );
      process.exit(0);
    }

    // Warning: approaching tool call limit
    const warnThreshold = Math.floor(config.maxToolCalls * config.warnAtToolCallPercent / 100);
    if (c.totalToolCalls >= warnThreshold && !state.warnings.toolCallWarningFired) {
      state.warnings.toolCallWarningFired = true;
      saveJSON(STATE_FILE, state);
      output(
        `⚠️ G2W RESOURCE WARNING: ${c.totalToolCalls}/${config.maxToolCalls} tool calls used (${config.warnAtToolCallPercent}%). ` +
        'Start wrapping up. Consider running /g2w:ready2save soon.'
      );
      process.exit(0);
    }

    process.exit(0);
  } catch {
    process.exit(0); // never block on error
  }
});
