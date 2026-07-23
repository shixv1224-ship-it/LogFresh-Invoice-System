# 更新日志

## GitHub Commit 版本时间线

这一部分只记录 GitHub commit 和 repo 层面的版本历史。

### 2026-07-20 · `a5dcef5` - Initial LogFresh invoice automation system

- 创建第一版 GitHub 项目结构。
- 添加正式 Apps Script 文件。
- 添加严格版 Invoice 和 Order Confirmation 模板。
- 添加第一版英文 README、CHANGELOG 和部署指南。
- 将完整双流程自动化系统作为 GitHub 初始版本保存。

### 2026-07-20 · `cc9c812` - Bilingual docs and version archive

- 添加中文文档。
- 添加中文部署指南。
- 添加历史版本归档目录。
- 增加 `v1-legacy-single-invoice`，归档早期单阶段 invoice 脚本。
- 增加 `v2-current-two-stage`，归档当前双阶段 workflow 脚本。

### 2026-07-20 · `1cabffa` - Bilingual homepage README

- 将 GitHub 主页 README 改为中英双语对照。
- 增加双语说明：workflow、字段、编号、日期、邮件标题、部署说明等。

### 2026-07-21 · `631fcdf` - U.S. invoice date format

- 将 invoice 日期输出从 `dd/MM/yyyy` 改为美国常用 `MM/dd/yyyy`。
- 更新斜杠日期解析逻辑，按美国月/日顺序读取。
- 同步更新中英文文档中的日期说明。

### 2026-07-21 · `8a3449d` - Latest invoice and order confirmation templates

- 用最新提供的 Word 模板替换 GitHub 中的模板文件。
- 保留模板占位符与 Apps Script 的兼容性。

### 2026-07-21 · `d80950c` - Company suffix casing in templates

- 将模板顶部公司后缀从 `LTD` 改为 `Ltd`。
- 确认模板顶部为 `Logfresh Biotechnology Co., Ltd`。

### 2026-07-21 · `84be5ca` - Customer info sync

- 增加客户汇总表自动同步功能。
- 在生成 Order Confirmation 和 Invoice 后自动新增/更新客户记录。
- 增加从历史订单重建客户汇总表的菜单操作。

### 2026-07-21 · `e1b6748` - July 21 changelog refinements

- 补充 2026-07-21 模板细节更新日志。
- 保留远端新增的客户信息同步 changelog。
- rebase 后推送合并后的 changelog。

### 2026-07-21 · `8e35385` - Separate customer info spreadsheet support

- 增加脚本支持：客户有效信息可以写入主 Form response 表之外的独立 Google Sheet。
- 增加按配置 ID 打开客户信息表的辅助逻辑。
- 保留兼容模式：如果没有配置独立表 ID，仍可写入当前订单回复表中的 `客户有效信息` tab。

### 2026-07-21 · `34ac08a` - Configure separate customer info spreadsheet

- 创建并连接独立的 `LogFresh Customer Info` Google Sheet。
- 配置 `CUSTOMER_INFO_SPREADSHEET_ID`，使客户资料写入单独客户资料库。
- 同步更新输出脚本副本，确保 GitHub、本地文件和生产 Apps Script 源码一致。

### 2026-07-21 · `02d8a3f` - Apps Script deployment support

- 增加 `clasp` 配置，支持从本地/GitHub 项目直接推送到 Google Apps Script。
- 增加 Apps Script manifest 文件。
- 将 repo 连接到正式 Apps Script 项目 ID，方便后续直接同步脚本。

### 2026-07-21 · `13fc87d` - Remove duplicate clasp script file

- 删除 Apps Script 源码目录中重复的 `Code.js` 文件。
- 重新推送 Apps Script，现在只包含 manifest 和主自动化脚本。
- 避免 Apps Script 编辑器里出现重复顶层变量/函数定义。

### 2026-07-21 · `be1aaf8` - Customer info deployment changelog

- 更新中英文 changelog，补充 customer info 部署细节。
- 记录独立客户资料表的配置。
- 记录 `clasp` 部署后 Apps Script 源码目录清理。

### 2026-07-23 · `202a70c` - Disable invoice-only update reminder email

- 取消 `Invoice Only` 流程中自动发送的 `[Update] Invoice shipping information required` 内部提醒邮件。
- 保留 invoice 生成和是否发送 invoice 的原有逻辑。
- 保留客户确认后的 `[Approved]` shipping 信息提醒邮件。

### 2026-07-23 · `455c26b` - Manual invoice PDF-only menu action

- 增加 Google Sheet 菜单操作，可对选中的订单行只生成 invoice PDF，不发送任何邮件。
- 生成前增加确认弹窗。
- 生成后增加完成弹窗，并显示 Drive 中保存的 invoice 链接。

### 2026-07-23 · `c3b65c1` - Use company names in generated file names

