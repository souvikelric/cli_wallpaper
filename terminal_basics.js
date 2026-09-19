const { renderDigit } = require("./digits");

const drawCenteredText = (lines, rows, cols) => {
  const paddingTop = Math.floor((rows - lines.length) / 2);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const padding = Math.floor((cols - line.length) / 2);

    process.stdout.write(`\x1b[${paddingTop + i + 1};${padding + 1}H${line}`);
  }
};

const bottomStatusBar = (text) => {
  const row = process.stdout.rows;
  const col = process.stdout.columns;

  const { background } = ansiColors[clockColorIndex];
  const textColor = "\x1b[30m";
  const resetColor = "\x1b[0m";

  const paddedText = text.padEnd(col, " ");
  const coloredText = `${background}${textColor}${paddedText}${resetColor}`;

  process.stdout.write(`\x1b[${row};1H\x1b[2K`); // Move to bottom row and clear it
  process.stdout.write(`\x1b[${row};1H${coloredText}`); // Write the status bar text
};

// Terminal setup
process.stdout.write("\x1b[?1049h"); // Alternate screen
process.stdout.write("\x1b[?25l"); // Hide cursor
process.stdout.write("\x1b[?7l"); // Disable scrolling

let timer;
let clockTopRow;
let clockColorIndex = 0;

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

const formatTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const cleanup = () => {
  clearInterval(timer);

  process.stdin.setRawMode(false);
  process.stdin.pause();

  process.stdout.write("\x1b[?25h");
  process.stdout.write("\x1b[?7h");
  process.stdout.write("\x1b[?1049l");

  process.exit(0);
};

const writeAt = (row, col, text) => {
  process.stdout.write(`\x1b[${row};${col}H${text}`);
};

const renderClock = () => {
  const time = formatTime();
  const digitWidth = 4;
  const separatorWidth = 1;
  const gapWidth = 1;
  const color = ansiColors[clockColorIndex].clock;
  const clockWidth = [...time].reduce(
    (width, character) =>
      width + (character === ":" ? separatorWidth : digitWidth) + gapWidth,
    -gapWidth,
  );
  const startColumn = Math.floor((process.stdout.columns - clockWidth) / 2) + 1;

  for (let row = 0; row < 5; row++) {
    writeAt(clockTopRow + row, 1, "\x1b[2K");
  }

  let column = startColumn;
  for (const character of time) {
    if (character === ":") {
      writeAt(clockTopRow + 1, column, `${color}·\x1b[0m`);
      writeAt(clockTopRow + 3, column, `${color}·\x1b[0m`);
      column += separatorWidth + gapWidth;
    } else {
      renderDigit(Number(character), clockTopRow, column, color);
      column += digitWidth + gapWidth;
    }
  }
};

const render = () => {
  process.stdout.write("\x1b[2J\x1b[H");

  const clockHeight = 5;
  clockTopRow = Math.floor((process.stdout.rows - clockHeight) / 2) + 1;
  const greeting = "Time to Code!";
  const greetingColumn =
    Math.floor((process.stdout.columns - greeting.length) / 2) + 1;

  writeAt(clockTopRow - 2, greetingColumn, greeting);
  renderClock();
  bottomStatusBar("Press t to toggle color, q to exit.");
};

const updateTimer = () => {
  renderClock();
};

render();

timer = setInterval(updateTimer, 1000);

process.stdout.on("resize", render);

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on("data", (key) => {
  const input = key.toString();

  if (input === "t") {
    clockColorIndex = (clockColorIndex + 1) % ansiColors.length;
    renderClock();
    bottomStatusBar("Press t to toggle color, q to exit.");
  } else if (input === "\u0003" || input === "q") {
    cleanup();
  }
});

process.on("SIGINT", cleanup);
