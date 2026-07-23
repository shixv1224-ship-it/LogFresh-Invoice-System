const CONFIG = {
  ORDER_CONFIRMATION_TEMPLATE_ID: '1IKmEJH8gQ4Sv9376UEUHYFkvf7aYwZCQWfpkVfDx9FE',
  INVOICE_TEMPLATE_ID: '1HL7cBQRwKluDp4bqpjuwF3Cf7g3KPOFMm1bFTBQf0qA',
  OUTPUT_FOLDER_ID: '1fJ2NObstEyEbEoKcf-OSOdyrg1hhgpEU',
  ORDER_CONFIRMATION_OUTPUT_FOLDER_ID: '15cT5Z39SKmQYDteIgMZtuAhu8bQiGdGa',
  INVOICE_OUTPUT_FOLDER_ID: '1ywiGiGlVqRbtdETpYNZ7q7MzBiBgehkv',

  // After you deploy this as a Web App, paste the Web App URL here.
  WEB_APP_URL: 'PASTE_WEB_APP_URL_HERE',

  // Keep these sheet tab names stable in the response spreadsheet.
  MAIN_ORDER_SHEET_NAME: 'Order Confirmation',
  SHIPPING_UPDATE_SHEET_NAME: 'Shipping Updates',

  ORDER_FORM_ID: '15Dj28MbzhU4HG8ZtR6mcXAjqc96SBjs4dnODaFlcSIc',
  SHIPPING_UPDATE_FORM_ID: '1dXcLM-VcafxilriKffGgS3tMMU9Yja7y2Zoo9v6kCC8',

  // Optional: set this to a separate Google Sheets spreadsheet ID if customer info should live in its own file.
  // Leave blank to keep using a tab in the main response spreadsheet.
  CUSTOMER_INFO_SPREADSHEET_ID: '1J-5LH2qpLD7jpPPRB-XpEKfODC7YOgrJFM6z6b3TSpk',
  CUSTOMER_INFO_SHEET_NAME: 'Customer Info',
  LEGACY_CUSTOMER_INFO_SHEET_NAME: '客户有效信息',

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

const FORM_CHOICES = {
  PAYMENT_METHOD: ['Credit Card', 'Prepaid', 'Check/Wire Transfer'],
  US_STATES: [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC',
  ],
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('LogFresh')
    .addItem('Generate Order Confirmation for Selected Row', 'generateOrderConfirmationForSelectedRow')
    .addItem('Generate & Email Invoice for Selected Row', 'generateAndEmailInvoiceForSelectedRow')
    .addItem('Generate Invoice PDF Only for Selected Row', 'generateInvoicePdfOnlyForSelectedRow')
    .addItem('Rebuild Customer Info Sheet', 'rebuildCustomerInfoSheet')
    .addItem('Sync Form Address Fields', 'syncFormAddressFields')
    .addSeparator()
    .addItem('Test Latest Row: Order Confirmation', 'testLatestRowOrderConfirmation')
    .addToUi();
  ensureGoogleFormsSetupSafely_();
}

function onFormSubmit(e) {
  ensureGoogleFormsSetupSafely_();
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

function generateInvoicePdfOnlyForSelectedRow() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const row = sheet.getActiveRange().getRow();
  if (row === 1) {
    ui.alert('Please select a data row, not the header row.');
    return;
  }

  const response = ui.alert(
    'Generate Invoice PDF Only',
    'This will generate/update the invoice PDF and save it to Drive. No email will be sent. Continue?',
    ui.ButtonSet.OK_CANCEL
  );
  if (response !== ui.Button.OK) return;

  generateInvoiceForRow_(sheet, row, false);

  const data = getRowData_(sheet, row);
  const invoiceUrl = getValue_(data, 'Invoice URL');
  ui.alert(
    'Invoice PDF Created',
    invoiceUrl
      ? `The invoice PDF was saved to Drive.\n\nInvoice URL:\n${invoiceUrl}`
      : 'The invoice PDF was created and saved to Drive. Please check the Invoice URL column.',
    ui.ButtonSet.OK
  );
}

function rebuildCustomerInfoSheet() {
  rebuildCustomerInfoSheet_();
}

function syncFormAddressFields() {
  ensureGoogleFormsSetup_();

  const sheet = getMainOrderSheet_();
  ensureInternalColumns_(sheet);
  const lastRow = sheet.getLastRow();
  for (let row = 2; row <= lastRow; row++) {
    const data = getRowData_(sheet, row);
    backfillSplitAddressColumnsForRow_(sheet, row, data);
  }

  SpreadsheetApp.getUi().alert(
    'Address Fields Synced',
    'Form 1 address fields and the main sheet address columns have been synced.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
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
    generateInvoiceForRow_(sheet, row, shouldSendInvoice, !shouldSendInvoice);
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
  generateInvoiceForRow_(mainSheet, orderRow, shouldSend, false, true);
  writeResult_(updateSheet, updateRow, 'Processing Status', 'Complete');
}

function generateOrderConfirmationForRow_(sheet, row) {
  try {
    ensureInternalColumns_(sheet);
    ensureOrderNumber_(sheet, row);

    let data = getRowData_(sheet, row);
    backfillSplitAddressColumnsForRow_(sheet, row, data);
    data = getRowData_(sheet, row);
    const replacements = buildReplacements_(data, row, 'order');
    const orderNumber = replacements['{{ORDER_NUMBER}}'];
    const customerName = getValue_(data, 'Bill To Name') || getValue_(data, 'Bill To Company') || 'Customer';
    const fileCustomerName = getValue_(data, 'Bill To Company') || customerName;
    const recipient = getValue_(data, 'Customer Email') || getValue_(data, 'Bill To Email');
    const approvalUrl = makeApprovalUrl_(orderNumber);
    const salespersonEmail = getValue_(data, 'Salesperson Email');

    replacements['{{APPROVAL_URL}}'] = approvalUrl;

    const result = createPdfFromTemplate_({
      templateId: CONFIG.ORDER_CONFIRMATION_TEMPLATE_ID,
      folderId: CONFIG.ORDER_CONFIRMATION_OUTPUT_FOLDER_ID,
      baseName: `Order Confirmation ${orderNumber} - ${fileCustomerName}`,
      replacements,
    });

    writeResult_(sheet, row, 'Order Number', orderNumber);
    writeResult_(sheet, row, 'Order Total', replacements['{{TOTAL}}']);
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
    syncCustomerInfoForRow_(sheet, row);
  } catch (error) {
    writeResult_(sheet, row, 'Internal Notes', `Order Confirmation ERROR: ${error.message}`);
    throw error;
  }
}

function generateInvoiceForRow_(sheet, row, sendEmail, sendInternalArchive, replaceExistingInvoiceFiles) {
  try {
    ensureInternalColumns_(sheet);
    ensureOrderNumber_(sheet, row);

    let data = getRowData_(sheet, row);
    backfillSplitAddressColumnsForRow_(sheet, row, data);
    data = getRowData_(sheet, row);
    const trackingNumber = getValue_(data, 'Tracking Number');
    const replacements = buildReplacements_(data, row, 'invoice');
    const invoiceNumber = replacements['{{INVOICE_NUMBER}}'];
    const orderNumber = replacements['{{ORDER_NUMBER}}'];
    const customerName = getValue_(data, 'Bill To Name') || getValue_(data, 'Bill To Company') || 'Customer';
    const fileCustomerName = getValue_(data, 'Bill To Company') || customerName;
    const recipient = getValue_(data, 'Customer Email') || getValue_(data, 'Bill To Email');
    const salespersonEmail = getValue_(data, 'Salesperson Email');
    const baseName = `Invoice ${invoiceNumber} - ${fileCustomerName}`;
    const existingInvoiceFileIds = replaceExistingInvoiceFiles
      ? collectExistingInvoiceFileIds_(data, baseName)
      : [];

    const result = createPdfFromTemplate_({
      templateId: CONFIG.INVOICE_TEMPLATE_ID,
      folderId: CONFIG.INVOICE_OUTPUT_FOLDER_ID,
      baseName,
      replacements,
    });

    if (replaceExistingInvoiceFiles) {
      trashFilesById_(existingInvoiceFileIds, [result.documentFile.getId(), result.pdfFile.getId()]);
    }

    writeResult_(sheet, row, 'Order Number', orderNumber);
    writeResult_(sheet, row, 'Invoice Number', invoiceNumber);
    writeResult_(sheet, row, 'Order Total', replacements['{{TOTAL}}']);
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
    } else if (sendInternalArchive) {
      sendInvoiceInternalArchiveEmail_({
        data,
        result,
        invoiceNumber,
        orderNumber,
        customerName,
        trackingNumber,
      });
      writeResult_(sheet, row, 'Invoice Internal Archive Sent At', new Date());
    }
    syncCustomerInfoForRow_(sheet, row);
  } catch (error) {
    writeResult_(sheet, row, 'Internal Notes', `Invoice ERROR: ${error.message}`);
    throw error;
  }
}

function sendInvoiceInternalArchiveEmail_({ data, result, invoiceNumber, orderNumber, customerName, trackingNumber }) {
  const salespersonEmail = getValue_(data, 'Salesperson Email');
  const internalEmails = CONFIG.CUSTOMER_EMAIL_CC && !CONFIG.CUSTOMER_EMAIL_CC.includes('PASTE_')
    ? CONFIG.CUSTOMER_EMAIL_CC
    : CONFIG.INTERNAL_NOTIFICATION_EMAIL;
  const recipient = salespersonEmail || internalEmails;
  if (!recipient) return;

  MailApp.sendEmail({
    to: recipient,
    cc: salespersonEmail ? internalEmails : undefined,
    subject: `[INV Internal] Invoice archive copy - ${invoiceNumber} / ${orderNumber}`,
    body:
      `Internal archive copy only. This invoice was not sent to the customer automatically.\n\n` +
      `Customer: ${customerName}\n` +
      `Order Number: ${orderNumber}\n` +
      `Invoice Number: ${invoiceNumber}\n` +
      `Shipping Method: ${getValue_(data, 'Shipped Via')}\n` +
      `Tracking Number: ${trackingNumber}\n\n` +
      `Invoice Drive URL: ${result.pdfFile.getUrl()}`,
    htmlBody:
      `<p><strong>Internal archive copy only.</strong> This invoice was not sent to the customer automatically.</p>` +
      `<p>Customer: ${escapeHtml_(customerName)}<br>` +
      `Order Number: ${escapeHtml_(orderNumber)}<br>` +
      `Invoice Number: ${escapeHtml_(invoiceNumber)}<br>` +
      `Shipping Method: ${escapeHtml_(getValue_(data, 'Shipped Via'))}<br>` +
      `Tracking Number: ${escapeHtml_(trackingNumber)}</p>` +
      `<p>Invoice Drive URL: <a href="${result.pdfFile.getUrl()}">${result.pdfFile.getUrl()}</a></p>`,
    attachments: [result.pdfBlob],
    name: CONFIG.COMPANY_NAME,
    replyTo: CONFIG.COMPANY_EMAIL,
  });
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
  const billToCity = getAddressPart_(data, 'Bill To', 'City');
  const billToState = getAddressPart_(data, 'Bill To', 'State');
  const billToZip = getAddressPart_(data, 'Bill To', 'ZIP');
  const shipToCity = sameShipping ? billToCity : getAddressPart_(data, 'Ship To', 'City');
  const shipToState = sameShipping ? billToState : getAddressPart_(data, 'Ship To', 'State');
  const shipToZip = sameShipping ? billToZip : getAddressPart_(data, 'Ship To', 'ZIP');

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
    '{{BILL_TO_CITY}}': billToCity,
    '{{BILL_TO_STATE}}': billToState,
    '{{BILL_TO_ZIP}}': billToZip,
    '{{BILL_TO_CITY_STATE_ZIP}}': formatCityStateZip_(billToCity, billToState, billToZip),
    '{{BILL_TO_PHONE}}': getValue_(data, 'Bill To Phone'),
    '{{BILL_TO_EMAIL}}': getValue_(data, 'Bill To Email'),

    '{{SHIP_TO_NAME}}': sameShipping ? getValue_(data, 'Bill To Name') : getValue_(data, 'Ship To Name'),
    '{{SHIP_TO_COMPANY}}': sameShipping ? getValue_(data, 'Bill To Company') : getValue_(data, 'Ship To Company'),
    '{{SHIP_TO_ADDRESS}}': sameShipping ? getValue_(data, 'Bill To Address') : getValue_(data, 'Ship To Address'),
    '{{SHIP_TO_CITY}}': shipToCity,
    '{{SHIP_TO_STATE}}': shipToState,
    '{{SHIP_TO_ZIP}}': shipToZip,
    '{{SHIP_TO_CITY_STATE_ZIP}}': formatCityStateZip_(shipToCity, shipToState, shipToZip),
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
    replacements[`{{PRICE${i}}}`] = active ? unitPrice_(priceText) : '';
    replacements[`{{AMOUNT${i}}}`] = active ? money_(amount) : '';
  }

  return { subtotal, replacements };
}

