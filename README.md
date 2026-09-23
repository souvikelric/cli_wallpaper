# cli-wallpaper

A small interactive terminal wallpaper that displays a live clock, date, colors, and a menu.

## Run locally

```bash
npm start
```

Or run it directly:

```bash
node terminal_basics.js
```

## Install globally

```bash
npm install --global cli-wallpaper
cli-wallpaper
```

## Controls

- `m`: open the menu
- `j` / `k`: move through menu items
- `Enter`: select a menu item; Wallpaper advances to the next image
- `Escape`: close the menu
- `t`: change the clock color
- `f`: toggle 12-hour and 24-hour time
- `q`: quit

Wallpaper images are loaded from the `wallpapers` directory. PNG and JPEG files
are supported and are cycled in filename order.

The app requires an interactive terminal and works best in modern macOS Terminal, iTerm2, Windows Terminal, or other ANSI-compatible terminals.
