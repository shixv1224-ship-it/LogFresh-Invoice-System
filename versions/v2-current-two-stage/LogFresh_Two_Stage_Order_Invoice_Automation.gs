const CONFIG = {
  ORDER_CONFIRMATION_TEMPLATE_ID: '1IKmEJH8gQ4Sv9376UEUHYFkvf7aYwZCQWfpkVfDx9FE',
  INVOICE_TEMPLATE_ID: '1HL7cBQRwKluDp4bqpjuwF3Cf7g3KPOFMm1bFTBQf0qA',
  OUTPUT_FOLDER_ID: '1fJ2NObstEyEbEoKcf-OSOdyrg1hhgpEU',

  // After you deploy this as a Web App, paste the Web App URL here.
  WEB_APP_URL: 'PASTE_WEB_APP_URL_HERE',

  // Keep these sheet tab names stable in the response spreadsheet.
  MAIN_ORDER_SHEET_NAME: 'Order Confirmation',
  SHIPPING_UPDATE_SHEET_NAME: 'Shipping Updates',

  // Create a Google Form 2 pre-filled link with sample values:
  // ORDER_NUMBER_HERE, SHIPPED_VIA_HERE, PAYMENT_METHOD_HERE, CUSTOMER_EMAIL_HERE, TRACKING_NUMBER_HERE,
  // INVOICE_NUMBER_HERE, INVOICE_DATE_HERE, DUE_DATE_HERE, SHIP_DATE_HERE.
  // Then paste it here and replace those sample values with:
  // {{ORDER_NUMBER}}, {{SHIPPED_VIA}}, {{PAYMENT_METHOD}}, {{CUSTOMER_EMAIL}}, {{TRACKING_NUMBER}},
  // {{INVOICE_NUMBER}}, {{INVOICE_DATE}}, {{DUE_DATE}}, {{SHIP_DATE}}.
  SHIPPING_UPDATE_PREFILL_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSdlpSmbvq0k7un_05NbavJORYKLKYPvsUlJDSbycCk-7Dq_JA/viewform?usp=pp_url&entry.1702925921={{ORDER_NUMBER}}&entry.1944921117={{SHIP_DATE}}&entry.484278379={{SHIPPED_VIA}}&entry.425491534={{TRACKING_NUMBER}}&entry.758881086={{INVOICE_NUMBER}}&entry.1591134602={{INVOICE_DATE}}&entry.1305380486={{DUE_DATE}}&entry.1574651488={{PAYMENT_METHOD}}&entry.1667371931={{CUSTOMER_EMAIL}}',

  COMPANY_NAME: 'LogFresh Biotechnology CO., LTD',
  COMPANY_ADDRESS: '708 N 29th Avenue APT 2, Yakima, WA 98902',
  COMPANY_PHONE: '215-696-1238',
  COMPANY_EMAIL: 'sales@awt-biotech.com',
  COMPANY_WEBSITE: 'www.logfresh.net',

  // Optional backup email for approval notices. The main approval notice goes to Salesperson Email.
  INTERNAL_NOTIFICATION_EMAIL: 'mcp@logfresh.net,lloyd@awt-biotech.com,tony@awt-biotech.com,aoweite6@awt-biotech.com',

  // These addresses are automatically copied on customer-facing emails.
  CUSTOMER_EMAIL_CC: 'lloyd@awt-biotech.com,tony@awt-biotech.com,aoweite6@awt-biotech.com,sales@awt-biotech.com,mcp@logfresh.net',
};

const STATUS = {
  PENDING_APPROVAL: 'Pending Customer Approval',
  APPROVED: 'Customer Approved',
  INVOICE_CREATED: 'Invoice Created',
  INVOICE_SENT: 'Invoice Sent',
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('LogFresh')
    .addItem('Generate Order Confirmation for Selected Row', 'generateOrderConfirmationForSelectedRow')
    .addItem('Generate & Email Invoice for Selected Row', 'generateAndEmailInvoiceForSelectedRow')
    .addSeparator()
    .addItem('Test Latest Row: Order Confirmation', 'testLatestRowOrderConfirmation')
    .addToUi();
}

