# Setup Guide

This guide explains how to deploy the LogFresh Invoice System from scratch in a company Google account.

## 1. Create Google Drive folders

Create a main Drive folder, for example:

```text
LogFresh Invoice Automation
```

Recommended subfolders:

```text
Templates
Generated PDFs
```

Upload the template files from this repository:

```text
templates/Harvest_Smart_Invoice_Template_Strict.docx
templates/Harvest_Smart_Order_Confirmation_Template_Strict.docx
```

Open each file in Google Docs and save/convert it as a Google Docs file if needed.

Copy each Google Docs template ID.

## 2. Create Form 1

Create a Google Form named:

```text
LogFresh Order Form
```

Add the expected fields listed in the project README.

Important:

- `Workflow Type` must include:
  - `Invoice Only`
  - `Confirmation First`
- `Send Confirmation Automatically` controls Form 1 sending for both workflows.
- `Salesperson Email` should be filled accurately because internal reminders are sent there.

Connect Form 1 to a Google Sheet.

Rename the main response tab to:

```text
Order Confirmation
```

## Optional: Create a separate Customer Info spreadsheet

By default, the customer summary sheet `客户有效信息` is created as a tab inside the main response spreadsheet.

If you want it to live in its own Google Sheets file:

1. Create a blank Google Sheet, for example:

```text
LogFresh Customer Info
```

2. Copy the spreadsheet ID from the URL:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

3. Paste that ID into Apps Script:

```js
CUSTOMER_INFO_SPREADSHEET_ID: 'SPREADSHEET_ID',
```

4. Keep the tab name as:

```js
CUSTOMER_INFO_SHEET_NAME: '客户有效信息',
```

The script will create the `客户有效信息` tab in that separate spreadsheet if it does not already exist.

## 3. Create Form 2

Create a Google Form named:

```text
LogFresh Shipping / Invoice Update Form
```

Add these fields:

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

Connect Form 2 to the same Google Sheet as Form 1.

Rename the Form 2 response tab to:

```text
Shipping Updates
```

## 4. Configure form access

For both forms:

```text
Settings
→ Responses
```

Use settings that do not require Google login:

```text
Collect email addresses: Do not collect or Responder input
Limit to 1 response: Off
Restrict to organization: Off
File upload: none
```

## 5. Create Form 2 prefilled link

Open Form 2:

```text
More options
→ Get pre-filled link
```

Use sample values:

```text
Order Number = ORDER_NUMBER_HERE
Ship Date = 2026-07-20
Shipped Via = UPS Ground (Free)
Tracking Number = TRACKING_NUMBER_HERE
Invoice Number = INVOICE_NUMBER_HERE
Invoice Date = 2026-07-20
Due Date = 2026-08-19
Payment Method = Credit Card
Customer Email = CUSTOMER_EMAIL_HERE
```

In the Apps Script config, replace the generated sample values with:

```text
{{ORDER_NUMBER}}
{{SHIP_DATE}}
{{SHIPPED_VIA}}
{{TRACKING_NUMBER}}
{{INVOICE_NUMBER}}
{{INVOICE_DATE}}
{{DUE_DATE}}
{{PAYMENT_METHOD}}
{{CUSTOMER_EMAIL}}
```

## 6. Add Apps Script

Open the response Google Sheet:

```text
Extensions
→ Apps Script
```

Paste:

```text
apps-script/LogFresh_Two_Stage_Order_Invoice_Automation.gs
```

Update the `CONFIG` block if any Drive IDs, tab names, company info, or form URLs have changed.

Save the script.

## 7. Deploy Web App

In Apps Script:

```text
Deploy
→ New deployment
→ Web app
```

Recommended settings:

```text
Execute as: Me
Who has access: Anyone
```

Copy the Web App URL and paste it into:

```js
WEB_APP_URL
```

Save the script.

Then update the deployment:

```text
Deploy
→ Manage deployments
→ Edit
→ New version
→ Deploy
```

## 8. Add trigger

In Apps Script:

```text
Triggers
→ Add Trigger
```

Use:

```text
Function: onFormSubmit
Deployment: Head / 最新测试版
Event source: From spreadsheet
Event type: On form submit
Failure notifications: Immediately
```

## 9. Test the workflow

### Test Confirmation First

Submit Form 1:

```text
Workflow Type = Confirmation First
Send Confirmation Automatically = Yes
```

Expected:

- Order number generated.
- Order Confirmation PDF generated.
- Customer approval URL generated.
- Customer email sent if enabled.

Click the approval link.

Expected:

- Order status changes to `Customer Approved`.
- Customer approved timestamp is recorded.
- Salesperson receives shipping update email with Form 2 prefilled link.

Submit Form 2.

Expected:

- Original order row is updated by `Order Number`.
- Invoice PDF is generated.
- Invoice is sent only if `Send Invoice Automatically = Yes`.

### Test Invoice Only

Submit Form 1:

```text
Workflow Type = Invoice Only
Send Confirmation Automatically = Yes or No
```

Expected:

- Invoice PDF is generated.
- Invoice is emailed only if send option is `Yes`.
- Internal shipping/tracking reminder is sent to salesperson.

## 10. Maintenance notes

No redeploy is needed for most form-submit logic changes when trigger deployment is `Head`.

Redeploy the Web App only after changing:

- `doGet()`;
- approval-link behavior;
- Web App URL behavior.