- 将后续生成的 Order Confirmation 文件名改为优先使用账单公司名，而不是客户个人名。
- 将后续生成的 Invoice 文件名改为优先使用账单公司名，而不是客户个人名。
- 邮件称呼和文档正文内容保持不变。

### 2026-07-23 · `d589642` - Add batch rename for existing generated files

- 增加 Google Sheet 菜单操作，可批量重命名 Drive 里已经生成过的 Order Confirmation 和 Invoice 文件。
- 批量重命名会读取每个旧 Google Doc 里的 `BILL TO` 区域，用公司名重命名对应的 Google Doc 和 PDF。
- 如果某个文件无法安全识别公司名，会自动跳过，避免误改。

### 2026-07-23 · `d0fb689` - Update unit price and payment method requirements

- 修改 line-item unit price 显示逻辑，保留表单输入的小数位数，不再强制两位小数。
- Subtotal、Total、Balance Due 等计算总金额仍保持美元两位小数。
- 记录 Form 1 / Form 2 统一付款方式选项：`Credit Card`、`Prepaid`、`Check/Wire Transfer`。

---

## 功能 / 业务更新记录

这一部分记录 LogFresh 自动化系统本身的流程、模板、表单、邮件和客户资料功能变化。

## 2026-07-23

### Changed

- 取消 `Invoice Only` 流程里自动发送的 `[Update] Invoice shipping information required` 内部提醒邮件。
- `Invoice Only` 现在只生成 invoice，并按照表单里的发送选项决定是否发送 invoice。
- `Confirmation First` 流程中，客户点击确认后发送的 `[Approved] Order Confirmation needs shipping info` 邮件仍然保留。
- 增加一个手动 Sheet 菜单选项：
  - `LogFresh > Generate Invoice PDF Only for Selected Row`
- 这个选项只生成/更新 invoice PDF，保存到 Drive，永远不会发送邮件。
- 后续生成的 Order Confirmation 和 Invoice 文件名会优先使用 `Bill To Company`。
- 如果 `Bill To Company` 为空，系统才会 fallback 到客户个人名。
- 增加一个手动 Sheet 菜单选项：
  - `LogFresh > Rename Existing Files to Company Names`
- 这个选项会扫描现有输出 Drive 文件夹，把旧的 Google Docs/PDFs 尽量批量改成公司名。
- 更新 unit price 显示逻辑：每个 line item 的单价保留表单输入的小数位数。
- 统一两个 form 的 payment method 选项：
  - `Credit Card`
  - `Prepaid`
  - `Check/Wire Transfer`

## 2026-07-22

- 增加 `客户有效信息` 客户汇总页自动维护。
- 增加可选 `CUSTOMER_INFO_SPREADSHEET_ID` 配置，使客户有效信息可以写入独立 Google Sheets 文件。
- 已创建并配置独立的 `LogFresh Customer Info` Google Sheet 用于客户汇总数据。
- 已连接独立客户资料表：
  - `1J-5LH2qpLD7jpPPRB-XpEKfODC7YOgrJFM6z6b3TSpk`
- 每次生成 Order Confirmation 后自动新增/更新客户信息。
- 每次生成 Invoice 后自动新增/更新客户信息，包括 Form 2 触发的 invoice 生成。
- 在 `LogFresh` 菜单中增加 `Rebuild Customer Info Sheet`，可从历史订单重建客户汇总页。
- 客户汇总字段包含客户、Salesperson、公司/农场、电话、邮箱、账单地址、付款条款、付款方式、最近订单号、最近发票号、最近 tracking、产品摘要、备注。
- 自动排除明显测试/内部记录，包括 Barry Foley 和 LogFresh/AWT 内部邮箱记录。
- 客户匹配优先使用邮箱；缺少邮箱时使用姓名+公司或姓名+电话。
- 增加 `clasp` 部署支持，可从本地项目直接推送到 Google Apps Script。
- 清理 Apps Script 源码目录，现在只部署主自动化脚本和 manifest，避免重复代码冲突。

## 2026-07-21

- 根据实际 invoice 细节反馈，更新 Invoice 和 Order Confirmation 模板。
- 将模板中的公司名大小写更新为：
  - `Logfresh Biotechnology Co., Ltd`
- 将模板地址统一为：
  - `708 N 29th Avenue, Unit 2, Yakima, WA 98902`
- 将 invoice 日期输出格式改为美国标准：
  - `MM/dd/yyyy`
- 更新日期解析逻辑，使斜杠日期按美国 `MM/dd/yyyy` 读取。
- 用最新提供的 Word 模板替换 GitHub 项目中的模板文件。
- 将 GitHub 主页 README 改为中英双语对照介绍。
- 将上述更新推送到 GitHub。

备注：

- GitHub 中的模板文件已更新。
- 如果 Google Drive 里的生产 Google Docs 模板还没有替换，需要在 Drive 中单独更新模板文件。

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