function onFormSubmit(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  if (isShippingUpdateSheet_(sheet)) {
    processShippingUpdateFormRow_(sheet, row);
  } else {
    processOrderCreateFormRow_(sheet, row);
  }
}

function testLatestRowOrderConfirmation() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  generateOrderConfirmationForRow_(sheet, sheet.getLastRow());
}

function testLatestRowAutoWorkflow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  processOrderCreateFormRow_(sheet, sheet.getLastRow());
}

function generateOrderConfirmationForSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const row = sheet.getActiveRange().getRow();
  if (row === 1) throw new Error('Please select a data row, not the header row.');
  generateOrderConfirmationForRow_(sheet, row);
}

function generateAndEmailInvoiceForSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const row = sheet.getActiveRange().getRow();
  if (row === 1) throw new Error('Please select a data row, not the header row.');
  generateInvoiceForRow_(sheet, row, true);
}

function doGet(e) {
  const params = e.parameter || {};
  if (params.action !== 'approve') {
    return HtmlService.createHtmlOutput('Invalid approval link.');
  }

  const orderNumberParam = String(params.order || '').trim();
  if (!orderNumberParam) {
    return HtmlService.createHtmlOutput('Missing order number.');
  }

  const sheet = getMainOrderSheet_();
  const row = findRowByHeaderValue_(sheet, 'Order Number', orderNumberParam);
  if (!row) {
    return HtmlService.createHtmlOutput('This approval link was not found. Please contact LogFresh.');
  }

  writeResult_(sheet, row, 'Order Status', STATUS.APPROVED);
  writeResult_(sheet, row, 'Customer Approved At', new Date());

  const data = getRowData_(sheet, row);
  const orderNumber = getValue_(data, 'Order Number') || makeOrderNumber_(row);
  const customerName = getValue_(data, 'Bill To Name') || 'Customer';
  const shippedVia = getValue_(data, 'Shipped Via') || 'TBD';
  const salespersonEmail = getValue_(data, 'Salesperson Email');
  const paymentMethod = getValue_(data, 'Payment Method');
  const customerEmail = getValue_(data, 'Customer Email') || getValue_(data, 'Bill To Email');
  const trackingNumber = getValue_(data, 'Tracking Number');
  const invoiceNumber = getValue_(data, 'Invoice Number');
  const invoiceDate = getValue_(data, 'Invoice Date');
  const dueDate = getValue_(data, 'Due Date');
  const shipDate = getValue_(data, 'Ship Date');
  const shippingUpdateUrl = makeShippingUpdateFormUrl_(orderNumber, shippedVia, paymentMethod, customerEmail, trackingNumber, invoiceNumber, invoiceDate, dueDate, shipDate);
  const backupInternalEmail = CONFIG.INTERNAL_NOTIFICATION_EMAIL && !CONFIG.INTERNAL_NOTIFICATION_EMAIL.includes('PASTE_')
    ? CONFIG.INTERNAL_NOTIFICATION_EMAIL
    : '';
  const internalNoticeTo = salespersonEmail || backupInternalEmail;

  if (internalNoticeTo) {
    MailApp.sendEmail({
      to: internalNoticeTo,
      cc: salespersonEmail ? backupInternalEmail : undefined,
      subject: `[Approved] Order Confirmation needs shipping info - ${orderNumber}`,
      body:
        `Order ${orderNumber} has been approved by ${customerName}.\n\n` +
        `Shipping method: ${shippedVia}\n\n` +
        `Next step: submit shipping / tracking information here:\n${shippingUpdateUrl}\n\n` +
        `Order Number, Shipped Via, Payment Method, and Customer Email should already be filled in if the pre-filled Form 2 URL is configured.`,
      name: CONFIG.COMPANY_NAME,
      replyTo: CONFIG.COMPANY_EMAIL,
    });
  }

  return HtmlService.createHtmlOutput(
    `<p style="font-family:Arial,sans-serif;font-size:16px;">Thank you. Order <strong>${escapeHtml_(orderNumber)}</strong> has been approved.</p>`
  );
}

