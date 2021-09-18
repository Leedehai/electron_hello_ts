# Hello (with TypeScript)

## Prerequisites:

Node 14+

## Install dependencies and start app:

```sh
npm install
npm start
```

## Demonstrated features:

* Format with clang-format, lint with eslint
* Memorize previous window scale and position
* Splash screen
* Electron's preload script bridging main and renderer
* Dark mode toggle (set light/dark or system)
* Unit tests:
  * Source code on Node: Jasmine.
  * Source code on browser: TODO

## Testing

```sh
npx jasmine-ts --config=jasmine.json  # Add --filter=[describe() name] to filter
```

## List licenses of direct dependencies used in production:

```sh
npx license-checker --production --direct  # Add --summary for a summary
```
