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
  const left = Math.max(1, Math.floor((process.stdout.columns - width) / 2));
  const background = "\x1b[103m";
  const foreground = "\x1b[97m";
  const reset = "\x1b[0m";
  const drawRow = (text) =>
    `\x1b[${top};${left}H${background}${foreground}${text.padEnd(width)}${reset}`;

  process.stdout.write(drawRow("+" + "-".repeat(width - 2) + "+"));
  process.stdout.write(
    `\x1b[${top + 1};${left}H${background}${foreground}|${" Menu".padEnd(width - 1)}|${reset}`,
  );

  menuItems.forEach((item, index) => {
    const marker = index === selectedIndex ? ">" : " ";
    const text = `| ${marker} ${item}`.padEnd(width - 1) + "|";
    process.stdout.write(
      `\x1b[${top + 2 + index};${left}H${background}${foreground}${text}${reset}`,
    );
  });

  process.stdout.write(drawRow("+" + "-".repeat(width - 2) + "+"));
};

module.exports = { menuItems, moveSelection, renderMenu };
