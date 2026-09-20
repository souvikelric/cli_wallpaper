const menuItems = ["Theme", "Time format", "Close"];

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

const renderMenu = (selectedIndex) => {
  const width = 32;
  const top = Math.max(1, Math.floor((process.stdout.rows - 7) / 2));
  const left = Math.max(1, process.stdout.columns - width - 2);
  const reset = "\x1b[0m";
  const horizontalLine = "─".repeat(width - 2);
  const drawRow = (row, text) =>
    `\x1b[${row};${left}H${text.padEnd(width)}${reset}`;

  process.stdout.write(drawRow(top, `╭${horizontalLine}╮`));
  process.stdout.write(drawRow(top + 1, `│${" Menu".padEnd(width - 2)}│`));

  menuItems.forEach((item, index) => {
    const marker = index === selectedIndex ? ">" : " ";
    const text = `│ ${marker} ${item}`.padEnd(width - 1) + "│";
    process.stdout.write(drawRow(top + 2 + index, text));
  });

  process.stdout.write(
    drawRow(top + 2 + menuItems.length, `╰${horizontalLine}╯`),
  );
};

module.exports = { menuItems, moveSelection, renderMenu };
