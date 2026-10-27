# Sensor-Based Mobile UI

A UI library in development for building interfaces that respond to mobile device sensors. The goal is to offer a selection of reusable UI templates and components for React, Next.js, and React Native, so developers can choose the experience that fits their app.

## Project status

This repository is an initial scaffold. Sensor support, UI behavior, components, and the public API will be defined as the project develops. There is no usable UI library or published npm package yet.

## Planned structure

```text
src/
  core/          Shared, platform-independent behavior
  react/         React and Next.js UI components and templates
  react-native/  React Native UI components and templates
examples/
  web/           React and Next.js examples
  mobile/        React Native examples
```

Each platform can offer multiple UI options. Shared code should remain independent of browser and native APIs; platform-specific code will handle device access and presentation. Sensor selection, permissions, fallback behavior, and accessibility will be designed alongside each feature.

## Getting started

Clone the repository to follow development:

```bash
git clone https://github.com/shellkore/sensor-based-mobile-ui.git
cd sensor-based-mobile-ui
```

The repository has no runtime dependencies or build step yet. Installation and usage examples will be added when the first components are available.

## npm publishing

The project is intended for publication on npm once it has a documented, tested public API. The root package is marked private to prevent an accidental release of this scaffold. Before publishing, choose and verify the package name and ownership, add a license, implement and test the package entry points for the supported platforms, and remove the `private` flag. Use `npm pack --dry-run` to inspect the package contents before publishing.

## Contributing

Issues and contributions are welcome. As sensor interactions and UI designs are decided, this README will document supported devices, setup, usage, and contribution checks.
