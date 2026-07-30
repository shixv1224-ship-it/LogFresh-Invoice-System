# LogFresh Order and Invoice System Beginner User Guide

This guide is written for sales and internal users who only need basic computer skills. You do not need to know code. If you can open a link, fill out a Google Form, check email, and find files in Google Drive, you can use the system.

The system mainly does three things:

- Sales enters order information.
- The system generates Order Confirmation or Invoice PDF files.
- The system sends customer emails, internal reminder emails, and organizes customer/order information in Google Sheets.

---

## 1. What tools are involved

| Tool | Purpose | What everyday users do |
|---|---|---|
| Order Confirmation Form | Main order entry form | Enter order, customer, product, price, and sending options |
| Shipping Update Form | Used after a customer approves an Order Confirmation | Open from the internal email button and enter shipping/tracking details |
| Invoice Shipping Info Update Form | Used when an invoice was created internally before tracking was ready | Open from the internal email button, add tracking, and decide whether to send the final invoice |
| Google Sheet | Backend record sheet | Check status, links, and manually generate PDFs if needed |
| Google Docs templates | Order Confirmation and Invoice templates | Usually not edited by everyday users |
| Google Drive | Stores generated PDF and Docs files | Find historical Order Confirmations and Invoices |
| Email | Sends customer files and internal reminders | Check customer emails, internal reminders, and test emails |
| Web App approval link | Backend for customer approval buttons | Customers click `Approve Order` without logging in to Google |

Most users will usually:

1. Open the Order Confirmation Form.
2. Enter the order.
3. Choose the correct workflow.
4. Check email to confirm what the system sent.
5. If needed, open the internal email button to add shipping/tracking.

---

## 2. Choosing the correct workflow

The most important field in the Order Confirmation Form is `Workflow Type`.

There are three workflow options:

```text
Invoice Only
Invoice Only - Needs Shipping Info
Confirmation First
```

### 2.1 Invoice Only

Use this when the customer has already confirmed the order and you can send the invoice now.

Typical situations:

- The customer has already confirmed by phone or email.
- Price, quantity, and addresses are final.
- The customer does not need to approve an Order Confirmation first.

The system will:

- Generate the Invoice PDF.
- If `Send Confirmation Automatically = Yes`, send the invoice to the customer and CC internal emails.
- If `Send Confirmation Automatically = No`, send the invoice only to the Salesperson Email and internal CC list for archive.

Simple rule:

```text
Invoice Only + Yes = send invoice to customer
Invoice Only + No = do not send customer; send internal archive copy
```

### 2.2 Invoice Only - Needs Shipping Info

Use this when the customer has already confirmed the order, but tracking/shipping information is not ready yet.

Typical situations:

- Sales can create the invoice record now.
- Packing or warehouse work is not finished yet.
- Tracking number will be available later.
- You do not want to send an incomplete invoice to the customer.

The system will:

- Generate an internal invoice first.
- Save that invoice to Drive.
- Not send that first invoice to the customer.
- Send a `[Ship Info]` email to the Salesperson Email/internal team.
- Include an `Open Shipping Info Form` button.
- After tracking is ready, use the Invoice Shipping Info Update Form to complete shipping details.
- Generate a final invoice and replace the earlier no-shipping invoice.

The most important field in the Invoice Shipping Info Update Form is:

```text
Send Invoice Automatically = Yes
```

If this is `Yes`, the final invoice is sent to the customer.  
If it is blank or `No`, the final invoice is sent internally/CC only.

Simple rule:

```text
Create internal invoice first
Wait for tracking
Use the Invoice Shipping Info Update Form
Then decide whether to send the final invoice to the customer
```

### 2.3 Confirmation First

Use this when the customer needs to approve the order before an invoice is created.

Typical situations:

- The customer has not fully confirmed yet.
- You want the customer to review the Order Confirmation first.
- You only want to create/send the invoice after approval and shipping details.

The system will:

- Generate the Order Confirmation PDF.
- If `Send Confirmation Automatically = Yes`, send it to the customer.
- Include an `Approve Order` button in the customer email.
- Let the customer approve without logging in to Google.
- Change the order status to `Customer Approved`.
- Send an `[Approved]` email to the Salesperson Email/internal team.
- Include a Shipping Update Form link.
- Generate the final invoice after shipping/tracking is submitted.
- If the Shipping Update Form has `Send Invoice Automatically = Yes`, send the invoice to the customer.

