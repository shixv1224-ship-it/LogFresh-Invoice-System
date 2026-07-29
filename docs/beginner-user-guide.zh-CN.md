# LogFresh 订单与发票系统新手完整教程

这份教程写给只会基础电脑操作、第一次使用 LogFresh 自动订单 / 发票系统的人。你不需要懂代码，只要会打开网页、填写 Google Form、查看邮箱和 Google Drive，就可以按步骤使用。

系统主要做三件事：

- 销售填写订单信息；
- 系统自动生成 Order Confirmation 或 Invoice PDF；
- 系统自动发送客户邮件、内部提醒邮件，并把客户 / 订单信息整理到表格里。

---

## 1. 先认识这套系统

这套系统由几个 Google 工具组成：

| 工具 | 作用 | 普通使用者需要做什么 |
|---|---|---|
| Google Form 1 | 销售创建订单 | 填订单、客户、产品、价格、发送方式 |
| Google Form 2 | 客户确认订单后，补 shipping / tracking | 从内部邮件按钮打开，填写 tracking 等信息 |
| Google Form 3 | Invoice 已先生成、但还缺 shipping 信息时补资料 | 从内部邮件按钮打开，补 tracking 后决定是否发最终 invoice |
| Google Sheet | 系统后台记录表 | 平时主要查看状态、查链接、必要时手动生成 PDF |
| Google Docs 模板 | Order Confirmation / Invoice 模板 | 普通使用者一般不用改 |
| Google Drive | 保存生成的 PDF / Docs 文件 | 找历史 Order Confirmation 和 Invoice |
| Email | 给客户和内部人员发送文件 / 提醒 | 查看客户邮件、内部提醒、测试邮件 |

你每天最常用的是：

1. 打开 Form 1；
2. 填订单；
3. 根据订单情况选择 workflow；
4. 查邮箱确认系统有没有发出；
5. 必要时打开内部邮件里的按钮补 shipping / tracking。

---

## 2. 三种 workflow 怎么选

Form 1 里最重要的问题是 `Workflow Type`。现在有三种：

```text
Invoice Only
Invoice Only - Needs Shipping Info
Confirmation First
```

### 2.1 Invoice Only

适合：客户已经确认订单，可以直接开 invoice。

使用场景：

- 客户已经口头 / 邮件确认；
- 价格、数量、地址都确定；
- 不需要先发 Order Confirmation 给客户确认。

系统会：

- 直接生成 Invoice PDF；
- 如果 `Send Confirmation Automatically = Yes`，系统会把 invoice 发给客户，并 CC 内部邮箱；
- 如果 `Send Confirmation Automatically = No`，系统不会发给客户，只会发给 Salesperson Email 和内部 CC，用于内部存档。

简单理解：

```text
Invoice Only + Yes = 直接发 invoice 给客户
Invoice Only + No = 不发客户，只发内部存档
```

### 2.2 Invoice Only - Needs Shipping Info

适合：客户已经确认订单，但 tracking number / shipping 信息还没准备好。

使用场景：

- 销售已经可以先做 invoice；
- 但仓库 / 包装还没完成；
- tracking number 之后才知道；
- 你不想先把缺 tracking 的 invoice 发给客户。

系统会：

- 先生成一份内部 invoice；
- 这份 invoice 只保存到 Drive，不会发给客户；
- 系统给 Salesperson Email / 内部人员发一封 `[Ship Info]` 邮件；
- 邮件里有一个按钮：`Open Shipping Info Form`；
- 等 tracking 准备好以后，点击按钮打开 Form 3；
- Form 3 填完后，系统重新生成最终 invoice；
- 新的最终 invoice 会替换前面那份缺 shipping 的旧 invoice。

Form 3 里最重要的是：

```text
Send Invoice Automatically = Yes
```

如果这里选 `Yes`，最终 invoice 会发给客户。  
如果空着或选 `No`，最终 invoice 只发内部 / CC，不发客户。

简单理解：

```text
先内部生成 invoice
等 tracking 好了
再用 Form 3 决定是否发最终 invoice 给客户
```

### 2.3 Confirmation First

适合：客户需要先确认订单，再开 invoice。

使用场景：

- 客户还没最终确认；
- 需要客户先看 Order Confirmation；
- 客户确认后再补 shipping / tracking 并开 invoice。

