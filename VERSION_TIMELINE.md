# Version Timeline / 版本时间线

This file tracks repository-level versions, GitHub commits, and historical checkpoints.
For business-facing feature changes, see [CHANGELOG.md](CHANGELOG.md) and [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md).

这个文件记录 GitHub commit、版本节点和历史归档。
功能更新记录请看 [CHANGELOG.md](CHANGELOG.md) 和 [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)。

## Version Checkpoints / 版本节点

### v3 maintenance · Price Formatting Rule · 2026-07-29

- Updated the v3 script snapshot so price fields default to two decimals while preserving three-or-more decimal precision when entered or calculated.
- Added menu-based email routing controls for test-only email delivery and normal production delivery.
- Removed daily-visible maintenance actions from the LogFresh Sheet menu.
- Snapshot folder: [`versions/v3-invoice-needs-shipping-info/`](versions/v3-invoice-needs-shipping-info/)

### v3 · Invoice Shipping Info Workflow · 2026-07-27

- Added the new `Invoice Only - Needs Shipping Info` workflow.
- Added dedicated Form 3 for completing shipping/tracking details after the first internal invoice is generated.
- Final invoice sending is controlled by `Send Invoice Automatically`.
- Shipping update emails now use clear buttons instead of exposed long prefilled URLs.
- Snapshot folder: [`versions/v3-invoice-needs-shipping-info/`](versions/v3-invoice-needs-shipping-info/)

### v2-current-two-stage · Two-Stage Production Workflow · 2026-07-20+

- Supports `Invoice Only` and `Confirmation First`.
- Includes customer approval link, Form 2 shipping update, invoice generation, and email automation.
- Snapshot folder: [`versions/v2-current-two-stage/`](versions/v2-current-two-stage/)

### v1-legacy-single-invoice · Early Single-Stage Script · 2026-07-20

- Early invoice-only generation script.
- Does not include customer approval, Form 2/Form 3, or two-stage workflow routing.
- Snapshot folder: [`versions/v1-legacy-single-invoice/`](versions/v1-legacy-single-invoice/)

## GitHub Commit Timeline / GitHub 提交时间线

### 2026-07-27

- `fda6ae9` — Use buttons for shipping update links.
- `4913e24` — Send only shipping info update for pending invoice workflow.
- `1a27e58` — Improve Form 3 prefill matching.
- `aac0cda` — Require explicit invoice send choice and add email signature.
- `1461590` — Default Form 3 updates to send final invoice.
- `7291eaa` — Sync shipping method choices across forms.
- `e12dcc7` — Remove ship date from invoice shipping form.
- `be42c78` — Add dedicated invoice shipping info form.
- `29ba183` — Add invoice workflow for pending shipping info.

### 2026-07-23

- `9d7ca2b` — Fix historical formatting changelog hash.
- `00eccab` — Backfill comma formatting in sheet records.
- `be412c2` — Fix comma formatting changelog hash.
- `dd0bec9` — Format quantities and amounts with commas.
- `02c2bd5` — Fix date format changelog hash.
- `a4927b7` — Normalize business dates to US format.
- `96ded5d` — Fix customer order changelog hash.
- `c35fa05` — Store each customer order separately.
- `c773011` — Fix order total changelog hash.
- `2bc6cea` — Recalculate order totals during sheet sync.
- `71fc917` — Fix address sync changelog hash.
- `4d38a60` — Rewrite address sync in place.
- `14e9651` — Fix form address item ordering.
- `68f4141` — Fix changelog hash for address sync.
- `620aca2` — Sync split address fields to form and sheet.
- `db69c47` — Fix changelog hash for invoice update cleanup.
- `a0e5cf6` — Remove old invoices during invoice updates.
- `ce10a5a` — Fix changelog hash for invoice archive update.
- `23d6a87` — Send invoice-only no-send copies internally.
- `52e871a` — Fix changelog hash for customer info update.
- `c8fd4ec` — Customer info English columns and address split.
- `85fc90c` — Remove temporary maintenance menu items.
- `08d7b3a` — Split generated files into order and invoice folders.
- `b4fc186` — Add one-click Google Form payment updater.
- `366766a` — Update unit price and payment method requirements.
- `d589642` — Add batch rename for existing generated files.
- `c3b65c1` — Use company names in generated file names.
- `8d64693` — Fix changelog hash for PDF-only invoice action.
- `455c26b` — Add invoice PDF-only sheet menu action.
- `3577250` — Update changelog for disabled update reminder.
- `202a70c` — Disable invoice-only update reminder email.

### 2026-07-21

- `3989166` — Separate changelog version and feature histories.
- `bc74277` — Add dates to changelog version timeline.
- `be1aaf8` — Update changelog for customer info deployment.
- `13fc87d` — Remove duplicate clasp script file.
- `02d8a3f` — Add clasp Apps Script deployment support.
- `34ac08a` — Configure separate customer info spreadsheet.
- `8e35385` — Support separate customer info spreadsheet.
- `e1b6748` — Update changelog for July 21 template refinements.
- `84be5ca` — Add automatic customer info sync.
- `d80950c` — Update company suffix casing in templates.
- `8a3449d` — Update invoice and order confirmation templates.
- `631fcdf` — Update invoice date format to US standard.

### 2026-07-20

- `1cabffa` — Make homepage README bilingual.
- `cc9c812` — Add bilingual docs and version archive.
- `a5dcef5` — Initial LogFresh invoice automation system.
