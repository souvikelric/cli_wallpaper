const ansiColors = [
  { clock: "\x1b[31m", background: "\x1b[101m" },
  { clock: "\x1b[32m", background: "\x1b[102m" },
  { clock: "\x1b[33m", background: "\x1b[103m" },
  { clock: "\x1b[34m", background: "\x1b[104m" },
  { clock: "\x1b[35m", background: "\x1b[105m" },
  { clock: "\x1b[36m", background: "\x1b[106m" },
  { clock: "\x1b[37m", background: "\x1b[107m" },
  { clock: "\x1b[91m", background: "\x1b[101m" },
  { clock: "\x1b[92m", background: "\x1b[102m" },
  { clock: "\x1b[93m", background: "\x1b[103m" },
  { clock: "\x1b[94m", background: "\x1b[104m" },
  { clock: "\x1b[95m", background: "\x1b[105m" },
  { clock: "\x1b[96m", background: "\x1b[106m" },
  { clock: "\x1b[97m", background: "\x1b[107m" },
];

const terminalSetup = () => {
  // Terminal setup
  process.stdout.write("\x1b[?1049h"); // Alternate screen
  process.stdout.write("\x1b[?25l"); // Hide cursor
  process.stdout.write("\x1b[?7l"); // Disable scrolling
};

module.exports = { ansiColors, terminalSetup };