系统会：

- 先生成 Order Confirmation PDF；
- 如果 `Send Confirmation Automatically = Yes`，系统会发给客户；
- 客户邮件里有 `Approve Order` 按钮；
- 客户点击按钮后，不需要登录 Google；
- 系统把订单状态改成 `Customer Approved`；
- 系统给 Salesperson Email / 内部人员发 `[Approved]` 邮件；
- 内部人员再通过邮件里的 Form 2 链接补 shipping / tracking；
- Form 2 提交后生成 invoice；
- 如果 Form 2 的 `Send Invoice Automatically = Yes`，invoice 会发给客户。

简单理解：

```text
先发 Order Confirmation
客户点确认
内部补 tracking
最后发 invoice
```

---

## 3. Form 1：销售创建订单怎么填

Form 1 是销售最常用的表单。填写前请先准备好：

- 客户姓名 / 公司名；
- 客户邮箱；
- billing address；
- shipping address；
- 产品名称、数量、单价；
- shipping method；
- payment method；
- 是否要自动发送给客户。

### 3.1 Workflow Type

选择当前订单流程：

| 选项 | 什么时候用 |
|---|---|
| `Invoice Only` | 客户已经确认，直接发 invoice 或内部存档 |
| `Invoice Only - Needs Shipping Info` | 客户确认了，但 tracking 还没准备好 |
| `Confirmation First` | 需要客户先确认订单 |

### 3.2 Order Date

填写订单日期。  
系统最终显示会使用美国格式：

```text
MM/dd/yyyy
```

例如：

```text
07/29/2026
```

如果 Google Form 显示成日期选择器，直接点日期即可。

### 3.3 Salesperson

填写销售姓名，例如：

```text
Barry Foley
```

### 3.4 Salesperson Email

填写对应销售的邮箱。这个非常重要，因为内部提醒会优先发到这个邮箱。

例如：

```text
barry@example.com
```

如果这里写错：

- 客户确认后，销售可能收不到提醒；
- invoice 内部存档可能发不到对应销售；
- shipping update 邮件可能发错人。

### 3.5 Order Number

一般可以留空。系统会自动生成。

格式是：

```text
ORD-YYYYMMDD-###
```

例如：

```text
ORD-20260729-001
```

意思是 2026 年 7 月 29 日当天第 1 单。

除非你非常确定要手动指定编号，否则不要填。

### 3.6 Invoice Number

一般可以留空。系统会根据 Order Number 自动生成对应 invoice number。

格式是：

```text
INV-YYYYMMDD-###
```

例如：

```text
INV-20260729-001
```

通常 Order 和 Invoice 会用同一个每日序号。

### 3.7 Customer PO

Customer PO 是客户自己的采购订单号。

怎么填：

- 如果客户给了 PO number，就填客户给的 PO；
- 如果客户没有 PO，可以留空；
- 如果公司内部要求，也可以之后按内部规则补。

注意：Customer PO 不是 LogFresh 的 order number，也不是 invoice number。

### 3.8 Shipped Via

选择 shipping method。

常见选项：

```text
UPS Ground (Free)
UPS Ground
UPS 2nd Day Air
UPS 3rd Day Air
UPS Next Day Air
UPS Next Day Air Early
UPS Ground + UPS Next Day Air Early
USPS Ground
Other
```

如果客户不急，常用 `UPS Ground (Free)`。  
如果有特殊要求，按实际 shipping method 选择。

### 3.9 Payment Method

目前固定选项：

```text
Credit Card
Prepaid
Check/Wire Transfer
```

美国使用 `Check`，不是 `Cheque`。

### 3.10 Billing 信息

Billing 是账单信息，也就是 invoice 上的 `Bill To`。

需要填写：

- `Bill To Name`
- `Bill To Company`
- `Bill To Address`
- `Bill To City`
- `Bill To State`
- `Bill To ZIP`
- `Bill To Phone`
- `Bill To Email`

建议：

- 公司名尽量完整；
- 地址分开填，不要把 City / State / ZIP 都塞到 Address；
- State 用美国两位缩写，例如 `CA`、`WA`、`NY`；
- ZIP 单独填。

### 3.11 Shipping 信息

