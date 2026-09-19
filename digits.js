// ASCII representation of digits 0-9 using a 5x4 grid of block characters.
const digits = {
  0: ["1111", "1001", "1001", "1001", "1111"],
  1: ["0110", "1110", "0110", "0110", "1111"],
  2: ["1111", "0001", "1111", "1000", "1111"],
  3: ["1111", "0001", "1111", "0001", "1111"],
  4: ["1001", "1001", "1111", "0001", "0001"],
  5: ["1111", "1000", "1111", "0001", "1111"],
  6: ["1111", "1000", "1111", "1001", "1111"],
  7: ["1111", "0001", "0001", "0001", "0001"],
  8: ["1111", "1001", "1111", "1001", "1111"],
  9: ["1111", "1001", "1111", "0001", "1111"],
};

// function to render a digit at a specific position in the terminal
const renderDigit = (digit, row, col, color = "") => {
  const pattern = digits[digit];
  for (let i = 0; i < pattern.length; i++) {
    const line = pattern[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "1") {
        process.stdout.write(`${color}\x1b[${row + i};${col + j}H█\x1b[0m`);
      }
    }
  }
};

module.exports = { renderDigit };