Simple rule:

```text
Send Order Confirmation first
Customer approves
Internal team adds tracking
Final invoice is generated/sent
```

---

## 3. How to fill the Order Confirmation Form

The Order Confirmation Form is the main form used by sales.

Before filling it out, prepare:

- Customer name and company name.
- Customer email.
- Billing address.
- Shipping address.
- Product name.
- Quantity.
- Unit price.
- Shipping method.
- Payment method.
- Whether the customer should receive the email automatically.

### 3.1 Workflow Type

Choose the order process:

| Option | When to use |
|---|---|
| `Invoice Only` | Customer already confirmed; send invoice or create internal archive |
| `Invoice Only - Needs Shipping Info` | Customer confirmed, but tracking is not ready |
| `Confirmation First` | Customer must approve the order before invoice |

### 3.2 Order Date

Enter the order date. The system displays business dates in U.S. format:

```text
MM/dd/yyyy
```

Example:

```text
07/29/2026
```

If Google Form shows a date picker, simply select the date.

### 3.3 Salesperson

Choose or enter the salesperson name.

Example:

```text
Barry Foley
```

### 3.4 Salesperson Email

This is very important. Internal reminders are sent primarily to this email.

Example:

```text
barry@example.com
```

If this is wrong:

- The salesperson may not receive customer approval reminders.
- Internal invoice archive emails may go to the wrong person.
- Shipping update emails may go to the wrong person.

### 3.5 Order Number

Usually leave this blank. The system will generate it automatically.

Format:

```text
ORD-YYYYMMDD-###
```

Example:

```text
ORD-20260729-001
```

The final number is the sequence number for that day.

### 3.6 Shipped Via

Choose the shipping method.

Common options include:

```text
UPS Ground (Free)
UPS Ground
UPS 2nd Day Air
UPS 3rd Day Air
UPS Next Day Air
UPS Next Day Air Early
UPS Ground + UPS Next Day Air Early
USPS Ground
Other
```

If a different method is needed, choose `Other` and type it clearly.

### 3.7 Payment Terms

Choose the customer’s payment terms.

Examples:

```text
Due on Receipt
Net 15
Net 30
Net 45
Prepaid
```

Important: all `Prepaid` orders should mean the customer placed/prepaid the order through `logfresh.net`.

### 3.8 Customer PO

Use this if the customer provides a purchase order number.

If the customer does not provide a PO, use:

```text
N/A
```

### 3.9 Tracking Number

In the Order Confirmation Form, `Tracking Number` appears in the `Invoice Only` section after `Due Date`.

It is optional. Leave it blank if tracking is not ready.

If there are multiple packages, enter one tracking number per line:

```text
1Z123456789 - Box 1
1Z987654321 - Box 2
9400110200881234567890 - USPS small box
```

### 3.10 Invoice Number

Usually leave this blank. The system will generate it automatically.

Format:

```text
INV-YYYYMMDD-###
```

Example:

```text
INV-20260729-001
```

The invoice number uses the same daily sequence style as the order number.

### 3.11 Invoice Date and Due Date

Invoice Date is usually the day the invoice is created.

Due Date can be set automatically as:

```text
Invoice Date + 30 days
```

The displayed business format is:

```text
MM/dd/yyyy
```

### 3.12 Billing and shipping address fields

Address fields are split into separate clean columns for reporting and Excel export.

Billing fields:

```text
Bill To Name
Bill To Company
Bill To Address
Bill To City
Bill To State
Bill To ZIP
Bill To Phone
Bill To Email
```

Shipping fields:

```text
Ship To Name
Ship To Company
Ship To Street Address
Ship To City
Ship To State
Ship To ZIP
Ship To Phone
Ship To Email
```

For U.S. addresses, State should use the two-letter abbreviation, such as `CA`, `WA`, `FL`, or `NY`.

### 3.13 Product and price fields

Enter each line item with:

- Quantity.
- Description.
- Unit Price.

The system formats prices as follows:

- Two decimals by default.
- If the entered price has three or more decimals, the system preserves the extra precision.

Examples:

```text
2       -> 2.00
2.5     -> 2.50
2.125   -> 2.125
```

