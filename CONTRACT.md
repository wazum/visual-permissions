# Wire contract

PHP and TypeScript only work together if they agree on the values and rules below.
Each value has one owner. No other place may define it again.

Read this before changing anything that crosses the AJAX boundary or lands in the DOM.

## Values

| What | Value | Owner |
|---|---|---|
| Access verdicts | seven strings | `Contract/vocabulary.json` → PHP `AccessVerdict`, TS `Verdict` |
| Target kinds | four strings | `Contract/vocabulary.json` → PHP `TargetKind`, TS `Kind` |
| DOM attributes and classes | every `data-vperm-*` and `vperm-*` name | `Contract/dom-attributes.json` |
| Bus event names | one name | `Contract/events.json` → TS `Events` |
| Route ids | thirteen ids | `Configuration/Backend/AjaxRoutes.php` → generated `Build/src/platform/routes.ts` |
| Labels | every word a user reads | `Resources/Private/Language/locallang.xlf` → `TYPO3.lang`, read by id with `labelOf()` |

A JSON import gives TypeScript `string[]`, not a literal union, so `npm run contract`
generates `Build/src/platform/contract.ts` with `as const` and the unions come from that with
`typeof`. The generated file is committed and CI fails if it is out of date. SCSS gets the
same treatment because Sass cannot read JSON at all.

PHP enums are hand-written, because the language allows nothing else, and one unit test per
enum asserts it matches the fixture in both directions.

## Rules

**A fixture is the source, not a mirror.** Change `Contract/*.json` first, then let the
failing tests in both languages tell you what else has to move. A value spelled out in a
`.php`, `.ts` or `.scss` file that also lives in a fixture is a bug even while it agrees.

**Declare a DOM name when its writer lands, not before.** Every declared attribute must
have a live reader and every shipped selector a live writer; a name with neither is
indistinguishable from a name that stopped working.

**The bus carries notifications only.** Session state is read synchronously through
`getState()`. A `request-x` / `x-changed` pair on the bus is the mistake this split exists
to prevent.

**No event name mentions a scope.** Adding an authorization scope must add zero event
names and zero UI concepts. If it needs one, the abstraction is wrong.

**A verdict is derived server-side, once.** The client renders it; it never reasons
about grants, inheritance or admin status. `pending` is the one fact the browser owns, and
it is never a verdict.

**`comment` is stripped by both readers.** A fixture explains itself; it does not get a
parallel document.

## What a draft is, and how long it lives

A draft is the set of changes a reader has asked for on a panel but has not applied.

**A draft belongs to one scope.** The modules panel keeps what each row said when its face
was filled. The mounts panel keeps the branches marked and picked. Neither sees the other's.

**A draft belongs to one group.** Showing another group lets the draft go, because a mark
made against one group says nothing about another.

**A draft does not outlive the page.** The page holds it in memory and writes it nowhere,
neither to the settings nor to the tab. An admin who leaves and comes back starts with
nothing waiting.

## What the response says about where a grant comes from

The inspection carries the whole inheritance chain, every group in it with its title and
its depth, and one verdict per target. A verdict says whether the group holds the target
itself or through a subgroup.

For fields, `givenBy` names the subgroups that give a target themselves, by id, in chain
order; their titles are in the chain. A target the group gives only itself is not listed.
It names the group that holds the grant, never the way to it: that is the group to open
and change.

## Fixtures that record behaviour, not just values

`Contract/inspect-response.json` holds a complete inspection response, recorded from the
real controller rather than written by hand, because a hand-written fixture only records
what its author expected. The PHP test asserts the controller answers in the same shape:
every key, every value type, and one shape for the entries of a list or a map. The values
follow the installed core, so they are not compared. The vitest test feeds the recorded
response to the fields scope and reads the marks it draws. A change to either side then
fails in CI, rather than at runtime in somebody's backend.

The write endpoints have no such fixture: a write that is taken answers 204 with no body,
and the browser reads only the status.
