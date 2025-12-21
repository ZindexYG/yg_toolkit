# Feature Specification: 迁移 React 19 → Next.js 16 + Tailwind + next-shadcn-admin-dashboard

**Feature Branch**: `001-migrate-nextjs-admin`
**Created**: 2025-12-21
**Status**: Draft
**Input**: 用户描述："迁移 React 19 项目到 Next.js 16 + Tailwind CSS + next-shadcn-admin-dashboard 模板。目标是 AppRouter 架构、SSR/SSG 支持、全局 layout、Tailwind 配置、Shadcn UI 组件整合、登陆/权限、CRUD 页面。不要生成最终代码，现在只生成规范文档，包括每个要实现的功能点和验收条件。"

**Constitution Compliance**：

- 文档输出语言为 **简体中文**。
- 技术名词保留英文原名（React、Next.js、Tailwind、Shadcn UI、AppRouter 等）。
- 需求与验收准则须明确、可测试、可量化。
- 涉及迁移或破坏性变更时，Spec 必须包含回滚方案与低风险评估（见每个主要项下的风险与回滚）。

## 概要与目标

将现有 React 19 前端迁移到 Next.js 16，目标达到：

- 使用 App Router 架构并支持 SSR/SSG（按页面分层决定渲染策略）。
- 全局 layout 与嵌套路由迁移，保留原有导航与侧边栏逻辑。
- 引入 Tailwind CSS 并完成全局样式重置与配置。
- 将 UI 组件逐步替换/整合为 Shadcn UI 风格组件集（使用 next-shadcn-admin-dashboard 模板为基底）。
- 实现登录/权限中台（最小可用版本），保证受保护页面的服务端/客户端鉴权。
- 迁移/重构必要的 API 调用以支持 SSR/SSG 与 App Router 数据加载，完成至少一组 CRUD 页面迁移。

迁移原则：分阶段、可回滚、最小破坏（先实现非破坏性功能→逐步切换路由/渲染策略→最终下线旧实现）。

## 关键概念 (Actors / Actions / Data / Constraints)

- Actors：End user（普通用户/管理员）、Authenticated session（登录用户）、Developer（迁移工程师）。
- Actions：访问页面、登录登出、访问受保护资源、进行 CRUD 操作、查看 Dashboard 数据。
- Data：User（用户）、Session（会话/权限）、Resource（需迁移的业务实体，用于 CRUD）、DashboardMetrics（统计数据）。
- Constraints：不改变后端 API 合约（如非必要），优先采用 SSR/SSG 支持并保证可回滚；保持现有 URL 兼容性优先（除必要调整外）。

## 不确定项（需确认，最多 3 项）

- [NEEDS CLARIFICATION-1] 认证与授权方案：采用 NextAuth（或同类 SSO）、自研 JWT、还是复用现有后端会话？
  - 影响范围：鉴权实现、服务端渲染时的会话获取、Cookie/Token 策略、回滚复杂度。

- [NEEDS CLARIFICATION-2] 后端 API 部署模型：是否将 API handler 迁移到 Next.js route handlers（在同一仓库内部署），或继续保留独立后端服务并通过外部请求访问？
  - 影响范围：SSR/SSG 数据预取、开发/部署流程、请求延迟与安全边界。

（如未在 2 个工作日内确认，将假定：使用现有后端服务保持 API 合约不变，且在前端使用基于 HTTP 的服务端数据获取；认证采用现有后端 session 验证并在必要时以 token 方式支持 SSR。）

## User Scenarios & Testing

### User Story P1 - 应用路由与全局 Layout（Priority: P1）

目标：将核心页面迁移到 Next.js App Router，建立全局 Layout（含头部、侧边栏、面包屑），并确保首页/仪表盘首屏支持 SSR/SSG。

Why：为后续组件集成与 SSR/SSG 能力奠定框架，保证 SEO 与首屏渲染性能。

Independent Test：在迁移分支上访问首页与仪表盘页面（未登录/已登录），验证首屏可见内容由服务器渲染或静态生成。

Acceptance Scenarios：

