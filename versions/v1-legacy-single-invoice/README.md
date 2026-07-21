# v1 Legacy Single Invoice Script / v1 早期单阶段 Invoice 脚本

This is an archived reconstruction of the first invoice-only automation version.

这是早期 invoice-only 自动化版本的归档重建版。

## Status / 状态

Archived and superseded by:

已归档，并由以下版本替代：

```text
versions/v2-current-two-stage/
apps-script/LogFresh_Two_Stage_Order_Invoice_Automation.gs
```

## What it did / 功能

- Generate one invoice from the latest Google Form response row.
- Replace invoice template placeholders.
- Save generated Google Docs and PDF files to Drive.
- Optionally email the invoice to the customer.

- 根据 Google Form 最新回复生成一份 invoice。
- 替换 invoice 模板占位符。
- 将生成的 Google Docs 和 PDF 保存到 Drive。
- 可选择自动发送 invoice 给客户。

## What it did not include / 不包含

- No Order Confirmation workflow.
- No customer approval button.
- No Form 2 shipping update workflow.
- No salesperson-specific shipping reminder.
- No daily sequence ORD/INV numbering.

- 不包含 Order Confirmation 流程。
- 不包含客户确认按钮。
- 不包含 Form 2 shipping update 流程。
- 不包含对应销售的 shipping reminder。
- 不包含每日序号 ORD/INV 编号。
