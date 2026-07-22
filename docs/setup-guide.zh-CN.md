# 部署指南

本文档说明如何从零部署 LogFresh Invoice System。

## 1. 准备 Google Drive 文件夹

建议创建：

```text
LogFresh Invoice Automation
Templates
Generated PDFs
```

将 `templates/` 里的两个 Word 模板上传到 Google Drive，并用 Google Docs 打开/转换。

复制两个 Google Docs 模板 ID。

## 2. 创建 Form 1

Form 1 用于销售创建订单。

关键字段包括：

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
...
Customer Email
Send Confirmation Automatically
```

`Workflow Type` 选项：

```text
Invoice Only
Confirmation First
```

## 3. 创建 Form 2

Form 2 用于更新 shipping / invoice 信息。

字段：

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

Form 2 通过 `Order Number` 匹配原订单。

## 4. 连接 Google Sheet

Form 1 连接到新的 Google Sheet。

主 tab 名称：

```text
Order Confirmation
```

Form 2 连接到同一个 Google Sheet。

Form 2 tab 名称：

```text
Shipping Updates
```

## 可选：将客户有效信息放到独立 Google Sheets 文件

默认情况下，`客户有效信息` 会作为主订单回复表里的一个 tab 自动创建。

如果你想让它变成一个独立 Google Sheets 文件：

1. 新建一个空 Google Sheet，例如：

```text
LogFresh Customer Info
```

2. 从 URL 复制 spreadsheet ID：

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

3. 填到 Apps Script：

```js
CUSTOMER_INFO_SPREADSHEET_ID: 'SPREADSHEET_ID',
```

4. tab 名保持：

```js
CUSTOMER_INFO_SHEET_NAME: '客户有效信息',
```

如果独立 spreadsheet 里还没有 `客户有效信息` tab，脚本会自动创建。

## 5. 放入 Apps Script

在 Sheet 中打开：

```text
Extensions → Apps Script
```

复制：

```text
apps-script/LogFresh_Two_Stage_Order_Invoice_Automation.gs
```

填好 `CONFIG` 中的模板 ID、文件夹 ID、Web App URL、公司信息等。

## 6. 部署 Web App

Apps Script 中：

```text
Deploy → New deployment → Web app
```

设置：

```text
Execute as: Me
Who has access: Anyone
```

复制 Web App URL，填回脚本。

修改 Web App 相关逻辑后，需要重新 New version deploy。

## 7. 添加触发器

添加 trigger：

```text
Function: onFormSubmit
Deployment: Head / 最新测试版
Event source: From spreadsheet
Event type: On form submit
```

## 8. 测试

先测试 `Confirmation First`，再测试 Form 2。

再测试 `Invoice Only`。

确认 PDF、邮件、Sheet 回写、Form 2 预填链接都正常。
