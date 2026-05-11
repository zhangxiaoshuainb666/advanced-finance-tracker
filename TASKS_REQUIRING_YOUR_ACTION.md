# 仍需你们团队完成的事项

以下内容我不能代做，因为它们需要真实账号权限、真实运行时间、真实截图或团队成员信息。不要伪造这些证据，作业评分会交叉检查 GitHub、部署记录、PR 和贡献表。

## 1. GitHub fork 与提交记录

1. 在 GitHub 上 fork 原项目：`https://github.com/sptin2002/advanced-finance-tracker`。
2. 把当前本地代码推送到你们团队 fork 的 `main` 分支。
3. 用真实 fork 地址替换 `github-url.txt` 中的占位内容。
4. 每个成员最好通过 Pull Request 合并自己的任务，后续贡献表需要 PR 链接。

## 2. Vercel/Render 部署与 7 天上线证明

1. 用你们团队账号把 fork 导入 Vercel 或 Render。
2. 部署成功后，把生产环境 URL 写入 `live-url.txt`。
3. 让站点连续保持可访问 7 天以上。
4. 截图部署平台的 deployment/activity log，并在报告中标为：
   `Figure 1. Vercel/Render deployment log showing 7+ consecutive days of uptime.`

注意：如果今天才第一次部署，就无法凭空获得过去 7 天的真实 uptime 证明。只能使用已经提前部署过的站点记录，或联系 TA/Module Leader 说明情况。

## 3. Codecov 覆盖率徽章

本地已经配置了测试和覆盖率：

```bash
npm test
npm run coverage
npm run coverage:lcov
```

当前本地结果：`finance-core.js` 行覆盖率 100.00%，函数覆盖率 100.00%，分支覆盖率 88.52%。

你们还需要：

1. 在 Codecov 创建项目并连接团队 fork。
2. 如果 Codecov 要求 token，把 token 加到 GitHub 仓库 secrets：`CODECOV_TOKEN`。
3. 推送代码，等待 `.github/workflows/test-and-coverage.yml` 通过。
4. 在 Codecov 页面或 README badge 截图，并在报告中标为：
   `Figure 2. Codecov coverage badge showing at least 80% coverage.`

## 4. Lighthouse Accessibility 90+ 截图

1. 打开线上部署 URL。
2. Chrome DevTools -> Lighthouse。
3. 勾选 Accessibility，运行审计。
4. 确认 Accessibility 分数 >= 90。
5. 截图并在报告中标为：
   `Figure 3. Lighthouse Accessibility score for the deployed app.`

## 5. i18n 与 Cookie Banner 截图

代码里已完成：

- 英文/中文切换按钮。
- Cookie Banner。
- `privacy.html` 隐私政策页面。

你们需要在线上页面截图：

- `Figure 4. Language toggle showing the app in English and Chinese.`
- `Figure 5. Cookie Banner and Privacy Policy page.`

## 6. report.pdf

我已提供 `report-draft.md`，但最终 PDF 需要你们加入真实截图和团队信息后生成。

建议流程：

1. 把 `report-draft.md` 复制到 Word / Google Docs / WPS。
2. 按 PDF 要求设置格式：正文 12pt Calibri/Arial，一级标题 14pt Bold，代码块 10pt Consolas/Courier New。
3. 插入所有真实截图，确保每张图都有 figure number 和 caption。
4. 控制正文在 1,500 words ±10%。
5. 导出为 `report.pdf`。

## 7. individual-contribution.xlsx

我无法知道真实成员姓名、学号、贡献比例、PR 链接和同伴评分。请用真实信息填写 `individual-contribution.xlsx` 模板：

- Member name
- Student ID
- Main tasks
- Pull Request links
- Contribution percentage
- Peer-assessment mark

## 8. 最终 ZIP

最终提交文件名应为 `GroupXX.zip`，至少包含：

- `report.pdf`
- `github-url.txt`
- `live-url.txt`
- `individual-contribution.xlsx`

建议额外保留源码、测试、隐私页和 CI 配置在 GitHub fork 中，报告通过链接和截图证明。