function rebuildCustomerInfoSheet_() {
  const mainSheet = getMainOrderSheet_();
  const customerSheet = getOrCreateCustomerInfoSheet_();
  const headers = getCustomerInfoHeaders_();
  customerSheet.clearContents();
  customerSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  const lastRow = mainSheet.getLastRow();
  for (let row = 2; row <= lastRow; row++) {
    syncCustomerInfoForRow_(mainSheet, row);
  }

  formatCustomerInfoSheet_(customerSheet);
}

function syncCustomerInfoForRow_(sheet, row) {
  if (sheet.getName() !== CONFIG.MAIN_ORDER_SHEET_NAME) return;

  const data = getRowData_(sheet, row);
  if (shouldSkipCustomerInfoRow_(data)) return;

  const customerSheet = getOrCreateCustomerInfoSheet_();
  ensureCustomerInfoHeaders_(customerSheet);

  const record = buildCustomerInfoRecord_(data);
  const key = makeCustomerInfoKey_(record);
  if (!key) return;

  const headers = getCustomerInfoHeaders_();
  const existingRow = findCustomerInfoRow_(customerSheet, key);

  if (existingRow) {
    const existingRecord = readCustomerInfoRecord_(customerSheet, existingRow);
    const mergedRecord = mergeCustomerInfoRecords_(existingRecord, record);
    customerSheet.getRange(existingRow, 1, 1, headers.length).setValues([headers.map(header => mergedRecord[header] || '')]);
  } else {
    customerSheet.appendRow(headers.map(header => record[header] || ''));
  }

  formatCustomerInfoSheet_(customerSheet);
}

