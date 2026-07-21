# Version Archive / 版本归档

This folder keeps script snapshots from the major workflow stages of the LogFresh Invoice System.

这个文件夹用于保存 LogFresh Invoice System 在不同阶段的脚本版本快照。

## Versions / 版本

### v1-legacy-single-invoice

Early single-stage invoice generation script.

早期单阶段 invoice 自动生成脚本。

Main behavior:

- Reads one Google Form response row from the response Sheet.
- Generates one Invoice document/PDF from a Google Docs template.
- Optionally emails the invoice to the customer.
- Does not include customer approval, Form 2, or shipping update workflow.

主要功能：

- 从 Google Form 回复表读取一行订单数据。
- 根据 Google Docs 模板生成 Invoice 文件/PDF。
- 可选择自动发送 invoice 给客户。
- 不包含客户确认按钮、Form 2、shipping update 流程。

### v2-current-two-stage

Current two-stage production workflow.

当前双阶段正式工作流。

Main behavior:

- Supports `Invoice Only` and `Confirmation First`.
- Generates Order Confirmation and Invoice PDFs.
- Supports no-login customer approval link.
- Sends internal shipping/tracking reminders.
- Uses Form 2 to update shipping/invoice information by `Order Number`.
- Supports prefilled Form 2 links.
- Uses daily sequence numbering:
  - `ORD-YYYYMMDD-###`
  - `INV-YYYYMMDD-###`

主要功能：

- 支持 `Invoice Only` 和 `Confirmation First` 两种流程。
- 自动生成 Order Confirmation 和 Invoice PDF。
- 支持客户无需登录 Google 点击确认。
- 自动发送内部 shipping/tracking 提醒。
- 通过 Form 2 使用 `Order Number` 回写 shipping/invoice 信息。
- 支持 Form 2 预填链接。
- 使用每日序号编号：
  - `ORD-YYYYMMDD-###`
  - `INV-YYYYMMDD-###`