Quantity and amount fields use comma separators where appropriate.

Examples:

```text
1,000
12,500.00
```

### 3.14 Customer Email

This is the primary customer recipient email.

If you are only testing, do not use a real customer email unless `Test Email Only` is turned on.

### 3.15 Send Confirmation Automatically

Although the field is named `Send Confirmation Automatically`, it is the shared sending switch for the Order Confirmation Form.

| Workflow | Yes | No |
|---|---|---|
| Invoice Only | Send invoice to customer and CC internal emails | Do not send customer; send internal archive copy |
| Invoice Only - Needs Shipping Info | First stage does not send customer; sends internal shipping info reminder | Same as Yes for first stage; sends internal shipping info reminder |
| Confirmation First | Send Order Confirmation to customer | Generate PDF only; do not send customer |

If you are not sure, turn on `Test Email Only` before testing.

---

## 4. Workflow 1: Invoice Only

### 4.1 When to use it

Use this when the customer already confirmed and the invoice can be sent now.

### 4.2 Steps

1. Open the Order Confirmation Form.
2. Select `Invoice Only`.
3. Fill customer, address, product, quantity, and price details.
4. If you want to send the invoice to the customer, set `Send Confirmation Automatically = Yes`.
5. If you only want internal archive, set it to `No`.
6. Submit.

### 4.3 What happens after submission

The system will:

- Generate an Order Number.
- Generate an Invoice Number.
- Create the Invoice PDF.
- Save files to the Invoice Drive folder.
- Update `Invoice URL` in the Google Sheet.
- Update `Order Status`.
- Update `Customer Info`.

If customer sending is enabled:

- The customer receives `[INV] Invoice with LogFresh`.
- Internal fixed emails are CC’d.
- The salesperson email is included.

If customer sending is not enabled:

- The customer does not receive the email.
- The salesperson/internal emails receive an `[INV Internal]` archive copy.

---

## 5. Workflow 2: Invoice Only - Needs Shipping Info

### 5.1 When to use it

Use this when the customer has confirmed, but tracking/shipping details are not ready yet.

### 5.2 First stage: sales submits the order

1. Open the Order Confirmation Form.
2. Select `Invoice Only - Needs Shipping Info`.
3. Fill customer, product, price, and shipping method.
4. Leave Tracking Number blank if it is not ready.
5. Submit.

### 5.3 What the system does first

The system will:

- Generate an internal invoice.
- Save it to the Invoice Drive folder.
- Not send it to the customer.
- Set the status to `Awaiting Shipping Info`.
- Send a `[Ship Info] Invoice needs shipping info` email to the Salesperson Email/internal team.

The email includes a button:

```text
Open Shipping Info Form
```

### 5.4 Second stage: after shipping/tracking is ready

1. Open the `[Ship Info]` email.
2. Click `Open Shipping Info Form`.
3. Confirm that Order Number and Invoice Number are prefilled.
4. Enter `Tracking Number`.
5. Check or fill `Shipped Via`.
6. Check or fill `Shipping Charge`.
7. Check `Invoice Date`.
8. Check `Due Date`.
9. Check `Payment Method`.
10. Check `Customer Email`.
11. If you want the final invoice sent to the customer, choose `Send Invoice Automatically = Yes`.
12. If you only want internal archive, choose `No` or leave it blank.
13. Submit.

If there are multiple packages, enter one tracking number per line:

```text
1Z123456789 - Box 1
1Z987654321 - Box 2
9400110200881234567890 - USPS small box
```

### 5.5 What happens after the Invoice Shipping Info Update Form is submitted

The system will:

- Match the original order.
- Write shipping/tracking information back to the main sheet.
- Regenerate the invoice.
- Remove/replace the earlier no-shipping invoice.
- Send to the customer only if `Send Invoice Automatically = Yes`.
- Otherwise send internally/CC only.

---

## 6. Workflow 3: Confirmation First

### 6.1 When to use it

Use this when the customer must approve the order before invoicing.

### 6.2 First stage: sales submits the Order Confirmation Form

1. Open the Order Confirmation Form.
2. Select `Confirmation First`.
3. Fill the full order.
4. Set `Send Confirmation Automatically = Yes`.
5. Submit.

### 6.3 What the customer receives