Shipping 是发货地址，也就是 invoice / order confirmation 上的 `Ship To`。

如果 shipping address 和 billing address 一样，选择：

```text
Same as billing
```

如果不一样，就填写：

- `Ship To Name`
- `Ship To Company`
- `Ship To Address`
- `Ship To City`
- `Ship To State`
- `Ship To ZIP`
- `Ship To Phone`
- `Ship To Email`

### 3.12 Item 产品信息

最多支持 6 个产品行：

```text
Item 1 Quantity
Item 1 Description
Item 1 Unit Price
...
Item 6 Quantity
Item 6 Description
Item 6 Unit Price
```

填写规则：

- Quantity 填数量，例如 `100`；
- Description 填产品描述；
- Unit Price 填单价，不要写复杂文字；
- 价格可以写 `$2`、`2`、`2.10`、`2.123`。

价格显示规则：

| 输入 | 文件中显示 |
|---|---|
| `2` | `$2.00` |
| `2.1` | `$2.10` |
| `2.12` | `$2.12` |
| `2.123` | `$2.123` |
| `1234.5` | `$1,234.50` |

简单理解：默认两位小数；如果你输入三位或更多小数，就保留更多位。

### 3.13 Discount

如果没有 discount，填 `0` 或留空。  
如果有 discount，填数字，例如：

```text
25
```

系统会按金额扣减。

### 3.14 Shipping Charge

如果 shipping 免费，可以填：

```text
0
```

如果要收费，填金额，例如：

```text
18.50
```

### 3.15 Tax Rate Percent

如果没有 tax，填 `0` 或留空。  
如果有税率，填百分比数字，不要加 `%` 也可以。

例如 8.5%：

```text
8.5
```

### 3.16 Customer Email

这是系统发给客户时优先使用的邮箱。

建议填写客户最终收件邮箱。  
如果只是内部测试，先不要填真实客户邮箱，或者先开启 `Test Email Only`。

### 3.17 Send Confirmation Automatically

这个选项控制是否自动发邮件。

虽然名字叫 `Send Confirmation Automatically`，但它是 Form 1 的统一发送开关。

| Workflow | 选 Yes | 选 No |
|---|---|---|
| Invoice Only | invoice 发给客户，并 CC 内部 | invoice 不发客户，只发销售和内部做存档 |
| Invoice Only - Needs Shipping Info | 第一阶段不发客户；只发内部 shipping info 提醒 | 第一阶段同样不发客户；只发内部 shipping info 提醒 |
| Confirmation First | Order Confirmation 发给客户 | 只生成 PDF，不自动发客户 |

如果你不确定，测试时先点 LogFresh 菜单里的 `Test Email Only`。

---

## 4. Workflow 1：直接 Invoice Only

### 4.1 什么时候用

客户已经确认订单，可以直接开 invoice。

### 4.2 操作步骤

1. 打开 Form 1；
2. `Workflow Type` 选择 `Invoice Only`；
3. 填客户信息、地址、产品、价格；
4. 如果要发客户，`Send Confirmation Automatically` 选 `Yes`；
5. 如果只想内部存档，`Send Confirmation Automatically` 选 `No`；
6. 点 Submit。

### 4.3 提交后会发生什么

系统会：

- 自动生成 Order Number；
- 自动生成 Invoice Number；
- 生成 Invoice PDF；
- 把文件保存到 Invoice Drive 文件夹；
- 更新 Google Sheet 里的 `Invoice URL`；
- 更新 `Order Status`；
- 更新 Customer Info。

如果自动发送客户：

- 客户收到 `[INV] Invoice with LogFresh` 邮件；
- 内部固定邮箱会被 CC；
- 销售邮箱也会被 CC。

如果不发送客户：

- 客户不会收到；
- 销售和内部邮箱会收到 `[INV Internal] Invoice archive copy`。

---

## 5. Workflow 2：Invoice Only - Needs Shipping Info

### 5.1 什么时候用

订单已经确认，但 tracking number 还没出来。

### 5.2 第一阶段：销售提交订单

1. 打开 Form 1；
2. `Workflow Type` 选择 `Invoice Only - Needs Shipping Info`；
3. 填客户、产品、价格、shipping method；
4. Tracking Number 可以先不填；
5. Submit。

### 5.3 第一阶段系统会做什么

