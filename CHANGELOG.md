# Changelog

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
