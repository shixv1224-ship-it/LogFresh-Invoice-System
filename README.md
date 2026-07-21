# LogFresh Invoice System / LogFresh 订单与发票自动化系统

Google Forms + Google Sheets + Google Docs + Apps Script automation for LogFresh order confirmations, invoices, customer approvals, shipping updates, PDF generation, and email notifications.

基于 Google Forms、Google Sheets、Google Docs 和 Apps Script 的 LogFresh 订单自动化系统，用于生成 Order Confirmation、Invoice、客户确认链接、shipping update、PDF 文件和自动邮件。

## Quick Links / 快速入口

- Setup guide / 部署指南: [docs/setup-guide.md](docs/setup-guide.md)
- 中文部署指南: [docs/setup-guide.zh-CN.md](docs/setup-guide.zh-CN.md)
- Version archive / 版本归档: [versions/](versions/)
- Changelog / 更新日志: [CHANGELOG.md](CHANGELOG.md)
- 中文更新日志: [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)

## What this system does / 系统功能

This workflow supports two sales paths.

系统支持两种销售流程。

### 1. Invoice Only / 直接生成 Invoice

Use this when the customer has already confirmed the order.

适用于客户已经确认订单的情况。

- Generates an invoice PDF immediately.
- Sends the invoice only when the send option is set to `Yes`.
- Sends an internal shipping/tracking reminder to the salesperson.

- 立即生成 Invoice PDF。
- 只有发送选项为 `Yes` 时才会自动发送 invoice。
- 同时发送内部 shipping/tracking 提醒给对应销售。

### 2. Confirmation First / 先发 Order Confirmation

Use this when the customer needs to approve the order before invoicing.

适用于客户需要先确认订单，再生成 invoice 的情况。

- Generates an Order Confirmation PDF.
- Sends a no-login approval link to the customer when automatic sending is enabled.
- After customer approval, sends the salesperson an internal shipping update link.
- Form 2 updates shipping/tracking data and can generate/send the final invoice.

- 生成 Order Confirmation PDF。
- 自动发送开启时，客户会收到无需登录 Google 的确认链接。
- 客户确认后，对应销售会收到内部 shipping update 链接。
- Form 2 用于更新 shipping/tracking 信息，并生成/发送最终 invoice。

## Main files / 主要文件

```text
apps-script/
  LogFresh_Two_Stage_Order_Invoice_Automation.gs

templates/
  Harvest_Smart_Invoice_Template_Strict.docx
  Harvest_Smart_Order_Confirmation_Template_Strict.docx

docs/
  setup-guide.md
  setup-guide.zh-CN.md

versions/
  v1-legacy-single-invoice/
  v2-current-two-stage/

CHANGELOG.md
CHANGELOG.zh-CN.md
README.md
README.zh-CN.md
```

## Google Forms / Google 表单

### Form 1: Order Creation / Form 1：订单创建

Expected question titles:

需要保持一致的问题标题：

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

`Workflow Type` options / `Workflow Type` 选项：

```text
Invoice Only
Confirmation First
```

`Send Confirmation Automatically` is the unified Form 1 send switch.

`Send Confirmation Automatically` 是 Form 1 的统一发送开关。

```text
Yes = send the generated document for the selected workflow
No = generate PDF only and save it to Drive
```

```text
Yes = 自动发送当前流程生成的文件
No = 只生成 PDF 并保存到 Drive，不发送邮件
```

### Form 2: Shipping / Invoice Update / Form 2：发货与 Invoice 更新

Expected question titles:

需要保持一致的问题标题：

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

Form 2 通过 `Order Number` 匹配原订单并回写 shipping / invoice 信息。

## Numbering / 编号规则

Order and invoice numbers use the same daily sequence format.

订单号和发票号使用统一的每日序号格式。

```text
ORD-YYYYMMDD-###
INV-YYYYMMDD-###
```

Examples / 示例：

```text
ORD-20260720-001
INV-20260720-001
```

The sequence is based on existing orders for the current day in the main order sheet.

每日序号根据主订单表中当天已有订单自动计算。

## Date behavior / 日期规则

Dates are output as:

日期输出格式：

```text
MM/dd/yyyy
```

Due date logic:

Due Date 逻辑：

```text
Due Date entered manually -> use entered Due Date
Due Date blank -> Invoice Date + 30 days
Invoice Date also blank -> today + 30 days
```

```text
如果手动填写 Due Date -> 使用填写的 Due Date
如果 Due Date 留空 -> 使用 Invoice Date + 30 天
如果 Invoice Date 也为空 -> 使用今天 + 30 天
```

## Email subjects / 邮件标题

Customer order confirmation / 客户 Order Confirmation 邮件：

```text
[ORD] Order Confirmation with LogFresh - {{ORDER_NUMBER}}
```

Customer invoice / 客户 Invoice 邮件：

```text
[INV] Invoice with LogFresh - {{INVOICE_NUMBER}} / {{ORDER_NUMBER}}
```

Customer approved, internal shipping reminder / 客户确认后的内部 shipping 提醒：

```text
[Approved] Order Confirmation needs shipping info - {{ORDER_NUMBER}}
```

Invoice-only internal shipping reminder / Invoice Only 后的内部 shipping 提醒：

```text
[Update] Invoice shipping information required - {{INVOICE_NUMBER}} / {{ORDER_NUMBER}}
```

## Email recipients / 邮件收件规则

Customer-facing emails are CC'd to the fixed internal list plus `Salesperson Email`.

客户邮件会自动 CC 固定内部邮箱列表和 `Salesperson Email`。

Internal shipping/update reminders are sent primarily to `Salesperson Email`, with backup internal emails configured in the script.

内部 shipping/update 提醒优先发送给 `Salesperson Email`，同时可使用脚本中配置的备用内部邮箱。

## Current configuration / 当前配置

The Apps Script currently uses these configured IDs:

当前 Apps Script 使用以下 ID：

```text
Output Folder ID: 1fJ2NObstEyEbEoKcf-OSOdyrg1hhgpEU
Invoice Template ID: 1HL7cBQRwKluDp4bqpjuwF3Cf7g3KPOFMm1bFTBQf0qA
Order Confirmation Template ID: 1IKmEJH8gQ4Sv9376UEUHYFkvf7aYwZCQWfpkVfDx9FE
```

Company details / 公司信息：

```text
LogFresh Biotechnology CO., LTD
708 N 29th Avenue APT 2, Yakima, WA 98902
215-696-1238
sales@awt-biotech.com
www.logfresh.net
```

## Deployment notes / 部署说明

Most form-submit logic runs from the Apps Script trigger using:

大部分表单提交逻辑通过 Apps Script trigger 运行：

```text
Deployment: Head / 最新测试版
Event source: From spreadsheet
Event type: On form submit
```

Saving the script is enough for most trigger-based updates.

大部分 trigger 相关修改只需要保存脚本即可生效。

Redeploy the Web App only when changing approval-link logic such as `doGet()` or Web App URL behavior.

只有修改客户确认链接、`doGet()` 或 Web App URL 相关逻辑时，才需要重新部署 Web App。

See [docs/setup-guide.md](docs/setup-guide.md) for full setup steps.

完整部署步骤见 [docs/setup-guide.md](docs/setup-guide.md) 和 [docs/setup-guide.zh-CN.md](docs/setup-guide.zh-CN.md)。
