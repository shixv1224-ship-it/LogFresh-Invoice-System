# v3 Invoice Shipping Info Workflow / v3 Invoice Shipping 信息流程

This folder archives the Apps Script snapshot for the v3 workflow update.

这个文件夹保存 v3 workflow 更新时的 Apps Script 快照。

## Main behavior / 主要功能

- Adds `Invoice Only - Needs Shipping Info`.
- Generates an internal invoice first when shipping/tracking is not ready.
- Sends a Form 3 shipping info update email to the salesperson/internal team.
- Uses Form 3 to complete Shipped Via, Shipping Charge, Tracking Number, Invoice Date, Due Date, Payment Method, Customer Email, and Send Invoice Automatically.
- Sends the final invoice to the customer only when `Send Invoice Automatically = Yes`.
- Blank or `No` sends the final invoice internally/CC only.
- Replaces the older no-shipping invoice when the final invoice is generated.
- Shows the shipping update link as an email button instead of a long raw URL.
- Price fields default to two decimals, but preserve three-or-more decimal precision when needed.
- The LogFresh Sheet menu includes `Test Email Only` and `Back to Normal` for safe email testing.

- 新增 `Invoice Only - Needs Shipping Info`。
- 当 shipping / tracking 还没准备好时，先生成内部 invoice。
- 给 salesperson / 内部团队发送 Form 3 shipping info update 邮件。
- 通过 Form 3 补齐 Shipped Via、Shipping Charge、Tracking Number、Invoice Date、Due Date、Payment Method、Customer Email、Send Invoice Automatically。
- 只有 `Send Invoice Automatically = Yes` 时才把最终 invoice 发给客户。
- 空白或 `No` 时只发送内部/抄送。
- 生成最终 invoice 时会替换旧的无 shipping invoice。
- shipping update 链接以邮件按钮显示，不再直接显示长 URL。
- 价格字段默认两位小数；如果有三位或更多小数，则保留更多精度。
- LogFresh Sheet 菜单包含 `Test Email Only` 和 `Back to Normal`，方便安全测试邮件。

## Snapshot / 快照

- Script: `LogFresh_Two_Stage_Order_Invoice_Automation.gs`
- Date: 2026-07-27
