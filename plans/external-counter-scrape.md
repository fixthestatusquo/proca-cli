# Plan: scrape HTML counters in `widget external`

## Context
`proca widget external` (and `widget external cron`) pulls an external counter from
a `url` and extracts it assuming JSON (`response.json()` + `oPath.get(path)`).
Some sources return HTML where the count lives in markup, e.g.:

```html
<meter title="254875 inzendingen" value="254875" max="300000"
  data-value="254875" data-drupal-selector="edit-submission-counter-submission-counter-meter">
</meter>
```

We need a regex-based scrape mode alongside the existing JSON mode.

## Decisions (from user)
- **`path` stays JSON.** New `--regex` flag (and `component.counter.regex` config
  field) selects scrape mode. Presence of `regex` → fetch `response.text()` and
  apply the regex; otherwise current JSON behaviour. No new dependency.
- **Capture group 1**, falling back to the whole match if the regex has no group.
- **First match wins.**
- For the WWF/meter example the regex is `data-value="([0-9]+)"`.

## Approach
Add a `regex` branch in `fetchCounter`. When `regex` is set:
```js
const html = await response.text();
if (verbose) this.log(html);
const m = html.match(new RegExp(regex));
if (!m) this.error(`Could not match ${regex} on ${url}`, { exit: 1 });
counter = m[1] ?? m[0];
```
Otherwise the existing `response.json()` + `oPath.get(data, path)` path runs unchanged.

**Required bug fix:** the current validity check is
`Number.isNaN(Number.parseFloat(counter)) || !Number.isFinite(counter)`.
`Number.isFinite` on a string is always `false`, so any string capture (JSON
numeric strings *and* all regex captures) errors out. Parse once first:
```js
const value = Number.parseFloat(counter);
if (Number.isNaN(value) || !Number.isFinite(value)) {
  this.error(`Could not extract value from ${counter} at ${path ?? regex}`, { exit: 1 });
}
return value;
```

## Files to modify
- `src/commands/widget/external/index.mjs`
  - `fetchCounter`: add `regex` param + text/scrape branch; fix the `isFinite` bug.
  - `flags`: add `regex` (`--regex`), mutually exclusive with `path`; widen `url`'s
    `some` relationship to include `regex`.
  - `getCounterConfig` / `run`: copy `regex` from `config.component.counter` into
    `flags` (same place `path` is set), so configs work.
  - `update()` export: already forwards the whole `config` object; just ensure
    `regex` is carried on the objects read from config.
- `src/commands/widget/external/cron.js`
  - `monitored()`: add `regex: content.component.counter.regex` to the returned
    widget object.
- `README.md` + `oclif.manifest.json` — regenerate via `npm run oclif` (do not hand-edit).

## Reuse
- Existing `fetch` + `User-Agent` + `AbortSignal.timeout` in `fetchCounter`.
- `oPath.get` for JSON mode (unchanged).
- `component.counter` shape already read in `index.mjs` and `cron.js`.

## Steps
- [x] Add `--regex` flag; make it mutually exclusive with `--path`; update `url` relationship.
- [x] Add `regex` branch + text fetch in `fetchCounter`; fix string-parsing validity check.
- [x] Load `regex` from `config.component.counter` in `run()`.
- [x] Pass `regex` through in `cron.js` `monitored()`.
- [x] Update `path` flag description and command example to mention regex.
- [x] Run `npm run oclif` to regenerate README/manifest.

## Verification
JSON (unchanged behaviour):
```sh
npx proca widget external 1234 --url https://example.org/api --path data.total --dry-run
```
Scrape (WWF meter):
```sh
npx proca widget external 1234 \
  --url https://mitmachen.wwf.de/node/506/polling \
  --regex 'data-value="([0-9]+)"' --dry-run
```
Config-based (drop `regex` into a `counter/*.json`'s `component.counter`, then):
```sh
npx proca widget external cron --dry-run
```
Expect the dry-run output counter to equal the meter's `data-value`.
Failure check: a regex that matches nothing should exit 1 with a clear message.
