# Changelog

## GitHub Commit Version Timeline

This section only tracks GitHub commits and repository-level version history.

### 2026-07-20 · `a5dcef5` - Initial LogFresh invoice automation system

- Created the first GitHub-ready project structure.
- Added the production Apps Script file.
- Added strict invoice and order confirmation templates.
- Added the initial English README, changelog, and setup guide.
- Captured the complete two-workflow automation as the first repository version.

### 2026-07-20 · `cc9c812` - Bilingual docs and version archive

- Added Chinese documentation files.
- Added bilingual setup guide.
- Added version archive folder.
- Added `v1-legacy-single-invoice` archive for the original single-stage invoice script.
- Added `v2-current-two-stage` archive for the current two-stage workflow.

### 2026-07-20 · `1cabffa` - Bilingual homepage README

- Reworked the GitHub homepage README into side-by-side English/Chinese explanations.
- Added bilingual descriptions for workflows, fields, numbering, date behavior, email subjects, and deployment notes.

### 2026-07-21 · `631fcdf` - U.S. invoice date format

- Changed invoice date output from international `dd/MM/yyyy` to U.S. `MM/dd/yyyy`.
- Updated date parsing for slash-based dates to use U.S. month/day order.
- Updated English and Chinese documentation to match the new date format.

### 2026-07-21 · `8a3449d` - Latest invoice and order confirmation templates

- Replaced GitHub template files with the latest provided Word templates.
- Preserved template placeholder compatibility with the Apps Script.

### 2026-07-21 · `d80950c` - Company suffix casing in templates

- Updated the company suffix in template headers from `LTD` to `Ltd`.
- Confirmed template header text as `Logfresh Biotechnology Co., Ltd`.

### 2026-07-21 · `84be5ca` - Customer info sync

- Added customer summary sheet automation.
- Added automatic upsert of customer records after Order Confirmation and Invoice generation.
- Added a rebuild menu action for the customer summary sheet.

### 2026-07-21 · `e1b6748` - July 21 changelog refinements

- Added detailed July 21 template refinement notes.
- Preserved customer info sync changelog entries from the remote branch.
- Rebased and pushed the combined changelog updates.

### 2026-07-21 · `8e35385` - Separate customer info spreadsheet support

- Added script support for storing customer summary records outside the main Form response workbook.
- Added helper logic to open the configured customer info spreadsheet by ID.
- Preserved fallback behavior so the customer info sheet can still live inside the active response workbook when no separate spreadsheet ID is configured.

### 2026-07-21 · `34ac08a` - Configure separate customer info spreadsheet

- Created and connected the standalone `LogFresh Customer Info` Google Sheet.
- Configured `CUSTOMER_INFO_SPREADSHEET_ID` to write customer records into the separate customer database workbook.
- Updated the output script copy so GitHub, local files, and the production Apps Script source stay aligned.

### 2026-07-21 · `02d8a3f` - Apps Script deployment support

- Added `clasp` configuration for direct local-to-Google Apps Script deployment.
- Added the Apps Script manifest file.
- Connected the repository to the production Apps Script project ID for future script sync.

### 2026-07-21 · `13fc87d` - Remove duplicate clasp script file

- Removed the duplicate `Code.js` file from the Apps Script source folder.
- Re-pushed Apps Script with only the manifest and main automation script.
- Prevented duplicate top-level script definitions in the Apps Script editor.

### 2026-07-21 · `be1aaf8` - Customer info deployment changelog

- Updated the English and Chinese changelogs with customer info deployment details.
- Documented the separate customer info spreadsheet configuration.
- Documented the Apps Script source cleanup after `clasp` deployment.

---

## Functional / Business Change History

This section tracks the actual workflow, template, form, email, and customer-data changes made for the LogFresh automation system.

## Customer Info Sync - 2026-07-22

### Added

- Added automatic `客户有效信息` customer summary sheet maintenance.
- Added optional `CUSTOMER_INFO_SPREADSHEET_ID` support so customer info can live in a separate Google Sheets file.
- Created and configured a separate `LogFresh Customer Info` Google Sheet for customer summary data.
- Connected the separate customer info spreadsheet:
  - `1J-5LH2qpLD7jpPPRB-XpEKfODC7YOgrJFM6z6b3TSpk`
- Added customer summary upsert after Order Confirmation generation.
- Added customer summary upsert after Invoice generation, including Form 2 invoice generation.
- Added `Rebuild Customer Info Sheet` to the custom `LogFresh` spreadsheet menu.
- Added customer summary fields for customer name, salesperson, company/farm, phone, email, billing address, payment terms, payment method, latest order/invoice/tracking numbers, product summary, and notes.
- Added `clasp` deployment support so the local GitHub script can be pushed directly to Google Apps Script.

### Changed

- Customer summary excludes obvious test/internal rows and Barry Foley/internal LogFresh or AWT email rows.
- Customer matching now prioritizes email, then falls back to name/company or name/phone when email is missing.
- Cleaned the Apps Script source folder so only the main automation script and manifest are deployed.

## 2026-07-21

### Changed

- Updated invoice and order confirmation templates based on detail review feedback.
- Updated company name casing in templates to:
  - `Logfresh Biotechnology Co., Ltd`