function processOrderCreateFormRow_(sheet, row) {
  const data = getRowData_(sheet, row);
  const workflow = getValue_(data, 'Workflow Type').toLowerCase();

  if (workflow.includes('invoice only')) {
    const shouldSendInvoice = shouldSendAutomatically_(data);
    generateInvoiceForRow_(sheet, row, shouldSendInvoice);
    sendShippingUpdateReminder_(sheet, row);
  } else {
    generateOrderConfirmationForRow_(sheet, row);
  }
}

function processShippingUpdateFormRow_(updateSheet, updateRow) {
  const updateData = getRowData_(updateSheet, updateRow);
  const orderNumber = getValue_(updateData, 'Order Number');
  const mainSheet = getMainOrderSheet_();

  const orderRow = orderNumber ? findRowByHeaderValue_(mainSheet, 'Order Number', orderNumber) : 0;
  if (!orderRow) {
    writeResult_(updateSheet, updateRow, 'Processing Status', `ERROR: Could not find matching order ${orderNumber}`);
    throw new Error(`Could not find matching order ${orderNumber}`);
  }

  [
    'Ship Date',
    'Shipped Via',
    'Tracking Number',
    'Invoice Number',
    'Invoice Date',
    'Due Date',
    'Payment Method',
    'Customer Email',
    'Internal Notes',
  ].forEach(header => {
    const value = getValue_(updateData, header);
    if (value) writeResult_(mainSheet, orderRow, header, value);
  });

  const shouldSend = getValue_(updateData, 'Send Invoice Automatically').toLowerCase() !== 'no';
  generateInvoiceForRow_(mainSheet, orderRow, shouldSend);
  writeResult_(updateSheet, updateRow, 'Processing Status', 'Complete');
}

function generateOrderConfirmationForRow_(sheet, row) {
  try {
    ensureInternalColumns_(sheet);
    ensureOrderNumber_(sheet, row);

    const data = getRowData_(sheet, row);
    const replacements = buildReplacements_(data, row, 'order');
    const orderNumber = replacements['{{ORDER_NUMBER}}'];
    const customerName = getValue_(data, 'Bill To Name') || getValue_(data, 'Bill To Company') || 'Customer';
    const recipient = getValue_(data, 'Customer Email') || getValue_(data, 'Bill To Email');
    const approvalUrl = makeApprovalUrl_(orderNumber);
    const salespersonEmail = getValue_(data, 'Salesperson Email');

    replacements['{{APPROVAL_URL}}'] = approvalUrl;

    const result = createPdfFromTemplate_({
      templateId: CONFIG.ORDER_CONFIRMATION_TEMPLATE_ID,
      baseName: `Order Confirmation ${orderNumber} - ${customerName}`,
      replacements,
    });

    writeResult_(sheet, row, 'Order Number', orderNumber);
    writeResult_(sheet, row, 'Order Status', STATUS.PENDING_APPROVAL);
    writeResult_(sheet, row, 'Customer Approval URL', approvalUrl);
    writeResult_(sheet, row, 'Order Confirmation URL', result.pdfFile.getUrl());

    const shouldSend = shouldSendAutomatically_(data);
    if (shouldSend && recipient) {
      MailApp.sendEmail({
        to: recipient,
        subject: `[ORD] Order Confirmation with LogFresh - ${orderNumber}`,
        body:
          `Hi ${customerName},\n\n` +
          `Please review the attached Order Confirmation.\n\n` +
          `If everything looks correct, please approve it here:\n${approvalUrl}\n\n` +
          `If changes are needed, please reply to this email.\n\n` +
          `Thank you,\n${CONFIG.COMPANY_NAME}`,
        htmlBody:
          `<p>Hi ${escapeHtml_(customerName)},</p>` +
          `<p>Please review the attached Order Confirmation.</p>` +
          `<p>If everything looks correct, please click below:</p>` +
          `<p><a href="${approvalUrl}" style="background:#2f6b2f;color:white;padding:10px 16px;text-decoration:none;border-radius:4px;">Approve Order</a></p>` +
          `<p>If changes are needed, please reply to this email.</p>` +
          `<p>Thank you,<br>${escapeHtml_(CONFIG.COMPANY_NAME)}</p>`,
        attachments: [result.pdfBlob],
        cc: joinEmails_(CONFIG.CUSTOMER_EMAIL_CC, salespersonEmail),
        name: CONFIG.COMPANY_NAME,
        replyTo: CONFIG.COMPANY_EMAIL,
      });
      writeResult_(sheet, row, 'Order Confirmation Sent At', new Date());
    }
  } catch (error) {
    writeResult_(sheet, row, 'Internal Notes', `Order Confirmation ERROR: ${error.message}`);
    throw error;
  }
}