系统会：

- 生成内部 invoice；
- 保存到 Invoice Drive 文件夹；
- 不发给客户；
- 把订单状态设为 `Awaiting Shipping Info`；
- 给 Salesperson Email / 内部邮箱发送 `[Ship Info] Invoice needs shipping info` 邮件。

邮件里会有按钮：

```text
Open Shipping Info Form
```

### 5.4 第二阶段：shipping / tracking 准备好以后

1. 打开 `[Ship Info]` 邮件；
2. 点击 `Open Shipping Info Form`；
3. 检查 Order Number / Invoice Number 是否已经预填；
4. 填 `Tracking Number`；
5. 检查或填写 `Shipped Via`；
6. 填或确认 `Shipping Charge`；
7. 检查 `Invoice Date`；
8. 检查 `Due Date`；
9. 检查 `Payment Method`；
10. 检查 `Customer Email`；
11. 如果要发最终 invoice 给客户，`Send Invoice Automatically` 选 `Yes`；
12. 如果只要内部存档，选 `No` 或留空；
13. Submit。

### 5.5 Form 3 提交后会发生什么

系统会：

- 找到原订单；
- 把 shipping / tracking 写回主表；
- 重新生成 invoice；
- 删除 / 替换之前缺 shipping 的 invoice；
- 如果 `Send Invoice Automatically = Yes`，发给客户；
- 如果空白或 `No`，只发内部 / CC。

---

## 6. Workflow 3：Confirmation First

### 6.1 什么时候用

客户需要先确认订单内容，再开 invoice。

### 6.2 第一阶段：销售提交 Form 1

1. 打开 Form 1；
2. `Workflow Type` 选择 `Confirmation First`；
3. 填完整订单；
4. `Send Confirmation Automatically` 选 `Yes`；
5. Submit。

### 6.3 客户收到什么

客户会收到邮件：

```text
[ORD] Order Confirmation with LogFresh - ORD-YYYYMMDD-###
```

邮件里有：

- Order Confirmation PDF；
- `Approve Order` 按钮。

客户点击按钮后，不需要登录 Google。

### 6.4 客户点击确认后会发生什么

系统会：

- 把订单状态改成 `Customer Approved`；
- 记录 `Customer Approved At` 时间；
- 给 Salesperson Email / 内部邮箱发送 `[Approved] Order Confirmation needs shipping info` 邮件；
- 邮件里会带 Form 2 的 update link。

### 6.5 内部人员提交 Form 2

打开 `[Approved]` 邮件里的 update link，填写：

- `Order Number`
- `Ship Date`
- `Shipped Via`
- `Tracking Number`
- `Invoice Number`
- `Invoice Date`
- `Due Date`
- `Payment Method`
- `Customer Email`
- `Send Invoice Automatically`
- `Internal Notes`

如果 `Send Invoice Automatically = Yes`：

- 系统生成最终 invoice；
- invoice 发给客户；
- 内部邮箱被 CC。

如果空白或 `No`：

- 系统生成 invoice；
- 不发客户；
- 发内部 / CC 做存档。

---

## 7. Google Sheet 怎么看

Google Sheet 是系统后台记录。普通使用者不需要手动改太多，但要会看状态。

### 7.1 主要 tab

| Tab | 作用 |
|---|---|
| `Order Confirmation` | 主订单记录，Form 1 的回复和系统结果都在这里 |
| `Shipping Updates` | Form 2 / Form 3 的 shipping update 回复 |
| `Customer Info` | 客户 / 订单汇总，方便导出 Excel |

### 7.2 常用列

| 列名 | 含义 |
|---|---|
| `Order Number` | 系统订单号 |
| `Invoice Number` | 系统发票号 |
| `Order Status` | 当前订单状态 |
| `Order Confirmation URL` | Order Confirmation PDF 链接 |
| `Customer Approval URL` | 客户确认链接 |
| `Invoice URL` | Invoice PDF 链接 |
| `Order Confirmation Sent At` | Order Confirmation 发送时间 |
| `Customer Approved At` | 客户确认时间 |
| `Invoice Sent At` | Invoice 发客户时间 |
| `Invoice Internal Archive Sent At` | Invoice 内部存档发送时间 |
| `Internal Notes` | 错误或内部备注 |

