# 更新日志

## 2026-07-08

- 规划最初的 invoice 模板和 Google Form 自动化思路。
- 根据 Harvest Smart / LogFresh logo 设计 invoice 模板。
- 多次优化模板排版，解决太紧凑、字体不好看、导入 Google Docs 后变形的问题。
- 设计 Google Form → Google Sheets → Google Docs → PDF 的基础流程。
- 创建早期单阶段 invoice 自动生成脚本。
- 解释模板 ID、文件夹 ID、Apps Script、trigger、deploy 的基础操作。

## 2026-07-10

- 将单阶段 invoice 流程扩展为双阶段订单系统。
- 设计 `Invoice Only` 和 `Confirmation First` 两种流程。
- 设计 Form 1 订单创建表。
- 设计 Form 2 shipping / invoice update 表。
- 增加客户确认按钮。
- 配置客户无需登录 Google 即可确认订单。
- 增加固定 CC 邮箱列表。
- 增加 `Salesperson Email`，用于通知对应销售。
- 移除 Approval Token，改为使用 `Order Number` 匹配订单。
- 创建严格按照用户模板的 Order Confirmation 和 Invoice 模板。
- 清理旧模板和旧脚本。
- 处理多次 Apps Script 部署、权限、触发器和邮件发送问题。

## 2026-07-20

- 取消 invoice 对 Tracking Number 的强制要求。
- 支持 invoice 先生成，tracking 后续通过 Form 2 更新。
- 增加 Invoice Only 后的内部 shipping/tracking 提醒。
- 扩展 Form 2 预填链接字段：
  - Order Number
  - Ship Date
  - Shipped Via
  - Tracking Number
  - Invoice Number
  - Invoice Date
  - Due Date
  - Payment Method
  - Customer Email
- 统一 Form 1 的发送逻辑：`Send Confirmation Automatically` 同时控制 confirmation/invoice 是否发送。
- 保留 Form 2 的 `Send Invoice Automatically` 控制最终 invoice 是否发送。
- 更新邮件标题格式：
  - `[ORD] Order Confirmation with LogFresh`
  - `[INV] Invoice with LogFresh`
  - `[Approved] Order Confirmation needs shipping info`
  - `[Update] Invoice shipping information required`
- 更新编号格式：
  - `ORD-YYYYMMDD-###`
  - `INV-YYYYMMDD-###`
- 增加 Due Date 自动逻辑：留空时默认为 Invoice Date + 30 天。
- 更新日期输出格式为 `MM/dd/yyyy`。
- 更新公司信息、模板 ID、输出文件夹 ID。
- 创建 GitHub 项目结构。
- 增加 README、CHANGELOG、setup guide。
- 推送项目到 GitHub。
- 更新当前最终模板。
- 新增历史版本归档目录 `versions/`。