- Updated template address text to use:
  - `708 N 29th Avenue, Unit 2, Yakima, WA 98902`
- Updated invoice date output format to U.S. standard:
  - `MM/dd/yyyy`
- Updated date parsing to treat slash-based dates as U.S. `MM/dd/yyyy`.
- Replaced the GitHub template files with the latest provided Word templates.
- Updated bilingual homepage README formatting for side-by-side English/Chinese project introduction.

### Notes

- These template updates were pushed to GitHub.
- The Google Docs template files in Drive still need to be updated separately if the production Google Docs templates are not already replaced.

## Initial Build - 2026-07-20

### Overview

Built a complete Google Form + Google Sheets + Google Docs + Apps Script workflow for LogFresh order processing.

The system supports two sales workflows:

1. `Invoice Only`
   - Used when the customer has already confirmed the order.
   - Generates an invoice PDF directly.
   - Sends the invoice only when the form send option is enabled.
   - Sends an internal shipping/tracking reminder to the salesperson.

2. `Confirmation First`
   - Used when the customer needs to approve the order before invoicing.
   - Generates and optionally sends an Order Confirmation.
   - Provides a no-login customer approval link.
   - Sends an internal shipping update reminder after approval.
   - Uses Form 2 to update shipping/tracking data and generate/send the final invoice.

### Added

- Created Google Form 1 for order creation.
- Created Google Form 2 for shipping and invoice updates.
- Created Google Sheet backend with two tabs:
  - `Order Confirmation`
  - `Shipping Updates`
- Added automated Google Docs placeholder replacement.
- Added Order Confirmation PDF generation.
- Added Invoice PDF generation.
- Added Google Drive output folder support.
- Added customer approval link for order confirmations.
- Added no-login customer approval Web App endpoint.
- Added internal salesperson notification after approval.
- Added Form 2 prefilled update link.
- Added support for prefilled Form 2 fields:
  - Order Number
  - Ship Date
  - Shipped Via
  - Tracking Number
  - Invoice Number
  - Invoice Date
  - Due Date
  - Payment Method
  - Customer Email
- Added automatic CC list for customer-facing emails.
- Added salesperson-specific notifications using `Salesperson Email`.
- Added internal-only `Internal Notes`.
- Added strict Word/Google Docs templates for:
  - Order Confirmation
  - Invoice

### Changed

- Converted the original single-invoice workflow into a two-path system:
  - `Invoice Only`
  - `Confirmation First`
- Changed invoice generation so `Tracking Number` is no longer required.
- Added internal shipping/tracking reminder for `Invoice Only`.
- Unified Form 1 sending behavior:
  - `Send Confirmation Automatically = Yes` sends the generated document.
  - `Send Confirmation Automatically = No` generates PDF only.
- Kept Form 2 sending behavior separate:
  - `Send Invoice Automatically = Yes` sends the final invoice.
  - `Send Invoice Automatically = No` generates/updates PDF only.
- Changed date output format to `MM/dd/yyyy`.
- Added due date fallback:
  - blank due date defaults to invoice date + 30 days.
- Changed order/invoice numbering format:
  - `ORD-YYYYMMDD-###`
  - `INV-YYYYMMDD-###`
- Changed sequence suffix to represent the current day's order count instead of using row number or timestamp.
- Standardized email subject lines:
  - `[ORD] Order Confirmation with LogFresh - {{ORDER_NUMBER}}`
  - `[INV] Invoice with LogFresh - {{INVOICE_NUMBER}} / {{ORDER_NUMBER}}`
  - `[Approved] Order Confirmation needs shipping info - {{ORDER_NUMBER}}`
  - `[Update] Invoice shipping information required - {{INVOICE_NUMBER}} / {{ORDER_NUMBER}}`
- Updated company information:
  - `LogFresh Biotechnology CO., LTD`
  - `708 N 29th Avenue APT 2, Yakima, WA 98902`
  - `215-696-1238`
  - `sales@awt-biotech.com`
  - `www.logfresh.net`
- Updated template IDs:
  - Invoice: `1HL7cBQRwKluDp4bqpjuwF3Cf7g3KPOFMm1bFTBQf0qA`
  - Order Confirmation: `1IKmEJH8gQ4Sv9376UEUHYFkvf7aYwZCQWfpkVfDx9FE`
- Updated output folder ID:
  - `1fJ2NObstEyEbEoKcf-OSOdyrg1hhgpEU`

### Fixed

- Fixed invoice-only flow sending invoices when automatic sending was intended to be disabled.
- Fixed Form 2 matching to update records by `Order Number`.
- Fixed invoice generation failure when tracking number was blank.
- Fixed timestamp-based invoice numbers.
- Fixed Form 2 prefilled URL coverage for shipping and invoice fields.
- Fixed old template IDs and Drive configuration.
- Fixed compatibility around Google Docs templates by keeping placeholder names consistent.

### Operational Notes

- Trigger deployment should use `Head / 最新测试版`.
- Web App redeployment is only needed for approval-link behavior changes.
- Forms should not require Google login:
  - no verified email collection;
  - no one-response limit;
  - no organization restriction;
  - no file-upload fields.
- Form 2 depends on exact `Order Number` matching.
- `Internal Notes` are internal only and are not shown in customer PDFs or emails.