1. Given: 迁移分支部署在 staging，When: 访问 `/`（首页），Then: 页面返回 HTML 包含关键内容（title、主要卡片），且首屏渲染时间可测（见 Success Criteria）。
2. Given: 已登录用户访问受保护页面 `/dashboard`，When: 服务端验证会话成功，Then: 页面返回用户专属内容且 HTTP 响应状态 200；若未登录，则重定向至登录页。

风险与回滚：若 SSR 会话无法正确解析，回滚策略为切回旧版前端路由（feature flag 或反向代理规则），并在 24 小时内恢复旧配置。

---

### User Story P1a - Tailwind 全局配置与样式重置（Priority: P1）

目标：初始化 Tailwind 配置（含 base、components、utilities），并在全局 layout 中应用样式重置（包含 preflight）。

Independent Test：编译并运行 dev/build，确认 Tailwind 样式生效；关键页面在不同屏幕尺寸渲染符合设计基线。

Acceptance Scenarios：

1. Given: 本地 dev 环境，When: 启动应用并打开 `/`，Then: 页面使用 Tailwind 样式（关键 class 可在 DOM 中查到），且无全局样式冲突导致 UI 崩溃。

风险与回滚：若样式冲突严重，回滚为禁用 Tailwind 变更并恢复到项目原有全局样式文件，保证时间窗口内恢复视觉稳定。

---

### User Story P2 - Shadcn UI 组件整合与组件迁移（Priority: P2）

目标：将公共 UI 组件逐步迁移为 Shadcn UI 风格（使用 next-shadcn-admin-dashboard 模板样式），并保留与现有行为兼容的 API（props/事件）。

Independent Test：在样式库替换单个组件（如 `Button`、`Card`）后，运行单页面验证交互一致性与视觉一致性。

Acceptance Scenarios：

1. Given: 在迁移分支，When: 访问包含迁移组件的页面，Then: 组件渲染正确，交互（点击、焦点）与原实现一致；视觉偏差在可接受范围内（由设计验收）。

风险与回滚：组件迁移分小步实施（每次 1-2 个组件），若出现破坏性问题，回滚单个组件到旧实现。

---

### User Story P2b - Dashboard 基本页面（Priority: P2）

目标：基于模板实现 dashboard 首页，包含：统计卡片、列表视图（部分数据来自 API）、导航与权限控制。

Independent Test：在 staging 环境以已登录用户访问 `/dashboard`，验证所需 API 返回并显示关键统计数据。

Acceptance Scenarios：

1. Given: 已登录管理员，When: 打开 `/dashboard`，Then: 显示不少于 3 个统计卡片（例如：用户数、活动数、最近错误数），且数据可刷新。
2. Given: 非管理员用户，When: 访问 `/admin-only`，Then: 显示 403 或重定向到无权限页面。

---

### User Story P3 - API 与 CRUD 页面迁移（Priority: P3）

目标：重构/适配前端对后端 API 的调用以支持 App Router 的 server-side 数据获取，并实现至少一个完整的 CRUD 页面（列表、创建、编辑、删除、详情）。

Independent Test：对目标 Resource（例如 `Article` 或业务指定实体）执行完整 CRUD 流程，验证数据一致性与错误处理。

Acceptance Scenarios：

1. Given: 有效用户与权限，When: 在 `/resources/new` 提交创建表单，Then: 后端返回 201 并在列表页面看到新记录。
2. Given: 在列表页选择某条记录并进入编辑，When: 修改并保存，Then: 刷新后展示修改后的数据。
3. Given: 有删除权限，When: 删除记录，Then: 列表中不再出现该记录，且后端返回 204。

风险与回滚：若后端合约不兼容，优先采用前端 adapter 层兼容旧合约，避免同时改动后端与前端；若无法兼容，回滚为恢复旧前端对旧 API 的调用路径。

## Edge Cases