The customer receives an email:

```text
[ORD] Order Confirmation with LogFresh - ORD-YYYYMMDD-###
```

The email includes:

- Order Confirmation PDF.
- `Approve Order` button.

The customer does not need to log in to Google.

The button uses this deployed Apps Script Web App:

```text
https://script.google.com/macros/s/AKfycbzTCUmG5RLjUoalUT_sM0MV1rkx2kuewbzqrdszYFHlRVkF7BMIUKWK9OjplnrQGJ2n/exec
```

The deployment is configured as:

```text
Execute as: USER_DEPLOYING
Access: ANYONE_ANONYMOUS
```

Everyday sales users do not need to touch this URL. They only need to make sure the `Approve Order` button opens for the customer.

### 6.4 What happens after customer approval

The system will:

- Change `Order Status` to `Customer Approved`.
- Record `Customer Approved At`.
- Send `[Approved] Order Confirmation needs shipping info` to the Salesperson Email/internal team.
- Include a Shipping Update Form link.

### 6.5 Internal team submits the Shipping Update Form

Open the update link from the `[Approved]` email and fill:

- `Order Number`
- `Ship Date`
- `Shipped Via`
- `Tracking Number`
- `Invoice Number`
- `Invoice Date`
- `Due Date`
- `Payment Method`
- `Customer Email`
- `Send Invoice Automatically`
- `Internal Notes`

If there are multiple packages, `Tracking Number` can be multiple lines, one tracking number per line.

If `Send Invoice Automatically = Yes`:

- The final invoice is generated.
- The invoice is sent to the customer.
- Internal emails are CC’d.

If blank or `No`:

- The invoice is generated.
- The customer is not emailed.
- Internal/archive emails are sent.

---

## 7. Reading the Google Sheet

The Google Sheet is the backend record system. Everyday users usually only need to check status and links.

### 7.1 Main tabs

| Tab | Purpose |
|---|---|
| `Order Confirmation` | Main order records from the Order Confirmation Form and system outputs |
| `Shipping Updates` | Responses from the Shipping Update Form and Invoice Shipping Info Update Form |
| `Customer Info` | Customer/order summary for Excel export and reporting |

### 7.2 Common columns

| Column | Meaning |
|---|---|
| `Order Number` | System order number |
| `Invoice Number` | System invoice number |
| `Order Status` | Current order status |
| `Order Confirmation URL` | Link to generated Order Confirmation |
| `Invoice URL` | Link to generated Invoice |
| `Customer Approval URL` | Customer approval link |
| `Customer Approved At` | Time customer approved |
| `Order Total` | Calculated total order amount |

### 7.3 Common statuses

| Status | Meaning |
|---|---|
| `Invoice Sent` | Invoice was sent to the customer |
| `Invoice Saved Internally` | Invoice was generated/sent internally only |
| `Awaiting Shipping Info` | Waiting for shipping/tracking information |
| `Pending Customer Approval` | Order Confirmation sent or generated, waiting for customer approval |
| `Customer Approved` | Customer clicked approval |

---

## 8. LogFresh menu in Google Sheets

Open the Google Sheet and use the top menu:

```text
LogFresh
```

### 8.1 Generate Order Confirmation for Selected Row

Use this to manually generate an Order Confirmation for the selected row.

### 8.2 Generate & Email Invoice for Selected Row

Use this to manually generate and email an invoice for the selected row.

Warning: this can send email. Use `Test Email Only` when testing.

### 8.3 Generate Invoice PDF Only for Selected Row

Use this to generate the invoice PDF but not send customer email.

### 8.4 Rebuild Customer Info Sheet

Use this when Customer Info needs to be refreshed.

### 8.5 Test Email Only

Use this before testing.

When it is on:

- Automated emails are sent only to `mcp@logfresh.net`.
- The test email shows the original intended To/Cc/Bcc at the top.
- Customers will not receive test emails.

### 8.6 Back to Normal

Use this after testing.

It restores normal customer/internal recipients and CC behavior.

Very important: after testing, click `Back to Normal` before using the system for real orders.

---

## 9. Email examples

### 9.1 Invoice email

Customer-facing invoice emails usually have subjects like:

```text
[INV] Invoice with LogFresh - INV-YYYYMMDD-###
```

They include:

