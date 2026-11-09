# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-10-12

### Fixed

- TYPO3 14.3 no longer reports the extension's `ext_emconf.php` as deprecated: `composer.json`
  declares the version again.

## [0.1.0] - 2026-10-12

The first release. Pick a backend group in the toolbar and switch the permissions on: the
module menu, the page tree, the folder tree and the record form then show what the group
may do there, and you change it on the same screen. The extension is alpha, and the
**Records and fields** area can still change a lot.

### Added

- A group picker, a switch and **View as** in the backend toolbar, with
  <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> to show and hide the permissions and
  <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> to switch to the user viewed last. The
  pickers offer a new group and a new user, and read the list again each time they open.
- A tab over each area. Each area is a card with two sides: the front shows what the group
  has, the back is where you pick more. A permission the group gets from a subgroup is
  marked as inherited and is changed on that subgroup.
- **Modules** — the module menu shows the modules the group may open. Modules outside the
  menu are chosen in a dialog of their own. Allowing a module also allows the module it
  sits under, and removing a module removes the modules below it; the panel says so.
- **Page mounts** and **file mounts** — the page tree and the folder tree show where the
  group may work. A folder without a file mount gets one, named on the spot. The file
  operations of the group are chosen in a dialog from the file mounts panel. Pages the group
  cannot see for their page permissions are named, with a link to their permissions.
- **Records and fields** — the record form shows what the group may do with each field.
  The band above the form sets how far the group reaches into each table: no access, read,
  or read and write. Allowed values of a field, such as content types and page types, are
  chosen in a dialog. Fields only other types of a record show are listed below its child
  records. A field's square explains what it means and, for an inherited field, which
  groups give it.
- **Other permissions** — the rest of the group record, in a panel next to the screen.
- **View as** — the backend as one of the users, and back to the screen you came from.
- Nothing is saved until you save it. A change TYPO3 does not accept stays on the screen
  with a message.
- English and German labels, TYPO3 13.4 and 14.3, PHP 8.2 and up.

[Unreleased]: https://github.com/wazum/visual-permissions/compare/v0.1.1...main
[0.1.1]: https://github.com/wazum/visual-permissions/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/wazum/visual-permissions/releases/tag/v0.1.0
