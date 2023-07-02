# sketch-spritesheet

> WORK IN PROGRESS

A Sketch plugin to generate an "SVG Spritesheet" from your selected layers. An SVG Spritesheet is an `<svg>` element with named `<symbol>` elements that can relatively easily be refereced from websites. The file looks something like this:

```html
<svg>
  <symbol id="arrow-left">...</symbol>
  <symbol id="arrow-right">...</symbol>
  <symbol id="home">...</symbol>
  <symbol id="dashboard">...</symbol>
</svg>
```

Then in your HTML you can use the icon with:

```html
<svg>
  <use href="/path/to/icons.svg#arrow-right"></use>
</svg>
```

These work really well with EveryLayout's [icon-layout](https://every-layout.dev/layouts/)

## Installation

- [Download](../../releases/latest/download/sketch-spritesheet.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on sketch-spritesheet.sketchplugin

## Usage

1. Select the artboards you want to generate a spritesheet from
2. Navigate to **Plugins → SVG Spritesheet → Generate** in the menu
3. Choose where you want the SVG to be saved to

As a bonus, the SVG embeds `<use>` tags within it so that you get a nice preview of all your icons in the macOS.

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

### Debugging

To view the output of your `console.log`, you have a few different options:

- Use the [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
- Run `skpm log` in your Terminal, with the optional `-f` argument (`skpm log -f`) which causes `skpm log` to not stop when the end of logs is reached, but rather to wait for additional data to be appended to the input

### Publishing your plugin

```bash
skpm publish <bump>
```

(where `bump` can be `patch`, `minor` or `major`)

`skpm publish` will create a new release on your GitHub repository and create an appcast file in order for Sketch users to be notified of the update.
