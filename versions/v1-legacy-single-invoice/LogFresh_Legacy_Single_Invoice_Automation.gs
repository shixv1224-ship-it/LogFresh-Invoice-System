// Archived legacy script: single-stage invoice generation only.
// Superseded by apps-script/LogFresh_Two_Stage_Order_Invoice_Automation.gs.

const CONFIG = {
  TEMPLATE_ID: 'PASTE_TEMPLATE_ID_HERE',
  OUTPUT_FOLDER_ID: 'PASTE_FOLDER_ID_HERE',

  COMPANY_NAME: 'Harvest Smart / LogFresh',
  COMPANY_ADDRESS: 'PASTE COMPANY ADDRESS',
  COMPANY_PHONE: 'PASTE COMPANY PHONE',
  COMPANY_EMAIL: 'PASTE COMPANY EMAIL',
  COMPANY_WEBSITE: 'www.logfresh.net',
};

function onFormSubmit(e) {
  processInvoiceRow_(e.range.getSheet(), e.range.getRow());
}

function testLatestRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  processInvoiceRow_(sheet, sheet.getLastRow());
}

function processInvoiceRow_(sheet, row) {
  try {
    const data = getRowData_(sheet, row);
    const get = name => String(data[name] || '').trim();
    const number = name => parseNumber_(get(name));
    const invoiceNumber = get('Invoice Number') || makeInvoiceNumber_();
    const billToName = get('Bill To Name');
    const sameShipping = get('Shipping Address Option').toLowerCase().includes('same');

    let subtotal = 0;
    const replacements = {
      '{{COMPANY_NAME}}': CONFIG.COMPANY_NAME,
      '{{COMPANY_ADDRESS}}': CONFIG.COMPANY_ADDRESS,
      '{{COMPANY_PHONE}}': CONFIG.COMPANY_PHONE,
      '{{COMPANY_EMAIL}}': CONFIG.COMPANY_EMAIL,
      '{{COMPANY_WEBSITE}}': CONFIG.COMPANY_WEBSITE,

      '{{INVOICE_NUMBER}}': invoiceNumber,
      '{{INVOICE_DATE}}': get('Invoice Date'),
      '{{DUE_DATE}}': get('Due Date'),
      '{{SALESPERSON}}': get('Salesperson'),
      '{{CUSTOMER_PO}}': get('Customer PO'),
      '{{TRACKING_NUMBER}}': get('Tracking Number'),
      '{{SHIPPED_VIA}}': get('Shipped Via'),
      '{{PAYMENT_TERMS}}': get('Payment Terms'),
      '{{PAYMENT_METHOD}}': get('Payment Method'),

      '{{BILL_TO_NAME}}': billToName,
      '{{BILL_TO_COMPANY}}': get('Bill To Company'),
      '{{BILL_TO_ADDRESS}}': get('Bill To Address'),
      '{{BILL_TO_CITY_STATE_ZIP}}': get('Bill To City State ZIP'),
      '{{BILL_TO_PHONE}}': get('Bill To Phone'),
      '{{BILL_TO_EMAIL}}': get('Bill To Email'),

      '{{SHIP_TO_NAME}}': sameShipping ? billToName : get('Ship To Name'),
      '{{SHIP_TO_COMPANY}}': sameShipping ? get('Bill To Company') : get('Ship To Company'),
      '{{SHIP_TO_ADDRESS}}': sameShipping ? get('Bill To Address') : get('Ship To Address'),
      '{{SHIP_TO_CITY_STATE_ZIP}}': sameShipping ? get('Bill To City State ZIP') : get('Ship To City State ZIP'),
      '{{SHIP_TO_PHONE}}': sameShipping ? get('Bill To Phone') : get('Ship To Phone'),
      '{{SHIP_TO_EMAIL}}': sameShipping ? get('Bill To Email') : get('Ship To Email'),

      '{{COMMENTS}}': get('Comments'),
    };

    for (let i = 1; i <= 6; i++) {
      const qtyText = get(`Item ${i} Quantity`);
      const description = get(`Item ${i} Description`);
      const priceText = get(`Item ${i} Unit Price`);
      const qty = parseNumber_(qtyText);
      const price = parseNumber_(priceText);
      const active = Boolean(qtyText || description || priceText);
      const amount = active ? qty * price : 0;
      subtotal += amount;

      replacements[`{{QTY${i}}}`] = active ? qtyText : '';
      replacements[`{{DESC${i}}}`] = active ? description : '';
      replacements[`{{PRICE${i}}}`] = active ? money_(price) : '';
      replacements[`{{AMOUNT${i}}}`] = active ? money_(amount) : '';
    }

    const discount = number('Discount');
    const shipping = number('Shipping Charge');
    const taxRate = number('Tax Rate Percent') / 100;
    const amountPaid = number('Amount Paid');
    const tax = subtotal * taxRate;
    const total = subtotal - discount + shipping + tax;
    const balanceDue = total - amountPaid;

    Object.assign(replacements, {
      '{{SUBTOTAL}}': money_(subtotal),
      '{{DISCOUNT}}': money_(discount),
      '{{SHIPPING}}': money_(shipping),
      '{{TAX}}': money_(tax),
      '{{TOTAL}}': money_(total),
      '{{BALANCE_DUE}}': money_(balanceDue),
    });

    const outputFolder = DriveApp.getFolderById(CONFIG.OUTPUT_FOLDER_ID);
    const template = DriveApp.getFileById(CONFIG.TEMPLATE_ID);
    const safeCustomer = billToName || get('Bill To Company') || 'Customer';
    const baseName = `${invoiceNumber} - ${safeCustomer}`;
    const documentFile = template.makeCopy(baseName, outputFolder);
    const document = DocumentApp.openById(documentFile.getId());

    replaceInSection_(document.getBody(), replacements);
    replaceInSection_(document.getHeader(), replacements);
    replaceInSection_(document.getFooter(), replacements);
    document.saveAndClose();

    const pdfBlob = documentFile.getAs(MimeType.PDF).setName(`${baseName}.pdf`);
    const pdfFile = outputFolder.createFile(pdfBlob);

    let emailStatus = 'Not requested';
    if (get('Send Invoice Automatically').toLowerCase() === 'yes') {
      const recipient = get('Customer Email') || get('Bill To Email');
      if (recipient) {
        MailApp.sendEmail({
          to: recipient,
          subject: `Invoice ${invoiceNumber} from ${CONFIG.COMPANY_NAME}`,
          body: `Hello ${billToName || 'Customer'},\n\nAttached is invoice ${invoiceNumber}.\n\nThank you,\n${CONFIG.COMPANY_NAME}`,
          attachments: [pdfBlob],
          name: CONFIG.COMPANY_NAME,
          replyTo: CONFIG.COMPANY_EMAIL,
        });
        emailStatus = `Sent to ${recipient}`;
      } else {
        emailStatus = 'Not sent: customer email missing';
      }
    }

    writeResult_(sheet, row, 'Generated Invoice Number', invoiceNumber);
    writeResult_(sheet, row, 'Invoice Doc URL', documentFile.getUrl());
    writeResult_(sheet, row, 'Invoice PDF URL', pdfFile.getUrl());
    writeResult_(sheet, row, 'Invoice Total', total);
    writeResult_(sheet, row, 'Email Status', emailStatus);
    writeResult_(sheet, row, 'Processing Status', 'Complete');
  } catch (error) {
    writeResult_(sheet, row, 'Processing Status', `ERROR: ${error.message}`);
    throw error;
  }
}

function getRowData_(sheet, row) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const values = sheet.getRange(row, 1, 1, lastColumn).getDisplayValues()[0];
  const data = {};
  headers.forEach((header, index) => data[String(header).trim()] = values[index]);
  return data;
}

function replaceInSection_(section, replacements) {
  if (!section) return;
  Object.entries(replacements).forEach(([placeholder, value]) => {
    section.replaceText(escapeRegex_(placeholder), String(value ?? ''));
  });
}

function writeResult_(sheet, row, header, value) {
  let lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  let column = headers.indexOf(header) + 1;
  if (!column) {
    column = lastColumn + 1;
    sheet.getRange(1, column).setValue(header);
  }
  sheet.getRange(row, column).setValue(value);
}

function parseNumber_(value) {
  const cleaned = String(value || '').replace(/[$,%\s]/g, '').replace(/,/g, '');
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function money_(value) {
  return '$' + Number(value || 0).toFixed(2);
}

function makeInvoiceNumber_() {
  return 'INV-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
}

function escapeRegex_(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
