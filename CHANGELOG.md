# Feature Update Log

This file tracks business-facing feature changes for the LogFresh Invoice System.
For GitHub commit history and repository version checkpoints, see [VERSION_TIMELINE.md](VERSION_TIMELINE.md).

## 2026-07-29 · Price Formatting Rule

### Added

- Added a complete beginner-friendly Chinese user guide for non-technical sales/internal users.
- Added a polished PDF version of the beginner guide with cover page, tables, screenshots, headers, footers, and page numbers.
- Added a reusable PDF build script so the formatted guide can be regenerated from the Markdown source.
- Added redacted Apple Mail screenshots to the beginner guide for invoice and shipping-info email examples.
- Added `Test Email Only` and `Back to Normal` controls to the LogFresh Google Sheets menu.
- `Test Email Only` routes every automated email only to `mcp@logfresh.net` and includes the original To/Cc/Bcc at the top of the test email.
- `Back to Normal` restores the regular customer/internal recipients and multi-address CC behavior.

### Changed

- Updated the beginner guide and PDF to clarify that all `Prepaid` orders are placed through `logfresh.net`.
- Removed the old screenshot-planning and one-sentence-summary sections from the beginner guide PDF.
- Simplified the LogFresh Google Sheets menu by removing the daily-visible `Sync Form Address Fields` and `Create/Update Form 3` maintenance items.
- Updated all price displays to default to two decimal places.
- If a price has three or more decimal places, the system now preserves the additional precision instead of rounding it down to two decimals.
- Applied the same rule to Unit Price, line Amount, Subtotal, Discount, Shipping, Tax, Total, Balance Due, Order Total, and Customer Info product summaries.

## 2026-07-27 · v3 Invoice Shipping Info Workflow

### Added

- Added the new workflow option: `Invoice Only - Needs Shipping Info`.
- This workflow creates an internal invoice first, then waits for shipping/tracking information before sending the final invoice to the customer.
- Added dedicated Form 3 for invoice shipping updates.
- Added Form 3 fields for Order Number, Invoice Number, Shipped Via, Shipping Charge, Tracking Number, Invoice Date, Due Date, Payment Method, Customer Email, Send Invoice Automatically, and Internal Notes.
- Added formal HTML email signatures with Logfresh logo, company address, phone, email, and website.
- Added clear email buttons for shipping update links so internal users no longer see long raw prefilled URLs.

### Changed

- Removed Ship Date from Form 3 because it is not shown on the invoice.
- Synchronized shipping method choices across Form 1, Form 2, and Form 3.
- Added `USPS Ground` to the shared shipping method options.
- Improved Form 3 prefill matching for Payment Method, Customer Email, Shipped Via, and related title aliases.
- Standardized prefilled shipping and payment values before generating the Form 3 link.
- Changed final invoice sending behavior: only explicit `Send Invoice Automatically = Yes` sends to the customer; blank or `No` sends internally/CC only.
- Changed the new pending-shipping workflow so the first incomplete invoice is saved to Drive only and does not send an extra internal archive email.
- Regenerated invoices from Form 3 now replace earlier no-shipping invoice files.

## 2026-07-23 · Form, Sheet, File, and Invoice Data Cleanup

### Added

- Added manual Google Sheets action to generate invoice PDF only, without emailing the customer.
- Added support for invoice-only internal copies when `Send Invoice Automatically = No`.
- Added customer info tracking as order-level records instead of collapsing repeat customers into one row.
- Added automatic split address fields for billing and shipping: Street Address, City, State, and ZIP.
- Added order total calculation and customer/order total sync.

### Changed

- Generated PDF/DOCX file names now use the customer company name instead of the individual contact name.
- Order Confirmations and Invoices are routed into separate Drive folders.
- Invoice updates remove older duplicate invoice files when a newer invoice is generated.
- Unit Price preserves the decimal precision entered in the form instead of forcing two decimal places.
- Payment Method options were standardized to `Credit Card`, `Prepaid`, and `Check/Wire Transfer`.
- Dates throughout business documents and sheet outputs were normalized to U.S. `MM/dd/yyyy` format.
- Quantity and amount columns now show comma separators where appropriate.
- Existing sheet records were backfilled for split addresses, order totals, customer info rows, date formatting, and comma formatting.

### Removed

- Removed temporary maintenance menu items after their behavior became automatic.
- Disabled the old automatic invoice-only `[Update] Invoice shipping information required` reminder.

## 2026-07-21 · Templates, Customer Info, and Deployment Setup

### Added

- Added standalone Customer Info spreadsheet support.
- Added automatic customer info sync after document generation.
- Added customer info rebuild action.
- Added `clasp` deployment setup for pushing local Apps Script changes directly to Google Apps Script.
- Added bilingual documentation and setup guide.

### Changed

- Updated invoice and order confirmation templates to the latest Word/Google Docs-compatible versions.
- Updated company suffix formatting in templates to `Logfresh Biotechnology Co., Ltd`.
- Changed invoice date output to U.S. `MM/dd/yyyy`.
- Cleaned up Apps Script deployment source so only the main script and manifest are pushed.

## 2026-07-20 · Initial Repository Build

### Added

- Created the GitHub-ready LogFresh invoice automation repository.
- Added the main Apps Script automation file.
- Added strict Invoice and Order Confirmation templates.
- Added initial README, changelog, setup guide, and version archive structure.
- Archived the early single-stage invoice script as `v1-legacy-single-invoice`.
- Archived the original two-stage workflow as `v2-current-two-stage`.