function getCustomerInfoHeaders_() {
  return [
    'Customer Name',
    'Salesperson',
    'Company / Farm',
    'Phone',
    'Email',
    'Alternate Email / Notes',
    'Billing Address',
    'Billing City',
    'Billing State',
    'Billing ZIP',
    'Payment Terms',
    'Payment Method',
    'Latest Order Date',
    'Latest Order Number',
    'Latest Invoice Number',
    'Latest Tracking Number',
    'Product Summary',
    'Order Total',
    'Notes',
  ];
}

function getOrCreateCustomerInfoSheet_() {
  const ss = getCustomerInfoSpreadsheet_();
  const existing = ss.getSheetByName(CONFIG.CUSTOMER_INFO_SHEET_NAME);
  if (existing) return existing;

  const legacy = ss.getSheetByName(CONFIG.LEGACY_CUSTOMER_INFO_SHEET_NAME);
  if (legacy) {
    legacy.setName(CONFIG.CUSTOMER_INFO_SHEET_NAME);
    return legacy;
  }

  return ss.insertSheet(CONFIG.CUSTOMER_INFO_SHEET_NAME);
}

function getCustomerInfoSpreadsheet_() {
  const spreadsheetId = String(CONFIG.CUSTOMER_INFO_SPREADSHEET_ID || '').trim();
  return spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : SpreadsheetApp.getActiveSpreadsheet();
}