### 7.3 Order Status 怎么读

| 状态 | 含义 |
|---|---|
| `Pending Customer Approval` | Order Confirmation 已生成，等待客户确认 |
| `Customer Approved` | 客户已点击确认 |
| `Awaiting Shipping Info` | 等待补 shipping / tracking |
| `Invoice Created` | Invoice 已生成 |
| `Invoice Sent` | Invoice 已发给客户 |

---

## 8. LogFresh 菜单怎么用

打开 Google Sheet 后，顶部菜单会出现：

```text
LogFresh
```

如果没看到：

- 刷新页面；
- 等几秒；
- 确认你打开的是正确的 response spreadsheet。

### 8.1 Generate Order Confirmation for Selected Row

用途：手动为选中的一行生成 Order Confirmation。

操作：

1. 点选订单所在行；
2. 点 `LogFresh`;
3. 点 `Generate Order Confirmation for Selected Row`。

适合：

- 自动生成失败后重试；
- Form 1 已提交，但需要手动再生成一次。

### 8.2 Generate & Email Invoice for Selected Row

用途：手动为选中订单生成并发送 invoice。

注意：这个会发送邮件。测试前最好先打开 `Test Email Only`。

### 8.3 Generate Invoice PDF Only for Selected Row

用途：只生成 invoice PDF，不发送任何邮件。

适合：

- 只想先看 PDF；
- 只想保存文件到 Drive；
- 不想让客户或内部收到邮件。

### 8.4 Rebuild Customer Info Sheet

用途：重新整理 Customer Info。

适合：

- Customer Info 少了记录；
- 修改过历史订单；
- 想从主订单表重新生成客户汇总。

### 8.5 Test Email Only

用途：安全测试邮件，避免误发客户。

点了以后：

- 所有自动邮件都只会发到 `mcp@logfresh.net`；
- 不会发真实客户；
- 不会发其他 CC；
- 邮件标题前面会加 `[TEST EMAIL ONLY]`；
- 邮件顶部会显示原本的 To / Cc / Bcc，方便检查。

什么时候用：

- 测试新订单；
- 测试新模板；
- 测试客户邮箱之前；
- 不确定系统会发给谁时。

### 8.6 Back to Normal

用途：恢复正式发送。

点了以后：

- 客户邮件会正常发给客户；
- 内部 CC 会恢复；
- 自动化回到正式模式。

非常重要：测试完成后，如果要正式使用，一定要点 `Back to Normal`。

### 8.7 Test Latest Row: Order Confirmation

用途：测试最后一行生成 Order Confirmation。

普通销售一般不需要用。管理员测试时才用。

---

## 9. 邮件怎么看

### 9.1 客户 Order Confirmation 邮件

标题类似：

```text
[ORD] Order Confirmation with LogFresh - ORD-20260729-001
```

附件：

- Order Confirmation PDF

按钮：

```text
Approve Order
```

客户点按钮后，系统会记录客户确认。

### 9.2 客户 Invoice 邮件

标题类似：

```text
[INV] Invoice with LogFresh - INV-20260729-001 / ORD-20260729-001
```

下面是 Apple Mail 中的 invoice 邮件示例。截图已打码，实际邮件会显示真实客户邮箱、订单号和附件预览。

![Apple Mail invoice 邮件示例](images/apple-mail-invoice-preview-redacted.png)

附件：

- Invoice PDF

邮件里会显示：

- Order Number；
- Shipping Method；
- Tracking Number。

### 9.3 内部 Order Approved 邮件

标题类似：

```text
[Approved] Order Confirmation needs shipping info - ORD-20260729-001
```

用途：

- 客户已经确认；
- 内部需要补 shipping / tracking；
- 然后生成 invoice。

### 9.4 内部 Invoice Shipping Info 邮件

标题类似：

```text
[Ship Info] Invoice needs shipping info - INV-20260729-001 / ORD-20260729-001
```

邮件里有按钮：

```text
Open Shipping Info Form
```

点进去后补 tracking，并决定是否发最终 invoice 给客户。

下面这张截图来自早期测试邮件，截图里还能看到长链接；新版邮件已经改为按钮显示，目的是避免长链接被邮箱自动换行或拆开。截图已打码。

![Apple Mail shipping info 邮件示例](images/apple-mail-ship-info-redacted.png)