function generateInvoiceForRow_(sheet, row, sendEmail) {
  try {
    ensureInternalColumns_(sheet);
    ensureOrderNumber_(sheet, row);

    const data = getRowData_(sheet, row);
    const trackingNumber = getValue_(data, 'Tracking Number');
    const replacements = buildReplacements_(data, row, 'invoice');
    const invoiceNumber = replacements['{{INVOICE_NUMBER}}'];
    const orderNumber = replacements['{{ORDER_NUMBER}}'];
    const customerName = getValue_(data, 'Bill To Name') || getValue_(data, 'Bill To Company') || 'Customer';
    const recipient = getValue_(data, 'Customer Email') || getValue_(data, 'Bill To Email');
    const salespersonEmail = getValue_(data, 'Salesperson Email');

    const result = createPdfFromTemplate_({
      templateId: CONFIG.INVOICE_TEMPLATE_ID,
      baseName: `Invoice ${invoiceNumber} - ${customerName}`,
      replacements,
    });

    writeResult_(sheet, row, 'Order Number', orderNumber);
    writeResult_(sheet, row, 'Invoice Number', invoiceNumber);
    writeResult_(sheet, row, 'Invoice URL', result.pdfFile.getUrl());
    writeResult_(sheet, row, 'Order Status', STATUS.INVOICE_CREATED);

    if (sendEmail && recipient) {
      MailApp.sendEmail({
        to: recipient,
        subject: `[INV] Invoice with LogFresh - ${invoiceNumber} / ${orderNumber}`,
        body:
          `Hi ${customerName},\n\n` +
          `Attached is the invoice for Order ${orderNumber}.\n\n` +
          `Shipping Method: ${getValue_(data, 'Shipped Via')}\n` +
          `Tracking Number: ${trackingNumber}\n\n` +
          `Thank you,\n${CONFIG.COMPANY_NAME}`,
        htmlBody:
          `<p>Hi ${escapeHtml_(customerName)},</p>` +
          `<p>Attached is the invoice for Order <strong>${escapeHtml_(orderNumber)}</strong>.</p>` +
          `<p>Shipping Method: ${escapeHtml_(getValue_(data, 'Shipped Via'))}<br>` +
          `Tracking Number: ${escapeHtml_(trackingNumber)}</p>` +
          `<p>Thank you,<br>${escapeHtml_(CONFIG.COMPANY_NAME)}</p>`,
        attachments: [result.pdfBlob],
        cc: joinEmails_(CONFIG.CUSTOMER_EMAIL_CC, salespersonEmail),
        name: CONFIG.COMPANY_NAME,
        replyTo: CONFIG.COMPANY_EMAIL,
      });
      writeResult_(sheet, row, 'Invoice Sent At', new Date());
      writeResult_(sheet, row, 'Order Status', STATUS.INVOICE_SENT);
    }
  } catch (error) {
    writeResult_(sheet, row, 'Internal Notes', `Invoice ERROR: ${error.message}`);
    throw error;
  }
}