- SSR 情况下 Cookie/Token 无法读取：需要回滚到仅客户端渲染的页面并记录具体请求场景。
- 大量并发请求导致 SSR 超时：定义超时/降级策略（展示缓存或占位内容）并在 plan 中指定监控阈值。
- 权限边界变更导致页面漏授权：立即下线相关页面并回滚路由配置。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Routing & Layout)**: 系统 MUST 将核心路由迁移到 Next.js App Router，并在 `app/` 中建立可复用的全局 layout（头部、侧边栏、内容区、面包屑）。
  - 验收：`/` 与 `/dashboard` 在 server-render 或静态生成下返回含关键 DOM 内容的 HTML（见 Acceptance Scenarios）。

- **FR-002 (Tailwind)**: 系统 MUST 集成 Tailwind CSS，包含 `tailwind.config.js` 与全局样式入口（preflight/基础样式）。
  - 验收：构建成功且关键页面样式呈现正确，Tailwind class 在 DOM 中可见。

- **FR-003 (Shadcn UI)**: 系统 MUST 将公共 UI 组件迁移或封装为 Shadcn 风格组件集，且保持原有组件 API 的最小兼容性。
  - 验收：至少迁移 `Button`、`Card`、`Input`、`Table` 四个基础组件，并在页面中通过 `props` 行为验证兼容性。

- **FR-004 (Auth & Protected Routes)**: 系统 MUST 支持服务端与客户端的鉴权检查，保护需要权限的路由（登录后可访问，未登录重定向）。
  - 验收：[NEEDS CLARIFICATION-1] 确认鉴权方案后，提供具体验收步骤（例如：登录后 cookie/token 在服务端可验证）。

- **FR-005 (SSR/SSG data fetching)**: 系统 MUST 在需要的页面支持 server-side 数据获取（SSR/SSG），并保证在 SSR 情况下不会泄露敏感信息。
  - 验收：在 staging 环境，使用 server-render 的页面返回的数据与客户端 fetch 一致且敏感字段受到保护。

- **FR-006 (API Compatibility / CRUD)**: 系统 MUST 适配或重构前端 API 调用以支持 App Router 的 data loading, 并实现至少一个完整 CRUD 页面。
  - 验收：CRUD 流程通过（见 User Story P3 Acceptance Scenarios）。

- **FR-007 (Rollback & Migration Plan)**: 每个破坏性步骤 MUST 提供回滚步骤、影响范围与回滚自动化命令（若可用）。
  - 验收：在迁移任务中包含明确的回滚命令或切换旗标（feature flag）示例。

### Key Entities

- **User**: { id, name, email, roles } — 用于鉴权与权限判断。
- **Session**: { token/cookie, expiresAt, userId } — 服务端/客户端会话表示。
- **Resource**: { id, title, content, createdAt, updatedAt } — 示例业务实体，用于 CRUD 验证。
- **DashboardMetrics**: { usersCount, activeCount, errorCount } — 仪表盘展示的数据。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 首页与 Dashboard 首屏（首个可见内容）在 staging 环境的 p95 首屏渲染时间 ≤ 1.5s（在可比网络条件下）。
- **SC-002**: 登录鉴权成功率 ≥ 99%（在功能测试用例中，100 次登录尝试中成功认证 >= 99 次）。
- **SC-003**: CRUD 页面关键流程通过率 100%（在自动化集成测试套件中，创建/编辑/删除/列表操作全部通过）。
- **SC-004**: 迁移后页面在 Lighthouse 基础可访问性评分不低于迁移前水平（或达成提升）。
- **SC-005**: 所有模板更新与规范均符合 Constitution（文档为简体中文、技术名词保留英文原名、包含回滚规划）。

## 交付物（最小集）

- `specs/001-migrate-nextjs-admin/spec.md`（本文件）
- `specs/001-migrate-nextjs-admin/plan.md`（迁移分阶段计划，包含回滚步骤）
- 迁移分支：`001-migrate-nextjs-admin`

## 备注与假设

- 假设：后端 API 合约在短期内保持稳定；若后端合约变更需另行协调并更新本 Spec。
- 若未明确认证方案或后端部署模型，将按“最小破坏原则”先保留现有后端认证与 API 调用方式，仅在前端引入兼容层。

---

请确认上述 `NEEDS CLARIFICATION` 项（鉴权方案、API 部署模型），或指示我根据默认假设继续将此 Spec 转化为详细迁移 Plan 与 Tasks。
