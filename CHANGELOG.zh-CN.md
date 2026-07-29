# 功能更新记录

这个文件只记录 LogFresh Invoice System 的业务功能变化。
GitHub commit 历史和版本节点请看 [VERSION_TIMELINE.md](VERSION_TIMELINE.md)。

## 2026-07-29 · 价格格式规则

### 新增

- 新增一份面向非技术销售 / 内部人员的中文新手完整使用教程。
- LogFresh Google Sheets 菜单新增 `Test Email Only` 和 `Back to Normal`。
- `Test Email Only` 会把所有自动邮件只发送到 `mcp@logfresh.net`，并在测试邮件顶部显示原本的 To/Cc/Bcc。
- `Back to Normal` 会恢复正常客户/内部收件人和多人 CC。

### 修改

- 简化 LogFresh Google Sheets 菜单，去掉日常不需要显示的 `Sync Form Address Fields` 和 `Create/Update Form 3` 维护项。
- 所有价格显示默认保留两位小数。
- 如果价格本身有三位或更多小数，系统会保留额外精度，不再强制压成两位。
- 同步应用到 Unit Price、line Amount、Subtotal、Discount、Shipping、Tax、Total、Balance Due、Order Total 和 Customer Info 产品摘要。

## 2026-07-27 · v3 Invoice Shipping Info Workflow

### 新增

- 新增 workflow 选项：`Invoice Only - Needs Shipping Info`。
- 这个流程会先生成内部 invoice，等 shipping / tracking 信息补齐后，再生成最终 invoice 发给客户。
- 新增专用 Form 3，用于 invoice shipping 信息更新。
- Form 3 包含 Order Number、Invoice Number、Shipped Via、Shipping Charge、Tracking Number、Invoice Date、Due Date、Payment Method、Customer Email、Send Invoice Automatically、Internal Notes。
- 自动邮件加入正式 HTML 签名，包含 Logfresh logo、公司地址、电话、邮箱和官网。
- shipping update 邮件里的长预填链接改成清晰按钮，内部同事不需要再看到一整串 URL。

### 修改

- Form 3 删除 Ship Date，因为 invoice 上不显示这个字段。
- 同步 Form 1、Form 2、Form 3 的 shipping method 题型和选项。
- shipping method 选项中加入 `USPS Ground`。
- 改进 Form 3 预填匹配逻辑，Payment Method、Customer Email、Shipped Via 等字段支持题目别名匹配。
- 生成 Form 3 预填链接前会自动标准化 shipping method 和 payment method。
- 最终 invoice 发送逻辑调整：只有明确选择 `Send Invoice Automatically = Yes` 才发送给客户；空白或 `No` 都只发送内部/抄送。
- 新的 pending-shipping workflow 第一阶段只把未完成 shipping 的 invoice 存到 Drive，不再额外发送 internal archive 邮件。
- Form 3 后续生成的新 invoice 会替换前面没有 shipping 信息的旧 invoice 文件。

## 2026-07-23 · Form、Sheet、文件和 Invoice 数据清理

### 新增

- 新增 Google Sheets 手动菜单：只生成 invoice PDF，不发送客户邮件。
- 支持 `Send Invoice Automatically = No` 时把 invoice 发送给内部/抄送用于存档。
- Customer Info 改为按订单记录，每一单都保留一行。
- Billing / Shipping 地址拆分为 Street Address、City、State、ZIP。
- 新增订单总额计算，并同步到主表和 Customer Info。

### 修改

- 生成的 PDF / DOCX 文件名改为使用客户公司名，而不是个人联系人姓名。
- Order Confirmation 和 Invoice 分流到不同 Drive 文件夹。
- invoice update 生成新 invoice 时，会删除/替换旧的重复 invoice 文件。
- Unit Price 保留表单输入的小数精度，不再强制两位小数。
- Payment Method 统一为 `Credit Card`、`Prepaid`、`Check/Wire Transfer`。
- 所有业务日期统一为美国格式 `MM/dd/yyyy`。
- Quantity 和 Amount 相关列显示千位逗号。
- 已有表格记录已回填 address 拆分、order total、customer info、日期格式和千位逗号格式。

### 删除

- 删除临时维护菜单项，因为相关功能已经改为自动执行。
- 取消旧的 invoice-only 自动 `[Update] Invoice shipping information required` 内部提醒。

## 2026-07-21 · 模板、Customer Info 和部署设置

### 新增

- 新增独立 Customer Info spreadsheet 支持。
- 文档生成后自动同步 customer info。
- 新增 Customer Info 重建菜单。
- 新增 `clasp` 部署设置，可以从本地直接推送 Apps Script。
- 新增双语 README 和 setup guide。

### 修改

- 更新 invoice 和 order confirmation 模板为最新版 Word / Google Docs 兼容模板。
- 模板中公司名后缀统一为 `Logfresh Biotechnology Co., Ltd`。
- invoice 日期输出改为美国格式 `MM/dd/yyyy`。
- 清理 Apps Script 部署源文件，只保留主脚本和 manifest。

## 2026-07-20 · 初始 GitHub 项目

### 新增

- 创建 LogFresh invoice automation GitHub 项目结构。
- 添加正式 Apps Script 自动化脚本。
- 添加严格版 Invoice 和 Order Confirmation 模板。
- 添加 README、changelog、setup guide 和版本归档结构。
- 归档早期单阶段 invoice 脚本：`v1-legacy-single-invoice`。
- 归档原始双阶段工作流：`v2-current-two-stage`。
