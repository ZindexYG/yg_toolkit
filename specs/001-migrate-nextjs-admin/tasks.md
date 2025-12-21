````markdown
---
description: "Task list for migrating React 19 → Next.js 16 + Tailwind + next-shadcn-admin-dashboard"
---

# Tasks: 迁移 React 19 → Next.js 16 + Tailwind + next-shadcn-admin-dashboard

**Input**: `spec.md`, `plan.md`
**Prerequisites**: 已创建迁移分支 `001-migrate-nextjs-admin`，Plan 签署或确认假设

**Constitution Compliance**:

- 文档输出语言为 **简体中文**。
- 技术名词保留英文原名（React、Next.js、Tailwind、Shadcn UI 等）。
- 每个任务包含可执行步骤、明确交付物路径与验收条件。
- 破坏性任务必须包含回滚步骤与风险评估。

## 格式: `[ID] [P?] [Story] 描述`

注意：优先实现 P1 用户故事（Routing、Tailwind、Layout），逐步推进 P2、P3。

## Phase 1: Setup（共享基础）

- [ ] T001 Initialize Next.js skeleton (P1) — 在仓库中初始化 `app/` 框架与 `next.config.js`。
  - Steps: 新增 `app/layout.tsx`（占位）、`next.config.js`、`package.json` 中加入 Next.js 16 依赖
  - Deliverable: `app/` 可用最小示例页面，`npm run dev` 能启动（staging/dev）
  - Acceptance: 访问本地 `http://localhost:3000` 返回 200 且页面包含 `app` 根节点
  - Rollback: 删除新增文件并恢复 `package.json` 依赖

- [ ] T002 Add Tailwind基础 (P1) — 添加 `tailwind.config.js`、`postcss.config.js` 与 `styles/globals.css`
  - Steps: 安装 tailwindcss、postcss、autoprefixer；在 `_app`/`layout` 中引入 `globals.css`
  - Deliverable: `tailwind.config.js` 与 `styles/globals.css` 存在
  - Acceptance: 在一个 demo 页面中使用 `class="bg-red-500"` 能看到样式生效
  - Rollback: 移除 Tailwind 文件并恢复原全局样式

## Phase 2: Routing 重构与 Layout

- [ ] T010 路由骨架迁移（P1） — 将首页 `/` 与 `/dashboard` 迁移到 `app/` 且支持 SSR/SSG
  - Path examples: `app/page.tsx`, `app/dashboard/page.tsx`, `app/layout.tsx`
  - Acceptance: staging 上 `/` 与 `/dashboard` 返回含关键 HTML 内容且可被抓取（服务端渲染或静态生成）
  - Rollback: 通过 feature flag 或反向代理恢复旧路由

- [ ] T011 Layout 完成（P1） — 实现全局 header、sidebar、breadcrumb 组件
  - Files: `app/layout.tsx`, `components/Header.tsx`, `components/Sidebar.tsx`, `components/Breadcrumb.tsx`
  - Acceptance: 在任意页面均能看到 header/side 并且导航可用
  - Rollback: 将 `app/layout.tsx` 指向临时占位 layout 恢复最小样式

## Phase 2a: 样式重置与 Design tokens

- [ ] T020 全局样式替换（P1） — 在 `styles/globals.css` 中加入 Tailwind preflight 与 base reset
  - Acceptance: 浏览器渲染基础元素（h1/h2/p/button）样式正常，无明显断裂
  - Rollback: 恢复原有 global css 文件

## Phase 3: 组件迁移（分批）

- [ ] T100 迁移基础组件集（P2） — 迁移 `Button`, `Card`, `Input`, `Table`
  - Files: `components/ui/Button.tsx`, `components/ui/Card.tsx`, `components/ui/Input.tsx`, `components/ui/Table.tsx`
  - Steps: 使用 next-shadcn-admin-dashboard/设计 token；保持原 props 兼容或实现 adapter
  - Acceptance: 关联页面中组件行为与视觉通过设计验收（点击/提交/焦点）
  - Rollback: 在组件导出处切回旧实现（保留旧组件路径）

- [ ] T101 组件风格一致性检查（P2） — 运行视觉回归或手动验收
  - Acceptance: 与设计差异在可接受范围内；重要页面无布局破坏

## Phase 4: Auth 与 Protected Routes

- [ ] T200 确认鉴权方案与实现（P1） — 实现服务端可验证的会话或 token 流程
  - Files: `lib/auth.ts`, `app/(protected)/middleware.ts`（如使用 Next.js middleware）
  - Acceptance: 在 SSR 页面可读取并验证 session，未登录重定向到 `/login`
  - Rollback: 恢复旧客户端鉴权逻辑并在路由层面禁止新逻辑

## Phase 5: API 适配与 CRUD 页面

- [ ] T300 API adapter 层（P3） — 封装 fetch/axios 以支持 SSR/SSG（server-side fetch）与客户端 fetch
  - Files: `lib/api.ts`, `lib/fetcher.ts`
  - Acceptance: 在 server components 中使用 fetch 获取数据并正确渲染
  - Rollback: 还原为直接调用后端原始接口路径

- [ ] T301 实现示例 CRUD 页面（P3） — 完整实现列表/创建/编辑/删除/详情
  - Files: `app/resources/page.tsx`, `app/resources/[id]/page.tsx`, `app/resources/new/page.tsx`
  - Acceptance: 创建返回 201、编辑保存后变更可见、删除返回 204 且从列表消失
  - Rollback: 使用 feature flag 隐藏新页面或回退到旧页面

## Phase 6: Dashboard 与权限细化

- [ ] T400 Dashboard 基本实现（P2） — 显示统计卡片与列表视图
  - Files: `app/dashboard/page.tsx`, `components/DashboardCard.tsx`
  - Acceptance: 至少 3 个统计卡片显示正确且数据可刷新

## Phase 7: 测试、性能与上线

- [ ] T500 集成测试与 E2E（P1） — 编写 Vitest 单元测试与 Playwright 测试覆盖关键流程
  - Acceptance: CRUD、登录、Dashboard 的端到端测试通过

- [ ] T510 性能验证与上线切换（P1） — 运行 Lighthouse，按策略做灰度切换
  - Acceptance: p95 首屏时间 ≤ 1.5s；灰度期间错误率无异常

## Rollback Examples (示例)

- 路由切换回滚：通过 nginx 或 CDN 配置回退到旧前端地址，或在 feature flag 中禁用新路由。
- 组件回滚：保持旧组件实现路径 `components/legacy/*`，在遇到问题时修改导入指向旧实现。

## Dependencies & Execution Order

- Setup → Foundational → Routing → Components → Auth/API → CRUD → Dashboard → Verification。

## Notes

- 每个破坏性变更（Auth、API 合约变更）必须包含回滚步骤与演练计划。
- 任务中所有文件路径需在实现阶段调整为实际路径。

````
