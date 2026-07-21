# LogFresh Invoice System

Google Forms + Google Sheets + Google Docs + Apps Script automation for LogFresh order confirmations, invoices, customer approvals, shipping updates, PDF generation, and email notifications.

## What this system does

This workflow supports two sales paths:

1. `Invoice Only`
   - Use when the customer has already confirmed the order.
   - Generates an invoice PDF immediately.
   - Sends the invoice only when the form send option is set to `Yes`.
   - Sends an internal shipping/tracking reminder to the salesperson.

2. `Confirmation First`
   - Use when the customer needs to approve the order first.
   - Generates an order confirmation PDF.
   - Sends a no-login approval link to the customer when automatic sending is enabled.
   - After approval, sends the salesperson an internal shipping update link.
   - Form 2 updates shipping/tracking data and can generate/send the final invoice.

## Main files

```text
apps-script/
  LogFresh_Two_Stage_Order_Invoice_Automation.gs

templates/
  Harvest_Smart_Invoice_Template_Strict.docx
  Harvest_Smart_Order_Confirmation_Template_Strict.docx

docs/
  setup-guide.md

CHANGELOG.md
README.md
```

## Google Forms

### Form 1: Order Creation

Required/expected question titles:

```text
Workflow Type
Order Date
Salesperson
Salesperson Email
Order Number
Shipped Via
Payment Terms
Customer PO
Tracking Number
Invoice Number
Invoice Date
Due Date
Payment Method
Bill To Name
Bill To Company
Bill To Address
Bill To City State ZIP
Bill To Phone
Bill To Email
Shipping Address Option
Ship To Name
Ship To Company
Ship To Address
Ship To City State ZIP
Ship To Phone
Ship To Email
Item 1 Quantity
Item 1 Description
Item 1 Unit Price
Item 2 Quantity
Item 2 Description
Item 2 Unit Price
Item 3 Quantity
Item 3 Description
Item 3 Unit Price
Item 4 Quantity
Item 4 Description
Item 4 Unit Price
Item 5 Quantity
Item 5 Description
Item 5 Unit Price
Item 6 Quantity
Item 6 Description
Item 6 Unit Price
Discount
Shipping Charge
Tax Rate Percent
Comments
Customer Email
Send Confirmation Automatically
```

`Workflow Type` options:

```text
Invoice Only
Confirmation First
```

`Send Confirmation Automatically` is the unified Form 1 send switch:

```text
Yes = send the generated document for the selected workflow
No = generate PDF only and save it to Drive
```

### Form 2: Shipping / Invoice Update

Expected question titles:

```text
Order Number
Ship Date
Shipped Via
Tracking Number
Invoice Number
Invoice Date
Due Date
Payment Method
Customer Email
Send Invoice Automatically
Internal Notes
```

Form 2 updates the original order by matching `Order Number`.

## Numbering

Order and invoice numbers use the same daily sequence format:

```text
ORD-YYYYMMDD-###
INV-YYYYMMDD-###
```

Examples:

```text
ORD-20260720-001
INV-20260720-001
```

The sequence is based on existing orders for the current day in the main order sheet.

## Date behavior

Dates are output as:

```text
dd/MM/yyyy
```

Due date logic:

```text
Due Date entered manually -> use entered Due Date
Due Date blank -> Invoice Date + 30 days
Invoice Date also blank -> today + 30 days
```

## Email subjects

Customer order confirmation:

```text
[ORD] Order Confirmation with LogFresh - {{ORDER_NUMBER}}
```

Customer invoice:

```text
[INV] Invoice with LogFresh - {{INVOICE_NUMBER}} / {{ORDER_NUMBER}}
```

Customer approved, internal shipping reminder:

```text
[Approved] Order Confirmation needs shipping info - {{ORDER_NUMBER}}
```

Invoice-only internal shipping reminder:

```text
[Update] Invoice shipping information required - {{INVOICE_NUMBER}} / {{ORDER_NUMBER}}
```

## Email recipients

Customer-facing emails are CC'd to the fixed internal list plus `Salesperson Email`.

Internal shipping/update reminders are sent primarily to `Salesperson Email`, with backup internal emails configured in the script.

## Current configuration

The Apps Script currently uses these configured IDs:

```text
Output Folder ID: 1fJ2NObstEyEbEoKcf-OSOdyrg1hhgpEU
Invoice Template ID: 1HL7cBQRwKluDp4bqpjuwF3Cf7g3KPOFMm1bFTBQf0qA
Order Confirmation Template ID: 1IKmEJH8gQ4Sv9376UEUHYFkvf7aYwZCQWfpkVfDx9FE
```

Company details:

```text
LogFresh Biotechnology CO., LTD
708 N 29th Avenue APT 2, Yakima, WA 98902
215-696-1238
sales@awt-biotech.com
www.logfresh.net
```

## Deployment notes

Most form-submit logic runs from the Apps Script trigger using:

```text
Deployment: Head / 最新测试版
Event source: From spreadsheet
Event type: On form submit
```

Saving the script is enough for most trigger-based updates.

Redeploy the Web App only when changing approval-link logic such as `doGet()` or Web App URL behavior.

See [docs/setup-guide.md](docs/setup-guide.md) for full setup steps.
