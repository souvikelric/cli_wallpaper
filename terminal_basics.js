#!/usr/bin/env node

const { renderDigit } = require("./digits");
const { ansiColors, terminalSetup } = require("./ansi_constants");
const { menuItems, moveSelection, renderMenu } = require("./menu");
const { loadWallpaper, renderWallpaper } = require("./image_renderer");

const bottomStatusBar = (text) => {
  const row = process.stdout.rows;
  const col = process.stdout.columns;

  const { background } = ansiColors[clockColorIndex];
  const textColor = "\x1b[30m";
  const resetColor = "\x1b[0m";

  const paddedText = text.padEnd(col, " ");
  const coloredText = `${background}${textColor}${paddedText}${resetColor}`;

  process.stdout.write(`\x1b[${row};1H\x1b[2K`); // Move to bottom row and clear it
  process.stdout.write(`\x1b[${row};1H ${coloredText}`); // Write the status bar text
};

terminalSetup();

let timer;
let clockTopRow;
let clockColorIndex = 0;
let use24HourTime = true;
let menuOpen = false;
let selectedMenuItem = 0;
let wallpaper = "";
let wallpaperIndex = 0;
let wallpaperName = "";

const formatTime = () => {
  const now = new Date();
  let hours = now.getHours();

  if (!use24HourTime) {
    hours = hours % 12 || 12;
  }

  const formattedHours = String(hours).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${formattedHours}:${minutes}:${seconds}`;
};

const formatDate = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

const cleanup = () => {
  clearInterval(timer);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }
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
    writeAt(clockTopRow + row, startColumn, `\x1b[0m${" ".repeat(clockWidth)}`);
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

const renderHome = () => {
  if (wallpaper) {
    renderWallpaper(wallpaper);
  } else {
    process.stdout.write("\x1b[2J\x1b[H");
  }

  const clockHeight = 5;
  clockTopRow = Math.floor((process.stdout.rows - clockHeight) / 2) + 1;
  const greeting = "Time to Code!";
  const greetingColumn =
    Math.floor((process.stdout.columns - greeting.length) / 2) + 1;

  writeAt(clockTopRow - 2, greetingColumn, greeting);
  renderClock();

  const date = formatDate();
  const dateColumn = Math.floor((process.stdout.columns - date.length) / 2) + 1;
  writeAt(clockTopRow + 6, dateColumn, date);

  bottomStatusBar(
    `m: menu | t: color | f: ${use24HourTime ? "12-hour" : "24-hour"} time | q: exit`,
  );
};

const renderMenuView = () => {
  renderMenu(selectedMenuItem, {
    Wallpaper: wallpaperName || "not selected",
    "No wallpaper": wallpaper ? "off" : "on",
    Theme: `color ${clockColorIndex + 1}`,
    "Time format": use24HourTime ? "24-hour" : "12-hour",
  });
};

const updateTimer = () => {
  if (!menuOpen) {
    renderHome();
  }
};

const refreshWallpaper = async (nextIndex = wallpaperIndex) => {
  const loadedWallpaper = await loadWallpaper(nextIndex);
  wallpaper = loadedWallpaper.image;
  wallpaperIndex = loadedWallpaper.index;
  wallpaperName = loadedWallpaper.name;
  if (menuOpen) {
    renderMenuView();
  } else {
    renderHome();
  }
};

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error("cli-wallpaper must be run in an interactive terminal.");
  process.exit(1);
}

refreshWallpaper()
  .catch((error) => {
    console.error("Unable to render wallpaper:", error.message);
    renderHome();
  })
  .finally(() => {
    timer = setInterval(updateTimer, 1000);
  });

process.stdout.on("resize", () => {
  if (menuOpen) {
    renderMenuView();
    return;
  }

  if (!wallpaper && wallpaperName === "No wallpaper") {
    renderHome();
    return;
  }

  refreshWallpaper().catch((error) => {
    console.error("Unable to resize wallpaper:", error.message);
  });
});

process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on("data", (key) => {
  const input = key.toString();

  if (menuOpen) {
    if (input === "j") {
      selectedMenuItem = moveSelection(selectedMenuItem, 1);
      renderMenuView();
    } else if (input === "k") {
      selectedMenuItem = moveSelection(selectedMenuItem, -1);
      renderMenuView();
    } else if (input === "\r" || input === "\n") {
      if (menuItems[selectedMenuItem] === "Wallpaper") {
        refreshWallpaper(wallpaperIndex + 1).catch((error) => {
          console.error("Unable to change wallpaper:", error.message);
        });
        return;
      } else if (menuItems[selectedMenuItem] === "No wallpaper") {
        wallpaper = "";
        wallpaperName = "No wallpaper";
      } else if (menuItems[selectedMenuItem] === "Theme") {
        clockColorIndex = (clockColorIndex + 1) % ansiColors.length;
      } else if (menuItems[selectedMenuItem] === "Time format") {
        use24HourTime = !use24HourTime;
      } else {
        menuOpen = false;
      }
      renderMenuView();
    } else if (input === "\u001b" || input === "q") {
      menuOpen = false;
      renderHome();
    } else if (input === "\u0003") {
      cleanup();
    }
  } else if (input === "m") {
    menuOpen = true;
    renderMenuView();
  } else if (input === "t") {
    clockColorIndex = (clockColorIndex + 1) % ansiColors.length;
    renderHome();
  } else if (input === "f") {
    use24HourTime = !use24HourTime;
    renderHome();
  } else if (input === "\u0003" || input === "q") {
    cleanup();
  }
});

process.on("SIGINT", cleanup);

// if error occurs, cleanup and exit
process.on("uncaughtException", (err) => {
  console.error("An error occurred:", err);
  cleanup();
});
