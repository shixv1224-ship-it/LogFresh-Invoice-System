# 更新日志

## GitHub 版本时间线

这一部分根据当前 GitHub repo 中保留的 commit 和 `versions/` 归档整理。

### `a5dcef5` - Initial LogFresh invoice automation system

- 创建第一版 GitHub 项目结构。
- 添加正式 Apps Script 文件。
- 添加严格版 Invoice 和 Order Confirmation 模板。
- 添加第一版英文 README、CHANGELOG 和部署指南。
- 将完整双流程自动化系统作为 GitHub 初始版本保存。

### `cc9c812` - Bilingual docs and version archive

- 添加中文文档。
- 添加中文部署指南。
- 添加历史版本归档目录。
- 增加 `v1-legacy-single-invoice`，归档早期单阶段 invoice 脚本。
- 增加 `v2-current-two-stage`，归档当前双阶段 workflow 脚本。

### `1cabffa` - Bilingual homepage README

- 将 GitHub 主页 README 改为中英双语对照。
- 增加双语说明：workflow、字段、编号、日期、邮件标题、部署说明等。

### `631fcdf` - U.S. invoice date format

- 将 invoice 日期输出从 `dd/MM/yyyy` 改为美国常用 `MM/dd/yyyy`。
- 更新斜杠日期解析逻辑，按美国月/日顺序读取。
- 同步更新中英文文档中的日期说明。

### `8a3449d` - Latest invoice and order confirmation templates

- 用最新提供的 Word 模板替换 GitHub 中的模板文件。
- 保留模板占位符与 Apps Script 的兼容性。

### `d80950c` - Company suffix casing in templates

- 将模板顶部公司后缀从 `LTD` 改为 `Ltd`。
- 确认模板顶部为 `Logfresh Biotechnology Co., Ltd`。

### `84be5ca` - Customer info sync

- 增加客户汇总表自动同步功能。
- 在生成 Order Confirmation 和 Invoice 后自动新增/更新客户记录。
- 增加从历史订单重建客户汇总表的菜单操作。

### `e1b6748` - July 21 changelog refinements

- 补充 2026-07-21 模板细节更新日志。
- 保留远端新增的客户信息同步 changelog。
- rebase 后推送合并后的 changelog。

## 2026-07-22

- 增加 `客户有效信息` 客户汇总页自动维护。
- 增加可选 `CUSTOMER_INFO_SPREADSHEET_ID` 配置，使客户有效信息可以写入独立 Google Sheets 文件。
- 每次生成 Order Confirmation 后自动新增/更新客户信息。
- 每次生成 Invoice 后自动新增/更新客户信息，包括 Form 2 触发的 invoice 生成。
- 在 `LogFresh` 菜单中增加 `Rebuild Customer Info Sheet`，可从历史订单重建客户汇总页。
- 客户汇总字段包含客户、Salesperson、公司/农场、电话、邮箱、账单地址、付款条款、付款方式、最近订单号、最近发票号、最近 tracking、产品摘要、备注。
- 自动排除明显测试/内部记录，包括 Barry Foley 和 LogFresh/AWT 内部邮箱记录。
- 客户匹配优先使用邮箱；缺少邮箱时使用姓名+公司或姓名+电话。

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