function sendShippingUpdateReminder_(sheet, row) {
  const data = getRowData_(sheet, row);
  const orderNumber = getValue_(data, 'Order Number') || makeOrderNumber_(row);
  const customerName = getValue_(data, 'Bill To Name') || getValue_(data, 'Bill To Company') || 'Customer';
  const salespersonEmail = getValue_(data, 'Salesperson Email');
  const shippedVia = getValue_(data, 'Shipped Via') || 'TBD';
  const paymentMethod = getValue_(data, 'Payment Method');
  const customerEmail = getValue_(data, 'Customer Email') || getValue_(data, 'Bill To Email');
  const trackingNumber = getValue_(data, 'Tracking Number');
  const invoiceNumber = getValue_(data, 'Invoice Number');
  const invoiceDate = getValue_(data, 'Invoice Date');
  const dueDate = getValue_(data, 'Due Date');
  const shipDate = getValue_(data, 'Ship Date');
  const shippingUpdateUrl = makeShippingUpdateFormUrl_(orderNumber, shippedVia, paymentMethod, customerEmail, trackingNumber, invoiceNumber, invoiceDate, dueDate, shipDate);
  const backupInternalEmail = CONFIG.INTERNAL_NOTIFICATION_EMAIL && !CONFIG.INTERNAL_NOTIFICATION_EMAIL.includes('PASTE_')
    ? CONFIG.INTERNAL_NOTIFICATION_EMAIL
    : '';
  const internalNoticeTo = salespersonEmail || backupInternalEmail;

  if (!internalNoticeTo) return;

  MailApp.sendEmail({
    to: internalNoticeTo,
    cc: salespersonEmail ? backupInternalEmail : undefined,
    subject: `[Update] Invoice shipping information required - ${invoiceNumber || makeInvoiceNumberFromOrder_(orderNumber, row)} / ${orderNumber}`,
    body:
      `Order ${orderNumber} for ${customerName} is ready for shipping / packaging follow-up.\n\n` +
      `Shipping method: ${shippedVia}\n` +
      `Customer email: ${customerEmail}\n\n` +
      `After packaging is complete, submit tracking information here:\n${shippingUpdateUrl}\n\n` +
      `The update form should already include Order Number, Shipped Via, Payment Method, and Customer Email if the pre-filled Form 2 URL is configured.`,
    name: CONFIG.COMPANY_NAME,
    replyTo: CONFIG.COMPANY_EMAIL,
  });
}