function ensureCustomerInfoHeaders_(sheet) {
  const headers = getCustomerInfoHeaders_();
  const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getDisplayValues()[0];
  const needsRewrite = headers.some((header, index) => current[index] !== header);
  if (needsRewrite) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function buildCustomerInfoRecord_(data) {
  const billEmail = normalizeEmail_(getValue_(data, 'Bill To Email'));
  const customerEmail = normalizeEmail_(getValue_(data, 'Customer Email'));
  const primaryEmail = billEmail || customerEmail;
  const alternateEmail = customerEmail && customerEmail !== primaryEmail ? customerEmail : '';
  const productSummary = buildCustomerProductSummary_(data);
  const remarks = buildCustomerInfoRemarks_(data, billEmail, customerEmail);
  const total = calculateOrderTotal_(data);

  return {
    'Customer Name': getValue_(data, 'Bill To Name'),
    'Salesperson': getValue_(data, 'Salesperson'),
    'Company / Farm': getValue_(data, 'Bill To Company'),
    'Phone': normalizePhoneDisplay_(getValue_(data, 'Bill To Phone')),
    'Email': primaryEmail,
    'Alternate Email / Notes': alternateEmail,
    'Billing Address': getValue_(data, 'Bill To Address'),
    'Billing City': getAddressPart_(data, 'Bill To', 'City'),
    'Billing State': getAddressPart_(data, 'Bill To', 'State'),
    'Billing ZIP': getAddressPart_(data, 'Bill To', 'ZIP'),
    'Payment Terms': getValue_(data, 'Payment Terms'),
    'Payment Method': getValue_(data, 'Payment Method'),
    'Latest Order Date': getValue_(data, 'Order Date'),
    'Latest Order Number': getValue_(data, 'Order Number'),
    'Latest Invoice Number': getValue_(data, 'Invoice Number'),
    'Latest Tracking Number': getValue_(data, 'Tracking Number'),
    'Product Summary': productSummary,
    'Order Total': money_(total),
    'Notes': remarks,
  };
}

function shouldSkipCustomerInfoRow_(data) {
  const name = getValue_(data, 'Bill To Name');
  const company = getValue_(data, 'Bill To Company');
  const email = normalizeEmail_(getValue_(data, 'Bill To Email'));
  const customerEmail = normalizeEmail_(getValue_(data, 'Customer Email'));
  const phone = normalizeDigits_(getValue_(data, 'Bill To Phone'));
  const combined = [name, company, email, customerEmail, getValue_(data, 'Bill To Address')].join(' ').toLowerCase();

  if (!name && !company) return true;
  if (name === '1' || company === '1' || phone === '1') return true;
  if (combined.includes('test')) return true;
  if (normalizeComparable_(name) === 'barryfoley') return true;
  if (isInternalEmail_(email) || isInternalEmail_(customerEmail)) return true;

  return false;
}

function buildCustomerProductSummary_(data) {
  const items = [];
  for (let i = 1; i <= 6; i++) {
    const qty = getValue_(data, `Item ${i} Quantity`);
    const description = getValue_(data, `Item ${i} Description`);
    const price = getValue_(data, `Item ${i} Unit Price`);
    if (qty || description || price) {
      items.push(`${qty || 0} x ${description || 'Item'}${price ? ` @ ${price}` : ''}`);
    }
  }
  return items.join('; ');
}

function buildCustomerInfoRemarks_(data, billEmail, customerEmail) {
  const notes = [];
  if (!billEmail && !customerEmail) notes.push('Missing email');
  if (getValue_(data, 'Bill To Name') && getValue_(data, 'Bill To Name') === getValue_(data, 'Bill To Company')) {
    notes.push('Company field matches customer name');
  }
  if (billEmail && customerEmail && billEmail !== customerEmail) {
    notes.push(`Alternate email: ${customerEmail}`);
  }
  return notes.join('; ');
}

function makeCustomerInfoKey_(record) {
  const email = normalizeEmail_(record['Email']);
  if (email) return `email:${email}`;

  const company = normalizeComparable_(record['Company / Farm']);
  const name = normalizeComparable_(record['Customer Name']);
  const phone = normalizeDigits_(record['Phone']);
  if (company && name) return `name_company:${name}:${company}`;
  if (phone && name) return `name_phone:${name}:${phone}`;
  return '';
}

function findCustomerInfoRow_(sheet, key) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const headers = getCustomerInfoHeaders_();
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getDisplayValues();
  for (let index = 0; index < values.length; index++) {
    const rowRecord = {};
    headers.forEach((header, headerIndex) => {
      rowRecord[header] = values[index][headerIndex];
    });
    if (customerInfoRecordsMatch_(rowRecord, key)) return index + 2;
  }
  return 0;
}

