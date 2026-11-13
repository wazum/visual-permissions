# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-13

### Added

- The **Permissions** module changes page permissions while the permissions are switched on.
- **Other permissions** shows the fields other extensions add to the group record.
- **View as** says so when the backend could not switch to the user.
- The animations stop when the browser asks for reduced motion.

### Changed

- The extension acts only for administrators and the users they view as. An editor's
  backend and record form stay as TYPO3 draws them.
- Fields of tables only administrators edit can no longer be allowed to a group.
- A folder that already has a file mount gets its first writable one, in the order the
  backend sorts them.

### Fixed

- A page or folder that is not there, or a folder on a storage that is not there, can no
  longer be mounted, and a mount on a missing storage is left out of the folder tree.
- The choices dialog opens once however often its button is pressed, and pressing the
  table level that is already chosen writes nothing.
- The record form keeps the group's table level when a new form comes in, and asks again
  for a group whose form could not be read.
- The permissions start switched off when the stored session names no group.
- A label containing dollar signs is shown as it is.

### Security

- Paths sent by the browser are checked with TYPO3's own URL sanitizer.

[Unreleased]: https://github.com/wazum/visual-permissions/compare/v0.2.0...main
[0.2.0]: https://github.com/wazum/visual-permissions/releases/tag/v0.2.0