function buildReplacements_(data, row, documentType) {
  const sameShipping = getValue_(data, 'Shipping Address Option').toLowerCase().includes('same');
  const orderNumber = getValue_(data, 'Order Number') || makeOrderNumber_(row);
  const invoiceNumber = getValue_(data, 'Invoice Number') || makeInvoiceNumberFromOrder_(orderNumber, row);
  const invoiceDate = getValue_(data, 'Invoice Date') || today_();
  const dueDate = getValue_(data, 'Due Date') || addDaysToDateText_(invoiceDate, 30);
  const subtotalInfo = buildLineItems_(data);
  const discount = numberValue_(data, 'Discount');
  const shipping = numberValue_(data, 'Shipping Charge');
  const taxRate = numberValue_(data, 'Tax Rate Percent') / 100;
  const tax = subtotalInfo.subtotal * taxRate;
  const total = subtotalInfo.subtotal - discount + shipping + tax;

  const replacements = {
    '{{COMPANY_NAME}}': CONFIG.COMPANY_NAME,
    '{{COMPANY_ADDRESS}}': CONFIG.COMPANY_ADDRESS,
    '{{COMPANY_PHONE}}': CONFIG.COMPANY_PHONE,
    '{{COMPANY_EMAIL}}': CONFIG.COMPANY_EMAIL,
    '{{COMPANY_WEBSITE}}': CONFIG.COMPANY_WEBSITE,

    '{{ORDER_NUMBER}}': orderNumber,
    '{{ORDER_DATE}}': getValue_(data, 'Order Date'),
    '{{INVOICE_NUMBER}}': invoiceNumber,
    '{{INVOICE_DATE}}': invoiceDate,
    '{{DUE_DATE}}': dueDate,
    '{{SHIP_DATE}}': getValue_(data, 'Ship Date'),

    '{{SALESPERSON}}': getValue_(data, 'Salesperson'),
    '{{SALESPERSON_EMAIL}}': getValue_(data, 'Salesperson Email'),
    '{{CUSTOMER_PO}}': getValue_(data, 'Customer PO'),
    '{{TRACKING_NUMBER}}': getValue_(data, 'Tracking Number'),
    '{{SHIPPED_VIA}}': getValue_(data, 'Shipped Via'),
    '{{PAYMENT_TERMS}}': getValue_(data, 'Payment Terms'),
    '{{PAYMENT_METHOD}}': getValue_(data, 'Payment Method'),

    '{{BILL_TO_NAME}}': getValue_(data, 'Bill To Name'),
    '{{BILL_TO_COMPANY}}': getValue_(data, 'Bill To Company'),
    '{{BILL_TO_ADDRESS}}': getValue_(data, 'Bill To Address'),
    '{{BILL_TO_CITY_STATE_ZIP}}': getValue_(data, 'Bill To City State ZIP'),
    '{{BILL_TO_PHONE}}': getValue_(data, 'Bill To Phone'),
    '{{BILL_TO_EMAIL}}': getValue_(data, 'Bill To Email'),

    '{{SHIP_TO_NAME}}': sameShipping ? getValue_(data, 'Bill To Name') : getValue_(data, 'Ship To Name'),
    '{{SHIP_TO_COMPANY}}': sameShipping ? getValue_(data, 'Bill To Company') : getValue_(data, 'Ship To Company'),
    '{{SHIP_TO_ADDRESS}}': sameShipping ? getValue_(data, 'Bill To Address') : getValue_(data, 'Ship To Address'),
    '{{SHIP_TO_CITY_STATE_ZIP}}': sameShipping ? getValue_(data, 'Bill To City State ZIP') : getValue_(data, 'Ship To City State ZIP'),
    '{{SHIP_TO_PHONE}}': sameShipping ? getValue_(data, 'Bill To Phone') : getValue_(data, 'Ship To Phone'),
    '{{SHIP_TO_EMAIL}}': sameShipping ? getValue_(data, 'Bill To Email') : getValue_(data, 'Ship To Email'),

    '{{COMMENTS}}': getValue_(data, 'Comments'),
    '{{SUBTOTAL}}': money_(subtotalInfo.subtotal),
    '{{DISCOUNT}}': money_(discount),
    '{{SHIPPING}}': money_(shipping),
    '{{TAX}}': money_(tax),
    '{{TOTAL}}': money_(total),
    '{{BALANCE_DUE}}': money_(total),
  };

  Object.assign(replacements, subtotalInfo.replacements);
  return replacements;
}