function readCustomerInfoRecord_(sheet, row) {
  const headers = getCustomerInfoHeaders_();
  const values = sheet.getRange(row, 1, 1, headers.length).getDisplayValues()[0];
  const record = {};
  headers.forEach((header, index) => {
    record[header] = values[index];
  });
  return record;
}

function mergeCustomerInfoRecords_(existingRecord, newRecord) {
  const merged = {};
  getCustomerInfoHeaders_().forEach(header => {
    merged[header] = newRecord[header] || existingRecord[header] || '';
  });

  merged['Phone'] = mergeUniqueText_(existingRecord['Phone'], newRecord['Phone'], ' / ');
  merged['Alternate Email / Notes'] = mergeUniqueText_(existingRecord['Alternate Email / Notes'], newRecord['Alternate Email / Notes'], '; ');
  merged['Notes'] = mergeUniqueText_(existingRecord['Notes'], newRecord['Notes'], '; ');
  return merged;
}

function customerInfoRecordsMatch_(record, key) {
  if (makeCustomerInfoKey_(record) === key) return true;

  const keyParts = String(key || '').split(':');
  const keyType = keyParts[0];
  const keyValue = keyParts.slice(1).join(':');
  const emails = [
    normalizeEmail_(record['Email']),
    ...String(record['Alternate Email / Notes'] || '').split(/[;,\s]+/).map(normalizeEmail_),
  ].filter(Boolean);

  if (keyType === 'email' && emails.includes(keyValue)) return true;
  return false;
}

function formatCustomerInfoSheet_(sheet) {
  const headers = getCustomerInfoHeaders_();
  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#e6e6e6')
    .setWrap(true);
  sheet.getRange(1, 1, lastRow, headers.length)
    .setWrap(true)
    .setVerticalAlignment('top');

  const existingFilter = sheet.getFilter();
  if (existingFilter) existingFilter.remove();
  sheet.getRange(1, 1, lastRow, headers.length).createFilter();
}

