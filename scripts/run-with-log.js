const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Usage: node scripts/run-with-log.js <log-file-name> [--env KEY=VALUE ...] -- <command> [args...]
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node scripts/run-with-log.js <log-file-name> [--env KEY=VALUE ...] -- <command> [args...]");
  process.exit(1);
}

const logFile = args[0];
let envVars = { ...process.env };
let cmdIndex = -1;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--') {
    cmdIndex = i + 1;
    break;
  }
  if (args[i] === '--env' && i + 1 < args.length) {
    const pair = args[i + 1];
    const eqIdx = pair.indexOf('=');
    if (eqIdx !== -1) {
      const key = pair.substring(0, eqIdx);
      const val = pair.substring(eqIdx + 1);
      envVars[key] = val;
    }
    i++;
  }
}

if (cmdIndex === -1 || cmdIndex >= args.length) {
  // If no '--' separator is found, treat everything after logFile as the command and args
  cmdIndex = 1;
}

const command = args[cmdIndex];
const cmdArgs = args.slice(cmdIndex + 1);

const logPath = path.resolve(process.cwd(), logFile);
// Make sure parent directory exists for log file
fs.mkdirSync(path.dirname(logPath), { recursive: true });

const logStream = fs.createWriteStream(logPath, { flags: 'a' });

console.log(`Running: ${command} ${cmdArgs.join(' ')} (logging to ${logFile})`);

const child = spawn(command, cmdArgs, {
  shell: true,
  env: envVars,
  stdio: ['inherit', 'pipe', 'pipe']
});

child.stdout.on('data', (data) => {
  process.stdout.write(data);
  logStream.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
  logStream.write(data);
});

child.on('close', (code) => {
  logStream.end();
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error(`Failed to start child process: ${err.message}`);
  logStream.end();
  process.exit(1);
});