function buildLineItems_(data) {
  let subtotal = 0;
  const replacements = {};

  for (let i = 1; i <= 6; i++) {
    const qtyText = getValue_(data, `Item ${i} Quantity`);
    const description = getValue_(data, `Item ${i} Description`);
    const priceText = getValue_(data, `Item ${i} Unit Price`);
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

  return { subtotal, replacements };
}

function createPdfFromTemplate_({ templateId, baseName, replacements }) {
  if (!templateId || templateId.includes('PASTE_')) {
    throw new Error('Template ID is missing in CONFIG.');
  }
  if (!CONFIG.OUTPUT_FOLDER_ID || CONFIG.OUTPUT_FOLDER_ID.includes('PASTE_')) {
    throw new Error('Output folder ID is missing in CONFIG.');
  }

  const outputFolder = DriveApp.getFolderById(CONFIG.OUTPUT_FOLDER_ID);
  const template = DriveApp.getFileById(templateId);
  const documentFile = template.makeCopy(baseName, outputFolder);
  const document = DocumentApp.openById(documentFile.getId());

  replaceInSection_(document.getBody(), replacements);
  replaceInSection_(document.getHeader(), replacements);
  replaceInSection_(document.getFooter(), replacements);
  document.saveAndClose();

  const pdfBlob = documentFile.getAs(MimeType.PDF).setName(`${baseName}.pdf`);
  const pdfFile = outputFolder.createFile(pdfBlob);
  return { documentFile, pdfFile, pdfBlob };
}

function makeApprovalUrl_(orderNumber) {
  if (!CONFIG.WEB_APP_URL || CONFIG.WEB_APP_URL.includes('PASTE_')) {
    return 'WEB_APP_URL_NOT_CONFIGURED';
  }
  return `${CONFIG.WEB_APP_URL}?action=approve&order=${encodeURIComponent(orderNumber)}`;
}

function makeShippingUpdateFormUrl_(orderNumber, shippedVia, paymentMethod, customerEmail, trackingNumber, invoiceNumber, invoiceDate, dueDate, shipDate) {
  if (!CONFIG.SHIPPING_UPDATE_PREFILL_URL || CONFIG.SHIPPING_UPDATE_PREFILL_URL.includes('PASTE_')) {
    return 'FORM_2_PREFILLED_URL_NOT_CONFIGURED';
  }
  return CONFIG.SHIPPING_UPDATE_PREFILL_URL
    .replace('{{ORDER_NUMBER}}', encodeURIComponent(orderNumber || ''))
    .replace('{{SHIPPED_VIA}}', encodeURIComponent(shippedVia || ''))
    .replace('{{PAYMENT_METHOD}}', encodeURIComponent(paymentMethod || ''))
    .replace('{{CUSTOMER_EMAIL}}', encodeURIComponent(customerEmail || ''))
    .replace('{{TRACKING_NUMBER}}', encodeURIComponent(trackingNumber || ''))
    .replace('{{INVOICE_NUMBER}}', encodeURIComponent(invoiceNumber || ''))
    .replace('{{INVOICE_DATE}}', encodeURIComponent(invoiceDate || ''))
    .replace('{{DUE_DATE}}', encodeURIComponent(dueDate || ''))
    .replace('{{SHIP_DATE}}', encodeURIComponent(shipDate || ''));
}

function ensureInternalColumns_(sheet) {
  [
    'Order Status',
    'Order Confirmation URL',
    'Order Confirmation Sent At',
    'Customer Approval URL',
    'Customer Approved At',
    'Ship Date',
    'Tracking Number',
    'Invoice Number',
    'Invoice Date',
    'Due Date',
    'Invoice URL',
    'Invoice Sent At',
    'Internal Notes',
  ].forEach(header => ensureColumn_(sheet, header));
}

function getRowData_(sheet, row) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const values = sheet.getRange(row, 1, 1, lastColumn).getDisplayValues()[0];
  const data = {};
  headers.forEach((header, index) => {
    data[String(header).trim()] = values[index];
  });
  return data;
}

function getMainOrderSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(CONFIG.MAIN_ORDER_SHEET_NAME) || ss.getSheets()[0];
}

function isShippingUpdateSheet_(sheet) {
  if (sheet.getName() === CONFIG.SHIPPING_UPDATE_SHEET_NAME) return true;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].map(String);
  return headers.includes('Order Number') && headers.includes('Tracking Number') && !headers.includes('Bill To Name');
}

function getValue_(data, name) {
  return String(data[name] || '').trim();
}