function createPdfFromTemplate_({ templateId, folderId, baseName, replacements }) {
  if (!templateId || templateId.includes('PASTE_')) {
    throw new Error('Template ID is missing in CONFIG.');
  }
  const targetFolderId = folderId || CONFIG.OUTPUT_FOLDER_ID;
  if (!targetFolderId || targetFolderId.includes('PASTE_')) {
    throw new Error('Output folder ID is missing in CONFIG.');
  }

  const outputFolder = DriveApp.getFolderById(targetFolderId);
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

function collectExistingInvoiceFileIds_(data, baseName) {
  const ids = [];
  const existingPdfId = extractDriveFileId_(getValue_(data, 'Invoice URL'));
  if (existingPdfId) ids.push(existingPdfId);

  const folderId = CONFIG.INVOICE_OUTPUT_FOLDER_ID || CONFIG.OUTPUT_FOLDER_ID;
  if (folderId && !folderId.includes('PASTE_')) {
    const folder = DriveApp.getFolderById(folderId);
    [baseName, `${baseName}.pdf`].forEach(name => {
      const files = folder.getFilesByName(name);
      while (files.hasNext()) {
        ids.push(files.next().getId());
      }
    });
  }

  return ids.filter((id, index, array) => id && array.indexOf(id) === index);
}

function trashFilesById_(fileIds, keepIds) {
  const keep = keepIds || [];
  fileIds.forEach(fileId => {
    if (keep.includes(fileId)) return;
    try {
      DriveApp.getFileById(fileId).setTrashed(true);
    } catch (error) {
      Logger.log(`Could not trash old invoice file ${fileId}: ${error.message}`);
    }
  });
}

function extractDriveFileId_(urlOrId) {
  const text = String(urlOrId || '').trim();
  if (!text) return '';

  const fileMatch = text.match(/\/d\/([A-Za-z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  const idMatch = text.match(/[?&]id=([A-Za-z0-9_-]+)/);
  if (idMatch) return idMatch[1];

  return /^[A-Za-z0-9_-]{20,}$/.test(text) ? text : '';
}

function renameExistingGeneratedFilesToCompanyNames_() {
  if (!CONFIG.OUTPUT_FOLDER_ID || CONFIG.OUTPUT_FOLDER_ID.includes('PASTE_')) {
    throw new Error('Output folder ID is missing in CONFIG.');
  }

  const folderIds = [
    CONFIG.OUTPUT_FOLDER_ID,
    CONFIG.ORDER_CONFIRMATION_OUTPUT_FOLDER_ID,
    CONFIG.INVOICE_OUTPUT_FOLDER_ID,
  ].filter(Boolean);
  const files = [];
  const companyByDocumentKey = {};
  let renamed = 0;
  let skipped = 0;
  let companyMatches = 0;

  folderIds.forEach(folderId => {
    const folder = DriveApp.getFolderById(folderId);
    const iterator = folder.getFiles();
    while (iterator.hasNext()) {
      const file = iterator.next();
      const parsed = parseGeneratedFileName_(file.getName());
      if (parsed) files.push({ file, parsed });
    }
  });

  files.forEach(({ file, parsed }) => {
    if (parsed.isPdf || file.getMimeType() !== MimeType.GOOGLE_DOCS) return;

    const text = DocumentApp.openById(file.getId()).getBody().getText();
    const companyName = sanitizeFileName_(extractBillToCompanyFromDocumentText_(text));
    if (!companyName) {
      skipped += 1;
      return;
    }

    companyByDocumentKey[`${parsed.documentType}|${parsed.documentNumber}`] = companyName;
    companyMatches += 1;
    const newName = `${parsed.documentType} ${parsed.documentNumber} - ${companyName}`;
    if (file.getName() !== newName) {
      file.setName(newName);
      renamed += 1;
    }
  });

  files.forEach(({ file, parsed }) => {
    if (!parsed.isPdf) return;

    const companyName = companyByDocumentKey[`${parsed.documentType}|${parsed.documentNumber}`];
    if (!companyName) {
      skipped += 1;
      return;
    }

    const newName = `${parsed.documentType} ${parsed.documentNumber} - ${companyName}.pdf`;
    if (file.getName() !== newName) {
      file.setName(newName);
      renamed += 1;
    }
  });

  return { renamed, skipped, companyMatches };
}

function updateGoogleFormPaymentMethods_() {
  const formIds = [
    CONFIG.ORDER_FORM_ID,
    CONFIG.SHIPPING_UPDATE_FORM_ID,
  ].filter(Boolean);
  let updated = 0;
  let skipped = 0;

  formIds.forEach(formId => {
    try {
      const form = FormApp.openById(formId);
      const didUpdate = updatePaymentMethodItem_(form);
      if (didUpdate) {
        updated += 1;
      } else {
        skipped += 1;
      }
    } catch (error) {
      skipped += 1;
      Logger.log(`Could not update Payment Method choices for form ${formId}: ${error.message}`);
    }
  });

  return { updated, skipped };
}

function updatePaymentMethodItem_(form) {
  const items = form.getItems();
  const item = items.find(candidate => candidate.getTitle().trim().toLowerCase() === 'payment method');
  if (!item) return false;

  const type = item.getType();
  if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
    item.asMultipleChoiceItem().setChoiceValues(FORM_CHOICES.PAYMENT_METHOD);
    return true;
  }

  if (type === FormApp.ItemType.LIST) {
    item.asListItem().setChoiceValues(FORM_CHOICES.PAYMENT_METHOD);
    return true;
  }

  throw new Error(`Payment Method must be a multiple choice or dropdown item. Current type: ${type}`);
}

function ensureGoogleFormsSetupSafely_() {
  try {
    ensureGoogleFormsSetup_();
  } catch (error) {
    Logger.log(`Could not apply automatic Google Form setup: ${error.message}`);
  }
}

function ensureGoogleFormsSetup_() {
  updateGoogleFormPaymentMethods_();

  if (CONFIG.ORDER_FORM_ID) {
    const orderForm = FormApp.openById(CONFIG.ORDER_FORM_ID);
    ensureSplitAddressFields_(orderForm, 'Bill To');
    ensureSplitAddressFields_(orderForm, 'Ship To');
  }
}

function ensureSplitAddressFields_(form, prefix) {
  const cityTitle = `${prefix} City`;
  const stateTitle = `${prefix} State`;
  const zipTitle = `${prefix} ZIP`;
  const legacyTitle = `${prefix} City State ZIP`;

  let cityItem = findFormItemByTitle_(form, cityTitle);
  const legacyItem = findFormItemByTitle_(form, legacyTitle);
  if (!cityItem && legacyItem && legacyItem.getType() === FormApp.ItemType.TEXT) {
    legacyItem.asTextItem().setTitle(cityTitle);
    cityItem = legacyItem;
  }
  if (!cityItem) {
    cityItem = form.addTextItem().setTitle(cityTitle).setRequired(false);
  }

  let stateItem = findFormItemByTitle_(form, stateTitle);
  if (stateItem && stateItem.getType() !== FormApp.ItemType.LIST && stateItem.getType() !== FormApp.ItemType.MULTIPLE_CHOICE) {
    setFormItemTitle_(stateItem, `${stateTitle} (Old - do not use)`);
    stateItem = null;
  }
  if (!stateItem) {
    stateItem = form.addListItem().setTitle(stateTitle).setChoiceValues(FORM_CHOICES.US_STATES).setRequired(false);
  } else if (stateItem.getType() === FormApp.ItemType.LIST) {
    stateItem.asListItem().setChoiceValues(FORM_CHOICES.US_STATES);
  } else {
    stateItem.asMultipleChoiceItem().setChoiceValues(FORM_CHOICES.US_STATES);
  }

  let zipItem = findFormItemByTitle_(form, zipTitle);
  if (!zipItem) {
    zipItem = form.addTextItem().setTitle(zipTitle).setRequired(false);
  }

  moveFormItemAfter_(form, stateItem, cityItem);
  moveFormItemAfter_(form, zipItem, stateItem);
}

function findFormItemByTitle_(form, title) {
  const wanted = String(title || '').trim().toLowerCase();
  return form.getItems().find(item => item.getTitle().trim().toLowerCase() === wanted) || null;
}

function setFormItemTitle_(item, title) {
  const type = item.getType();
  if (type === FormApp.ItemType.TEXT) item.asTextItem().setTitle(title);
  else if (type === FormApp.ItemType.PARAGRAPH_TEXT) item.asParagraphTextItem().setTitle(title);
  else if (type === FormApp.ItemType.MULTIPLE_CHOICE) item.asMultipleChoiceItem().setTitle(title);
  else if (type === FormApp.ItemType.LIST) item.asListItem().setTitle(title);
  else if (type === FormApp.ItemType.CHECKBOX) item.asCheckboxItem().setTitle(title);
  else if (type === FormApp.ItemType.DATE) item.asDateItem().setTitle(title);
  else if (type === FormApp.ItemType.PAGE_BREAK) item.asPageBreakItem().setTitle(title);
  else if (type === FormApp.ItemType.SECTION_HEADER) item.asSectionHeaderItem().setTitle(title);
}

function moveFormItemAfter_(form, itemToMove, previousItem) {
  if (!itemToMove || !previousItem) return;
  const items = form.getItems();
  const fromIndex = items.findIndex(item => item.getId() === itemToMove.getId());
  let targetIndex = items.findIndex(item => item.getId() === previousItem.getId()) + 1;
  if (fromIndex < 0 || targetIndex <= 0 || fromIndex === targetIndex) return;

  if (fromIndex < targetIndex) targetIndex -= 1;
  form.moveItem(fromIndex, targetIndex);
}

function parseGeneratedFileName_(name) {
  const isPdf = /\.pdf$/i.test(name);
  const baseName = isPdf ? name.replace(/\.pdf$/i, '') : name;
  const match = baseName.match(/^(Order Confirmation|Invoice)\s+((?:ORD|INV|US-LF)-[A-Za-z0-9-]+)\s+-\s+(.+)$/i);
  if (!match) return null;

  const rawType = match[1].toLowerCase();
  return {
    documentType: rawType === 'invoice' ? 'Invoice' : 'Order Confirmation',
    documentNumber: match[2],
    currentCustomerName: match[3],
    isPdf,
  };
}

function extractBillToCompanyFromDocumentText_(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const billToIndex = lines.findIndex(line => line.toUpperCase() === 'BILL TO');
  if (billToIndex < 0) return '';

  const candidate = lines[billToIndex + 2] || '';
  return isLikelyCompanyName_(candidate) ? candidate : '';
}

function isLikelyCompanyName_(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  if (/^(SHIP TO|COMMENTS|SPECIAL INSTRUCTIONS|SALESPERSON|CUSTOMER PO#?)$/i.test(text)) return false;
  if (/^\d+\s/.test(text)) return false;
  if (/@/.test(text)) return false;
  if (/\d{3}[-.\s]\d{3}[-.\s]\d{4}/.test(text)) return false;
  if (/\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/i.test(text)) return false;
  return true;
}

function sanitizeFileName_(value) {
  return String(value || '')
    .replace(/[\\/:*?"<>|#%{}~&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    'Bill To City',
    'Bill To State',
    'Bill To ZIP',
    'Ship To City',
    'Ship To State',
    'Ship To ZIP',
    'Invoice URL',
    'Invoice Sent At',
    'Invoice Internal Archive Sent At',
    'Order Total',
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

function backfillSplitAddressColumnsForRow_(sheet, row, data) {
  const sameShipping = getValue_(data, 'Shipping Address Option').toLowerCase().includes('same');
  [
    ['Bill To', 'City'],
    ['Bill To', 'State'],
    ['Bill To', 'ZIP'],
    ['Ship To', 'City'],
    ['Ship To', 'State'],
    ['Ship To', 'ZIP'],
  ].forEach(([prefix, part]) => {
    const header = `${prefix} ${part}`;
    if (getValue_(data, header)) return;
    const value = sameShipping && prefix === 'Ship To'
      ? getAddressPart_(data, 'Bill To', part)
      : getAddressPart_(data, prefix, part);
    if (value) writeResult_(sheet, row, header, value);
  });
}

function calculateOrderTotal_(data) {
  const subtotalInfo = buildLineItems_(data);
  const discount = numberValue_(data, 'Discount');
  const shipping = numberValue_(data, 'Shipping Charge');
  const taxRate = numberValue_(data, 'Tax Rate Percent') / 100;
  const tax = subtotalInfo.subtotal * taxRate;
  return subtotalInfo.subtotal - discount + shipping + tax;
}

function getAddressPart_(data, prefix, part) {
  const direct = getValue_(data, `${prefix} ${part}`);
  if (direct) return direct;

  if (part === 'ZIP') {
    const zip = getValue_(data, `${prefix} Zip`) || getValue_(data, `${prefix} Zip Code`);
    if (zip) return zip;
  }

  const parsed = parseLegacyCityStateZip_(getValue_(data, `${prefix} City State ZIP`));
  if (part === 'City') return parsed.city;
  if (part === 'State') return parsed.state;
  if (part === 'ZIP') return parsed.zip;
  return '';
}

function parseLegacyCityStateZip_(value) {
  const text = normalizeCityStateZip_(value);
  if (!text) return { city: '', state: '', zip: '' };

  const match = text.match(/^(.+?)(?:,|\s{2,})?\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i);
  if (match) {
    return {
      city: match[1].replace(/,$/, '').trim(),
      state: match[2].toUpperCase(),
      zip: match[3],
    };
  }

  const commaParts = text.split(',').map(part => part.trim()).filter(Boolean);
  if (commaParts.length >= 2) {
    const stateZip = commaParts.slice(1).join(' ');
    const stateZipMatch = stateZip.match(/^([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?$/i);
    if (stateZipMatch) {
      return {
        city: commaParts[0],
        state: stateZipMatch[1].toUpperCase(),
        zip: stateZipMatch[2] || '',
      };
    }
  }

  return { city: text, state: '', zip: '' };
}

function formatCityStateZip_(city, state, zip) {
  const stateZip = [state, zip].filter(Boolean).join(' ');
  return [city, stateZip].filter(Boolean).join(', ');
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

function unitPrice_(value) {
  const text = String(value || '').trim();
  if (!text) return '';

  const cleaned = text.replace(/[$,\s]/g, '');
  const number = Number(cleaned);
  if (!Number.isFinite(number)) return text;

  return '$' + cleaned;
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

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeDigits_(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizePhoneDisplay_(value) {
  const digits = normalizeDigits_(value);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return String(value || '').trim();
}

function normalizeComparable_(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeCityStateZip_(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ');
}

function isInternalEmail_(email) {
  const normalized = normalizeEmail_(email);
  return normalized.endsWith('@logfresh.net') || normalized.endsWith('@awt-biotech.com');
}

function mergeUniqueText_(existingValue, newValue, separator) {
  const parts = String(existingValue || '')
    .split(separator)
    .concat(String(newValue || '').split(separator))
    .map(value => value.trim())
    .filter(Boolean);
  return parts.filter((value, index, array) => array.indexOf(value) === index).join(separator);
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
