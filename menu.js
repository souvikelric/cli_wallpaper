const menuItems = ["Wallpaper", "No wallpaper", "Theme", "Time format", "Close"];

const menuTitle = [
  "█   █ █████ █   █ █   █",
  "██ ██ █     ██  █ █   █",
  "█ █ █ ████  █ █ █ █   █",
  "█   █ █     █  ██ █   █",
  "█   █ █████ █   █ ████ ",
];

const moveSelection = (selectedIndex, direction) => {
  const nextIndex = selectedIndex + direction;

  if (nextIndex < 0) {
    return menuItems.length - 1;
  }

  if (nextIndex >= menuItems.length) {
    return 0;
  }

  return nextIndex;
};

const renderMenu = (selectedIndex, details = {}) => {
  const width = 48;
  const height = menuItems.length + 8;
  const top = Math.max(1, Math.floor((process.stdout.rows - height) / 2));
  const left = Math.max(
    1,
    Math.floor((process.stdout.columns - width) / 2) + 1,
  );
  const reset = "\x1b[0m";
  const purple = "\x1b[95m";
  const horizontalLine = "─".repeat(width);
  const drawRow = (row, text) =>
    `\x1b[${row};${left}H${text.padEnd(width)}${reset}`;

  process.stdout.write("\x1b[2J\x1b[H");

  menuTitle.forEach((line, index) => {
    const titleLeft = Math.max(
      1,
      Math.floor((process.stdout.columns - line.length) / 2) + 1,
    );
    process.stdout.write(
      `\x1b[${top + index};${titleLeft}H${purple}${line}${reset}`,
    );
  });

  const panelTop = top + menuTitle.length + 1;
  process.stdout.write(drawRow(panelTop, `${purple}${horizontalLine}${reset}`));

  menuItems.forEach((item, index) => {
    const marker = index === selectedIndex ? ">" : " ";
    const value = details[item] ? `: ${details[item]}` : "";
    const text = `  ${marker} ${item}${value}`;
    process.stdout.write(
      drawRow(
        panelTop + 1 + index,
        `${index === selectedIndex ? purple : ""}${text}${reset}`,
      ),
    );
  });

  process.stdout.write(
    drawRow(
      panelTop + 1 + menuItems.length,
      `${purple}${horizontalLine}${reset}`,
    ),
  );
  process.stdout.write(
    drawRow(
      panelTop + 2 + menuItems.length,
      "  j/k: move    Enter: select    Esc: close",
    ),
  );
};

module.exports = { menuItems, moveSelection, renderMenu };