### 9.5 内部 Invoice Archive 邮件

标题类似：

```text
[INV Internal] Invoice archive copy - INV-20260729-001 / ORD-20260729-001
```

意思是：

- invoice 生成了；
- 但没有发给客户；
- 这封只是内部存档。

---

## 10. Google Drive 里怎么找文件

系统会把文件分开保存：

| 文件类型 | 保存位置 |
|---|---|
| Order Confirmation | Order Confirmation 文件夹 |
| Invoice | Invoice 文件夹 |

文件名一般类似：

```text
Order Confirmation ORD-20260729-001 - Customer Company
Invoice INV-20260729-001 - Customer Company
```

现在文件名使用客户公司名，不使用个人联系人姓名。

如果一个 invoice 后续被更新：

- 新 invoice 会生成；
- 旧的重复 invoice 会被移到 Drive trash；
- 这样同一订单不会留下多个旧 invoice 混淆。

---

## 11. Customer Info 怎么用

Customer Info 是客户 / 订单汇总表。它适合用来导出 Excel、做客户分析、筛选城市 / 州 / ZIP、查看订单金额。

常见列包括：

- Customer Name；
- Company；
- Phone；
- Email；
- Billing Address；
- Billing City；
- Billing State；
- Billing ZIP；
- Payment Method；
- Order Date；
- Order Number；
- Invoice Number；
- Tracking Number；
- Product Summary；
- Order Total；
- Notes。

注意：

- Customer Info 是按订单记录，不是每个客户只保留一行；
- 同一个客户一天有两单，也应该出现两行；
- 如果少了记录，可以在 Sheet 菜单点 `LogFresh > Rebuild Customer Info Sheet`。

---

## 12. 新手最推荐的安全测试流程

第一次使用时，强烈建议先这样测试：

### Step 1：打开测试邮件模式

在 Google Sheet：

```text
LogFresh > Test Email Only
```

看到提示后，说明测试模式开启。

### Step 2：提交一单测试 Form 1

建议先测试：

```text
Workflow Type = Invoice Only
Send Confirmation Automatically = Yes
Customer Email = 你自己的邮箱或测试邮箱
```

因为 Test Email Only 已开启，所以即使 Customer Email 写了客户，也不会真的发给客户。

### Step 3：检查 mcp@logfresh.net

看是否收到：

```text
[TEST EMAIL ONLY] [INV] Invoice with LogFresh ...
```

邮件顶部会显示原本要发给谁。

### Step 4：检查 PDF

打开邮件附件或 Sheet 里的 `Invoice URL`。

检查：

- 公司名；
- 地址；
- 日期格式；
- 价格；
- 数量；
- Total；
- payment method；
- shipping method；
- customer email；
- tracking number。

### Step 5：恢复正式模式

测试没问题后，在 Google Sheet 点：

```text
LogFresh > Back to Normal
```

之后系统才会正常发客户 / 多人 CC。

---

## 13. 常见错误和处理方法

### 13.1 没收到邮件

先检查：

1. 是否开启了 `Test Email Only`；
2. 如果开启，邮件只会到 `mcp@logfresh.net`；
3. 检查 spam / junk；
4. 检查 Form 里 Customer Email 是否为空或写错；
5. 检查 Salesperson Email 是否为空或写错；
6. 检查 Apps Script 执行记录有没有报错。

如果是测试后忘记恢复：

```text
LogFresh > Back to Normal
```

### 13.2 客户说没有收到

检查：

- Sheet 里的 `Invoice Sent At` 或 `Order Confirmation Sent At` 是否有时间；
- Customer Email 是否正确；
- 是否发到了客户的 spam；
- 是否当时还在 `Test Email Only` 模式；
- 是否选择了 `Send Confirmation Automatically = No` 或 `Send Invoice Automatically = No`。

### 13.3 Form 2 / Form 3 提交后显示找不到订单

常见原因：

- `Order Number` 没填；
- `Order Number` 拼错；
- Form 2 / Form 3 里的 Order Number 和主表不一致；
- 复制链接时漏掉了一部分；
- 表单没有通过邮件按钮打开，而是手动打开空白表单后没有填 Order Number。

处理：

