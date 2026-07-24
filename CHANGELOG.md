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

### 2026-07-23 · `202a70c` - Disable invoice-only update reminder email

- Disabled the automatic `[Update] Invoice shipping information required` email for the `Invoice Only` workflow.
- Kept invoice generation and optional invoice sending unchanged.
- Kept the customer-approved `[Approved]` shipping information reminder unchanged.

### 2026-07-23 · `455c26b` - Manual invoice PDF-only menu action

- Added a Google Sheets menu action to generate an invoice PDF for the selected row without sending any email.
- Added a confirmation popup before generating the PDF-only invoice.
- Added a completion popup showing where the invoice was saved in Drive.

### 2026-07-23 · `c3b65c1` - Use company names in generated file names

- Changed generated Order Confirmation file names to use the billing company name instead of the individual customer name.
- Changed generated Invoice file names to use the billing company name instead of the individual customer name.
- Kept email greetings and document content behavior unchanged.

### 2026-07-23 · `d589642` - Add batch rename for existing generated files

- Added a Google Sheets menu action to rename existing generated Order Confirmation and Invoice files in Drive.
- The batch rename reads the `BILL TO` section from each generated Google Doc and uses the company name for both the Google Doc and matching PDF file names.
- Added skip logic for files where a company name cannot be safely detected.

### 2026-07-23 · `366766a` - Update unit price and payment method requirements

- Changed line-item unit price rendering so it preserves the decimal precision entered in the form instead of forcing two decimal places.
- Kept subtotal, total, balance due, and other calculated dollar amounts formatted to two decimal places.
- Documented the shared Form 1/Form 2 payment method options: `Credit Card`, `Prepaid`, and `Check/Wire Transfer`.

### 2026-07-23 · `b4fc186` - Add one-click Google Form payment method updater

- Added Form 1 and Form 2 IDs to Apps Script configuration.
- Added a Google Sheets menu action to update the `Payment Method` choices in both Google Forms.
- The updater supports both multiple choice and dropdown `Payment Method` fields.

### 2026-07-23 · `08d7b3a` - Split generated files into order and invoice folders

- Created separate Drive output folders for Order Confirmations and Invoices.
- Updated Apps Script so future Order Confirmation files save to the Order Confirmations folder.
- Updated Apps Script so future Invoice files save to the Invoices folder.
- Removed old generated files that still used individual customer names in the file name.
- Moved existing company-named generated files into the appropriate Order Confirmations or Invoices folder.

### 2026-07-23 · `0098ba5` - Remove temporary maintenance menu items

- Removed the temporary `Rename Existing Files to Company Names` Google Sheets menu item.
- Removed the temporary `Update Google Form Payment Methods` Google Sheets menu item.
- Kept the permanent automatic company-name file naming, folder split, and payment method configuration in place.

### 2026-07-23 · `c8fd4ec` - Customer info English columns and address split

- Renamed the customer summary tab from `客户有效信息` to `Customer Info`.
- Changed Customer Info headers from Chinese to English.
- Split billing address reporting into separate `Billing City`, `Billing State`, and `Billing ZIP` columns for cleaner Excel exports.
- Added `Order Total` to the main order sheet automation and Customer Info output.
- Added Form 1 maintenance logic for separate `Bill To City`, `Bill To State`, `Bill To ZIP`, `Ship To City`, `Ship To State`, and `Ship To ZIP` questions.
- Added automatic U.S. two-letter state dropdown maintenance for the Form 1 state fields.
- Kept the legacy combined city/state/ZIP template placeholders working as a fallback.

### 2026-07-23 · `23d6a87` - Invoice-only internal archive email

- Changed the `Invoice Only` workflow when `Send Confirmation Automatically = No`.
- Instead of sending nothing, the generated invoice is now emailed to `Salesperson Email` and CC'd to the fixed internal email list for internal archive.
- Kept `Invoice Only` with `Send Confirmation Automatically = Yes` customer-facing behavior unchanged.
- Kept the manual `Generate Invoice PDF Only for Selected Row` menu action as true PDF-only with no email sent.
- Added `Invoice Internal Archive Sent At` tracking in the main order sheet.

### 2026-07-23 · `a0e5cf6` - Remove old invoice files on invoice update

- Updated the Form 2 invoice update workflow to replace the previous generated invoice file for the same order.
- After the new invoice is created successfully, older matching invoice PDF/Google Doc files are moved to Drive trash.
- Kept Invoice Only and manual PDF-only generation from deleting old files automatically.

### 2026-07-23 · `620aca2` - Sync split address fields to main sheet and form

- Added split address columns to the main `Order Confirmation` response sheet: `Bill To City`, `Bill To State`, `Bill To ZIP`, `Ship To City`, `Ship To State`, and `Ship To ZIP`.
- Backfilled existing order rows with parsed city, state, and ZIP values.
- Added a `LogFresh > Sync Form Address Fields` menu action so an authorized user can update Form 1 address questions and re-sync the main sheet split address columns.
- Kept automatic future backfill during document generation.

### 2026-07-23 · `4d38a60` - Rewrite main sheet address columns in place

- Updated `LogFresh > Sync Form Address Fields` so it rewrites the main `Order Confirmation` sheet address columns in place instead of only appending/backfilling columns.
- Keeps billing address columns beside `Bill To Address`: `Bill To City`, `Bill To State`, and `Bill To ZIP`.
- Keeps shipping address columns beside `Ship To Street Address`: `Ship To City`, `Ship To State`, and `Ship To ZIP`.
- Hides duplicate legacy address columns after syncing, instead of deleting them.
- Improved state parsing so full U.S. state names such as `North Carolina` and `Michigan` are normalized to two-letter state abbreviations.