- Invoice PDF.
- Order/invoice summary.
- Formal LogFresh signature.
- Internal CC recipients.

### 9.2 Order Confirmation email

Customer-facing Order Confirmation emails usually have subjects like:

```text
[ORD] Order Confirmation with LogFresh - ORD-YYYYMMDD-###
```

They include:

- Order Confirmation PDF.
- `Approve Order` button.

### 9.3 Internal shipping information email

Internal shipping emails may have subjects like:

```text
[Ship Info] Invoice needs shipping info - ORD-YYYYMMDD-###
[Approved] Order Confirmation needs shipping info - ORD-YYYYMMDD-###
```

They include:

- Order number.
- Invoice number if available.
- Customer name and company.
- Billing/shipping address.
- Phone and email.
- Product quantity and unit price.
- Button to open the correct update form.

---

## 10. Multiple tracking numbers

If an order ships in multiple packages, use one line per package.

Good example:

```text
1Z123456789 - Box 1
1Z987654321 - Box 2
9400110200881234567890 - USPS small box
```

This is supported in:

- Order Confirmation Form `Invoice Only` section.
- Shipping Update Form.
- Invoice Shipping Info Update Form.
- Invoice/customer email tracking display.
- Internal archive emails.

---

## 11. Safe testing process

### Step 1: Turn on Test Email Only

In the Google Sheet:

```text
LogFresh > Test Email Only
```

### Step 2: Submit a test order

Recommended first test:

```text
Workflow Type = Invoice Only
Send Confirmation Automatically = Yes
Customer Email = your own email or a safe test email
```

Because Test Email Only is on, the customer will not actually receive it.

### Step 3: Check the test email

Confirm:

- Subject is correct.
- PDF attachment is correct.
- Original intended recipients are listed at the top.
- Amount/date formatting looks correct.

### Step 4: Test shipping update workflow

Submit:

```text
Workflow Type = Invoice Only - Needs Shipping Info
```

Confirm:

- Internal `[Ship Info]` email arrives.
- Button opens the Invoice Shipping Info Update Form.
- Prefilled fields look correct.
- Multiple tracking numbers can be entered.

### Step 5: Test customer approval workflow

Submit:

```text
Workflow Type = Confirmation First
```

Confirm:

- Order Confirmation email is generated.
- Approval button opens without Google login.
- Internal `[Approved]` email is generated after approval.
- Shipping Update Form link works.

### Step 6: Return to normal

After testing:

```text
LogFresh > Back to Normal
```

Do not forget this step.

---

## 12. Troubleshooting

### 12.1 Customer did not receive email

Check:

1. Was `Test Email Only` still turned on?
2. Was Customer Email entered correctly?
3. Did the email go to spam/junk?
4. Was `Send Confirmation Automatically` set correctly?
5. Was the workflow supposed to send the customer at that stage?

### 12.2 Internal team did not receive email

Check:

1. Salesperson Email.
2. Internal CC configuration.
3. Test Email Only mode.
4. Apps Script execution log.

### 12.3 Update form says it cannot find the order

Usually this means the Order Number does not exactly match the main sheet.

Check:

1. Copy the Order Number from the main `Order Confirmation` tab.
2. Paste it into the update form.
3. Make sure there are no extra spaces.
4. Submit again.

### 12.4 Customer approval button does not work

Check:

1. `CONFIG.WEB_APP_URL` is set to the production Web App URL.
2. The Web App deployment is active.
3. The Web App access is `ANYONE_ANONYMOUS`.
4. The deployment executes as `USER_DEPLOYING`.
5. The order number exists in the main sheet.

### 12.5 Generated invoice is missing shipping/tracking

Check:

1. Was the invoice generated before tracking was entered?
2. Was the Invoice Shipping Info Update Form submitted?
3. Did the update form match the correct Order Number?
4. Was the newer invoice generated successfully?

---

## 13. What not to casually change

Do not casually rename these, because the script matches exact field names:

- Google Form question titles.
- Google Sheet tab names.
- Google Sheet header row.
- Google Docs template placeholders.
- Apps Script template IDs, folder IDs, and form IDs.
- Web App deployment.
- `CONFIG.WEB_APP_URL`.
- Apps Script trigger.

If a form question title must be changed, the script field mapping should be updated at the same time.