1. 到主表找到正确 `Order Number`；
2. 复制完整编号；
3. 重新提交 Form 2 / Form 3；
4. 如果还是失败，看 `Shipping Updates` tab 的 `Processing Status`。

### 13.4 地址为空

检查：

- Bill To Address 是否填了；
- Bill To City / State / ZIP 是否分别填了；
- Shipping Address Option 是否选择正确；
- 如果 Ship To 和 Bill To 不一样，Ship To 地址是否完整填写。

### 13.5 PDF 价格小数不对

当前规则：

- 默认两位小数；
- 三位或更多小数会保留。

如果输入 `2`，显示 `$2.00` 是正常的。  
如果输入 `2.123`，显示 `$2.123` 是正常的。

### 13.6 生成了两个 invoice

正常情况下，Form 2 / Form 3 更新生成的新 invoice 会替换旧 invoice。  
如果你在 Drive 里仍看到旧文件，可能是：

- 旧文件不是同一命名规则；
- 旧文件是手动复制的；
- 旧文件在不同文件夹；
- 更新前系统还没启用替换逻辑。

处理：

- 以 Sheet 里的最新 `Invoice URL` 为准；
- 不确定时问管理员检查。

### 13.7 点菜单没有反应

检查：

- 是否选中了正确订单行；
- 是否弹出授权窗口但被浏览器拦截；
- 是否刷新 Sheet 后再试；
- 是否打开的是正确 Google Sheet；
- Apps Script 是否有执行错误。

---

## 14. 每个角色每天怎么用

### 14.1 销售 Salesperson

每天主要做：

1. 填 Form 1；
2. 选正确 Workflow Type；
3. 填 Salesperson Email；
4. 检查客户邮箱；
5. 看是否收到内部提醒；
6. 如需要，点击内部邮件按钮补 shipping / tracking。

### 14.2 Shipping / Packing 人员

每天主要做：

1. 等销售或系统发来的 `[Ship Info]` / `[Approved]` 邮件；
2. 点击邮件里的 update form 按钮；
3. 填 tracking number；
4. 检查 shipped via / shipping charge；
5. 提交。

### 14.3 管理员 / 系统维护者

需要会：

- 开启 `Test Email Only`；
- 恢复 `Back to Normal`；
- 在 Sheet 菜单手动生成 PDF；
- 查看 Apps Script execution log；
- Rebuild Customer Info；
- 检查 Drive 文件夹；
- 检查 Form 字段名称是否被误改。

---

## 15. 不要随便改的地方

以下内容不要随便改，否则系统可能匹配不到字段：

- Google Form 问题标题；
- Google Sheet tab 名；
- Google Sheet 第一行 header；
- Google Docs 模板里的占位符；
- Apps Script 里的 template ID / folder ID / form ID；
- Web App deployment；
- Apps Script trigger。

如果必须改问题标题，改完需要同步脚本字段名称。

---

## 16. 截图位置建议

当前教程先以文字为主。以后可以补这些截图：

| 截图编号 | 建议截图内容 | 放在教程位置 |
|---|---|---|
| Screenshot 1 | Form 1 顶部：Workflow Type / Salesperson Email | 第 3 章 |
| Screenshot 2 | Form 1 地址字段：City / State / ZIP 分开填写 | 第 3.10 / 3.11 |
| Screenshot 3 | Form 1 产品价格字段 | 第 3.12 |
| Screenshot 4 | Sheet 顶部 LogFresh 菜单 | 第 8 章 |
| Screenshot 5 | Test Email Only 提示窗口 | 第 8.5 / 第 12 章 |
| Screenshot 6 | 客户 Order Confirmation 邮件和 Approve Order 按钮 | 第 9.1 |
| Screenshot 7 | 内部 `[Ship Info]` 邮件和 Open Shipping Info Form 按钮 | 第 9.4 |
| Screenshot 8 | Form 3 预填后的样子 | 第 5.4 |
| Screenshot 9 | Customer Info 表格 | 第 11 章 |

如果你之后把截图发给 Codex，可以继续把图片插入到这份 Markdown 教程里。

---

## 17. 一句话版本

如果你只记一件事：

```text
先开 Test Email Only 测试 → 用 Form 1 填订单 → 根据情况选 workflow → 看 mcp 邮箱确认 → 没问题再 Back to Normal 正式发送。
```