### 2026-07-23 · `2bc6cea` - Recalculate order totals during sheet sync

- Updated `LogFresh > Sync Form Address Fields` to recalculate `Order Total` for every existing order row.
- The total is calculated from line-item quantities and unit prices, plus shipping charge, minus discount, with optional tax rate support.
- Keeps `Order Total` visible in the main order table even before regenerating documents.

### 2026-07-23 · `c35fa05` - Store each customer order separately

- Changed Customer Info sync from customer-summary matching to order-level matching.
- Multiple orders from the same customer/email are now stored as separate rows.
- Existing orders are updated by `Order Number` or `Invoice Number` when shipping/tracking details change.
- Renamed Customer Info order columns from `Latest Order Number` style labels to plain `Order Number`, `Invoice Number`, and `Tracking Number`.

### 2026-07-23 · `a4927b7` - Normalize business dates to MM/dd/yyyy

- Normalized business date output to U.S. `MM/dd/yyyy` format across generated documents, main order sheet result columns, and Customer Info records.
- Added date normalization to the `LogFresh > Sync Form Address Fields` maintenance action for historical rows.
- Kept system-generated order/invoice numbering unchanged.

### 2026-07-23 · `dd0bec9` - Add comma formatting to quantities and amounts

- Added thousands separators to generated document quantity values, for example `200000` now renders as `200,000`.
- Added thousands separators to generated document money values, for example `$29692.85` now renders as `$29,692.85`.
- Kept unit prices unchanged so high-precision values such as `$0.145` remain clean and are not forced into two decimals.

### 2026-07-23 · `PENDING` - Apply display formatting to historical sheet records

- Applied comma formatting to historical main order sheet quantity values and order totals.
- Applied comma formatting to historical Customer Info product summaries and order totals.
- Updated future Customer Info product summary generation so quantities keep thousands separators.

---

## Functional / Business Change History

This section tracks the actual workflow, template, form, email, and customer-data changes made for the LogFresh automation system.

## 2026-07-23

### Changed

- Removed the automatic `[Update] Invoice shipping information required` internal reminder from the `Invoice Only` workflow.
- `Invoice Only` now only generates the invoice and sends it according to the form's send option.
- The `[Approved] Order Confirmation needs shipping info` email is still active for the `Confirmation First` workflow after customer approval.
- Added a manual Sheet menu option:
  - `LogFresh > Generate Invoice PDF Only for Selected Row`
- This option generates/updates the invoice PDF, saves it to Drive, and never sends an email.
- Changed future generated Order Confirmation and Invoice file names to use `Bill To Company` first.
- If `Bill To Company` is blank, the system falls back to the customer name.
- Added a manual Sheet menu option:
  - `LogFresh > Rename Existing Files to Company Names`
- This option scans the existing output Drive folder and renames old generated Google Docs/PDFs to use company names when detectable.
- Updated unit price behavior so invoice line-item unit prices keep the decimal precision entered in the form.
- Standardized the payment method choices for both forms:
  - `Credit Card`
  - `Prepaid`
  - `Check/Wire Transfer`
- Added a manual Sheet menu option:
  - `LogFresh > Update Google Form Payment Methods`
- This option updates the `Payment Method` question choices in both Google Forms.
- Split generated Drive files into two folders:
  - `Order Confirmations`
  - `Invoices`
- Deleted remaining old generated files whose names still used individual customer names.
- Removed temporary maintenance menu items after their one-time cleanup work was completed:
  - `Rename Existing Files to Company Names`
  - `Update Google Form Payment Methods`
- Renamed the customer summary tab from `客户有效信息` to `Customer Info`.
- Changed the Customer Info headers to English.
- Split billing city, state, and ZIP into separate Customer Info columns for clean Excel export.
- Added `Order Total` to the main order sheet and Customer Info output.
- Added automatic Form 1 maintenance for split billing/shipping city, state, and ZIP questions.
- Added automatic U.S. state dropdown maintenance for `Bill To State` and `Ship To State`.
- Updated `Invoice Only` behavior so `Send Confirmation Automatically = No` sends the invoice internally to `Salesperson Email` and CCs the fixed internal email list for archive.
- Preserved the manual PDF-only menu as a no-email action.
- Added `Invoice Internal Archive Sent At` to track internal archive emails separately from customer invoice emails.
- Updated Form 2 invoice updates so regenerating an invoice removes the previous matching invoice file after the new one is created.
- Synced existing main order sheet rows into separate billing/shipping city, state, and ZIP columns.
- Added a Sheet menu action to sync Form 1 address fields and main sheet address columns together.
- Improved the address sync menu so it now rewrites the main order sheet columns in place, keeps split city/state/ZIP columns beside the address fields, hides duplicate legacy columns, and parses full U.S. state names into two-letter abbreviations.
- Added automatic `Order Total` recalculation to the address/form sync menu so the main table is updated at the same time as the address split.
- Changed Customer Info behavior so repeat customers with multiple orders are stored as multiple order rows instead of being collapsed into one latest-customer record.
- Standardized business date display to `MM/dd/yyyy` across documents, order rows, and Customer Info.
- Added comma formatting for generated document quantity and amount columns while keeping unit prices unchanged.
- Backfilled the same comma formatting into existing main sheet and Customer Info records.

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
