# LogFresh Invoice System 中文说明

这是一个基于 Google Forms、Google Sheets、Google Docs 和 Apps Script 的 LogFresh 订单自动化系统。

系统支持：

- 销售填写订单表单；
- 自动生成 Order Confirmation；
- 自动生成 Invoice；
- 客户无需登录 Google 点击确认；
- 客户确认后通知对应销售补 shipping / tracking；
- 通过 Shipping Update Form 更新 shipping 和 invoice 信息；
- 自动保存 PDF 到 Google Drive；
- 按设置自动发送客户邮件和内部提醒邮件。
- 自动维护 `Customer Info` 客户汇总表；可放在主订单表内，也可通过 `CUSTOMER_INFO_SPREADSHEET_ID` 配置为独立 Google Sheets 文件。

## 三种工作流

### Invoice Only

适用于客户已经确认订单的情况。

系统会直接生成 invoice PDF，并根据发送选项决定是否发给客户。

旧的 `[Update] Invoice shipping information required` 内部提醒邮件已取消。

如果 `Send Confirmation Automatically = No`，Invoice Only 不会发给客户，而是发送给 `Salesperson Email` 并 CC 固定内部邮箱，用作内部存档。

### Invoice Only - Needs Shipping Info

适用于客户已经确认订单，但 shipping / tracking 信息还没准备好的情况。

系统会先生成一份内部 invoice，并保存到 Drive。等 tracking 准备好后，内部人员通过 Invoice Shipping Info Update Form 补齐信息；新的最终 invoice 会替换之前缺 shipping 信息的旧 invoice。

### Confirmation First

适用于客户需要先确认订单的情况。

系统会先生成 Order Confirmation，客户点击确认后，对应销售会收到内部提醒，再通过 Shipping Update Form 补充 shipping / tracking，最后生成 invoice。

如果 Shipping Update Form 为同一订单重新生成 invoice，系统会在新 invoice 成功生成后，把旧的匹配 invoice 文件移到 Drive 垃圾桶，避免同一订单保留两份 invoice。

客户确认按钮通过已部署的 Web App URL 运行，客户无需登录 Google：

```text
https://script.google.com/macros/s/AKfycbzTCUmG5RLjUoalUT_sM0MV1rkx2kuewbzqrdszYFHlRVkF7BMIUKWK9OjplnrQGJ2n/exec
```

## 主要文件

```text
apps-script/LogFresh_Two_Stage_Order_Invoice_Automation.gs
templates/
docs/setup-guide.md
docs/beginner-user-guide.md
docs/beginner-user-guide.zh-CN.md
docs/LogFresh_Beginner_User_Guide_EN.pdf
docs/LogFresh_Beginner_User_Guide_zh-CN.pdf
scripts/build_beginner_guide_pdf.py
versions/
README.md
README.zh-CN.md
CHANGELOG.md
CHANGELOG.zh-CN.md
VERSION_TIMELINE.md
```

## 编号规则

```text
ORD-YYYYMMDD-###
INV-YYYYMMDD-###
```

例如：

```text
ORD-20260720-001
INV-20260720-001
```

## 日期规则

日期输出格式：

```text
MM/dd/yyyy
```

如果 `Due Date` 留空，系统会自动使用：

```text
Invoice Date + 30 days
```

如果 `Invoice Date` 也为空，则使用：

```text
今天 + 30 days
```

## 当前表单要求

`Payment Method` 在 Order Confirmation Form 和 Shipping Update Form 中保持一致，选项为：

```text
Credit Card
Prepaid
Check/Wire Transfer
```

`Item Unit Price` 不再强制显示两位小数；系统会保留表单里输入的单价小数位数。Subtotal、Total、Balance Due 等总金额仍按美元金额显示两位小数。

Order Confirmation Form 的地址字段应拆分为独立列：

```text
Bill To City
Bill To State
Bill To ZIP
Ship To City
Ship To State
Ship To ZIP
```

`Bill To State` 和 `Ship To State` 使用美国两位州缩写下拉选项。Customer Info 表也会输出独立的 Billing City、Billing State、Billing ZIP 和 Order Total，方便导出 Excel 做筛选/报表。

## 部署说明

详细部署步骤见：

```text
docs/setup-guide.md
```

新手完整使用教程：

```text
docs/beginner-user-guide.md
docs/beginner-user-guide.zh-CN.md
docs/LogFresh_Beginner_User_Guide_EN.pdf
docs/LogFresh_Beginner_User_Guide_zh-CN.pdf
```

## 历史版本

历史脚本快照见：

```text
versions/
```

版本时间线见：

```text
VERSION_TIMELINE.md
```