function numberValue_(data, name) {
  return parseNumber_(getValue_(data, name));
}

function replaceInSection_(section, replacements) {
  if (!section) return;
  Object.entries(replacements).forEach(([placeholder, value]) => {
    section.replaceText(escapeRegex_(placeholder), String(value ?? ''));
  });
}

function findRowByHeaderValue_(sheet, header, value) {
  const column = getColumnByHeader_(sheet, header);
  if (!column) return 0;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const values = sheet.getRange(2, column, lastRow - 1, 1).getDisplayValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === value) return i + 2;
  }
  return 0;
}

function writeResult_(sheet, row, header, value) {
  const column = ensureColumn_(sheet, header);
  sheet.getRange(row, column).setValue(value);
}

function ensureColumn_(sheet, header) {
  const existing = getColumnByHeader_(sheet, header);
  if (existing) return existing;
  const column = sheet.getLastColumn() + 1;
  sheet.getRange(1, column).setValue(header);
  return column;
}

function ensureOrderNumber_(sheet, row) {
  const data = getRowData_(sheet, row);
  const existing = getValue_(data, 'Order Number');
  if (existing) return existing;

  const orderNumber = makeNextDailyNumber_(sheet, 'Order Number', 'ORD');
  writeResult_(sheet, row, 'Order Number', orderNumber);
  return orderNumber;
}

function makeNextDailyNumber_(sheet, header, prefix) {
  const datePart = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
  const numberPrefix = `${prefix}-${datePart}-`;
  const column = getColumnByHeader_(sheet, header);
  let maxSequence = 0;

  if (column) {
    const lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      const values = sheet.getRange(2, column, lastRow - 1, 1).getDisplayValues();
      values.forEach(row => {
        const value = String(row[0] || '').trim();
        if (value.startsWith(numberPrefix)) {
          const sequence = Number(value.slice(numberPrefix.length));
          if (Number.isFinite(sequence)) maxSequence = Math.max(maxSequence, sequence);
        }
      });
    }
  }

  return numberPrefix + String(maxSequence + 1).padStart(3, '0');
}

function getColumnByHeader_(sheet, header) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  return headers.indexOf(header) + 1;
}

function parseNumber_(value) {
  const cleaned = String(value || '').replace(/[$,%\s]/g, '').replace(/,/g, '');
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function money_(value) {
  return '$' + Number(value || 0).toFixed(2);
}

function joinEmails_(...groups) {
  return groups
    .flatMap(group => String(group || '').split(/[;,]/))
    .map(email => email.trim())
    .filter(Boolean)
    .filter((email, index, array) => array.indexOf(email) === index)
    .join(',');
}

function shouldSendAutomatically_(data) {
  return getValue_(data, 'Send Confirmation Automatically').toLowerCase() !== 'no';
}

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy');
}

function addDaysToDateText_(dateText, days) {
  const date = parseDateText_(dateText) || new Date();
  date.setDate(date.getDate() + days);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM/dd/yyyy');
}

function parseDateText_(dateText) {
  const text = String(dateText || '').trim();
  if (!text) return null;

  const mmddyyyy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyy) {
    return new Date(Number(mmddyyyy[3]), Number(mmddyyyy[1]) - 1, Number(mmddyyyy[2]));
  }

  const yyyymmdd = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (yyyymmdd) {
    return new Date(Number(yyyymmdd[1]), Number(yyyymmdd[2]) - 1, Number(yyyymmdd[3]));
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function makeOrderNumber_(row) {
  return 'ORD-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd') + '-' + String(row).padStart(3, '0');
}

function makeInvoiceNumberFromOrder_(orderNumber, row) {
  if (String(orderNumber || '').startsWith('ORD-')) {
    return String(orderNumber).replace(/^ORD-/, 'INV-');
  }
  return 'INV-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd') + '-' + String(row).padStart(3, '0');
}

function escapeRegex_(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml_(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
