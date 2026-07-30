# 功能更新记录

这个文件只记录 LogFresh Invoice System 的业务功能变化。
GitHub commit 历史和版本节点请看 [VERSION_TIMELINE.md](VERSION_TIMELINE.md)。

## 2026-07-29 · 价格格式规则

### 新增

- Apps Script manifest 新增 API executable 设置和明确 OAuth scopes。
- 新增 `syncFormsForCli()`，作为命令行/编辑器可运行的表单同步入口。
- 新增多包裹 tracking 支持：shipping update 表单里的 `Tracking Number` 改为可多行输入。
- 新增填写说明：一个订单多个包裹时，每行填写一个 tracking number。
- 内部 `[Ship Info]` 邮件新增客户 / 订单详情块，包含产品数量、单价、客户姓名、公司、账单/收货地址、电话和邮箱。
- 新增一份面向非技术销售 / 内部人员的中文新手完整使用教程。
- 新增一份面向非技术销售 / 内部人员的英文新手完整使用教程。
- 英文新手教程已扩展为与中文教程结构和内容一致，包含 Google Drive 查文件、Customer Info 使用、各角色日常操作和完整故障排查。
- 新增排版版 PDF 新手教程，包含封面、表格、截图、页眉页脚和页码。
- 新增可复用 PDF 生成脚本，后续可从 Markdown 教程重新生成格式化 PDF。
- PDF 生成脚本现在可以生成中文、英文或双语两份教程。
- 在新手教程中加入 Apple Mail 打码截图，用于展示 invoice 邮件和 shipping info 邮件示例。
- LogFresh Google Sheets 菜单新增 `Test Email Only` 和 `Back to Normal`。
- `Test Email Only` 会把所有自动邮件只发送到 `mcp@logfresh.net`，并在测试邮件顶部显示原本的 To/Cc/Bcc。
- `Back to Normal` 会恢复正常客户/内部收件人和多人 CC。
- Order Confirmation Form 的 `Invoice Only` 区域新增多行 `Tracking Number` 支持。
- 已部署客户确认用 Web App endpoint，并把正式 URL 写入 `CONFIG.WEB_APP_URL`。
- Apps Script manifest 明确加入 Web App 设置，支持客户无需登录 Google 访问确认链接。
- 客户 PO / order confirmation 确认后发给内部的 `[Approved]` 邮件新增 `Open Shipping Update Form` 按钮链接。

### 修改

- invoice 客户邮件和内部存档邮件的 tracking 标签改为 `Tracking Number(s)`，HTML 邮件会保留多行 tracking 换行。
- approval 后续 shipping 邮件改为显示清晰按钮，避免内部同事直接看到很长的预填 URL。
- Order Confirmation Form 中的 `Tracking Number` 会固定放在 `Invoice Only` 区域的 `Due Date` 后面，方便销售在初始 invoice-only 流程里输入多个包裹 tracking。
- 更新新手教程和 PDF，说明所有 `Prepaid` 订单都来自 `logfresh.net` 网站下单 / 预付流程。
- 删除新手教程 PDF 末尾旧的截图规划和一句话总结章节。
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
- 同步 Order Confirmation Form、Shipping Update Form、Invoice Shipping Info Update Form 的 shipping method 题型和选项。
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
