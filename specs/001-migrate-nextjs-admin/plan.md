````markdown
# Implementation Plan: 迁移 React 19 → Next.js 16 + Tailwind + next-shadcn-admin-dashboard

**Branch**: `001-migrate-nextjs-admin` | **Date**: 2025-12-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-migrate-nextjs-admin/spec.md`

## Summary

将现有 React 19 前端逐步迁移为 Next.js 16（App Router），并在迁移过程中引入 Tailwind CSS 与 next-shadcn-admin-dashboard 模板，目标实现 SSR/SSG 支持、全局 layout、Shadcn UI 组件整合、登录/权限、以及至少一组 CRUD 页面。迁移遵循“分阶段、可回滚、低风险”原则。

## Technical Context

**Language/Version**: TypeScript + React (源项目 React 19，目标 Next.js 16)
**Primary Dependencies**: Next.js 16, Tailwind CSS, next-shadcn-admin-dashboard, Shadcn UI, react-hook-form (或同类), axios/fetch
**Storage**: N/A（前端不直接存储，依赖后端 API；如需本地持久化使用 localStorage/IndexedDB）
**Testing**: 建议使用 Vitest（单元）+ Playwright（端到端），但测试框架待确认（NEEDS CLARIFICATION）
**Target Platform**: Node.js 18+ 环境部署；浏览器端主流现代浏览器
**Project Type**: 单一前端仓库（迁移到 Next.js App Router 下的 `app/` 结构）
**Performance Goals**: p95 首屏渲染时间 ≤ 1.5s（staging，可比网络条件）
**Constraints**: 不主动改动后端 API 合约；优先保证 URL 兼容性；迁移采用 feature flag 分阶段切换
**Unknowns / NEEDS CLARIFICATION**:
- 鉴权方案（NextAuth / 后端会话 / JWT） — 影响 SSR 会话读取与回滚策略
- 是否将 API handler 迁移到 Next.js route handlers 或保持独立后端
- CI/CD 与部署目标环境（是否可同时部署新旧前端以做流量切换）

## Constitution Check

已核对 Constitution 要求：

- 文档语言：简体中文（已满足）
- 技术名词保留英文（已满足）
- 可验收性：Plan 与 Tasks 包含验收条件（见下文）
- 迁移风险：每个破坏性步骤要求回滚方案（见 Tasks 中的 rollback 条目）

（Phase 0 完成后请在 PR 中标注上述项的最终决定或豁免说明）

## Project Structure (迁移后建议)

```text
app/                      # Next.js App Router 源码入口
  layout.tsx               # 全局 layout（头部、侧边栏、content）
  page.tsx                 # 首页/路由示例
  dashboard/               # 仪表盘页面组
components/               # shadcn/自定义组件（Button、Card、Input、Table 等）
styles/
  globals.css              # Tailwind 引入与全局样式重置
tailwind.config.js
postcss.config.js
next.config.js
public/
```

## Structure Decision

选用单一前端仓库方式：将现有 `src/` 中 UI 与页面迁移到 `app/`，组件集中放入 `components/`，样式统一使用 Tailwind（`styles/globals.css` + preflight）。这样便于利用 Next.js 的 SSR/SSG 与中间件功能，同时保持同一仓库的可回滚能力。

## Phase Breakdown

Phase 0 — 验证与准备（Research）
- 确认鉴权方案与 API 部署模型（NEEDS CLARIFICATION）
- 建立迁移分支 `001-migrate-nextjs-admin`（已完成）
- 在本地搭建最小 Next.js 16 + Tailwind + next-shadcn-admin-dashboard 示例项目，验证模板兼容性与构建流程

Gate: 必须确认鉴权方案或记录明确假设后方可进入 Phase 1

Phase 1 — 基础设施与全局改造
- 初始化 Next.js 项目结构（`app/`、`next.config.js`）
- 集成 Tailwind（`tailwind.config.js`、`globals.css`）并在全局 layout 中引入
- 配置基本 CI 构建步骤以验证构建与 lint

Deliverable: staging 可启动的 Next.js 架构（无业务切换）

Phase 2 — 路由重构与样式迁移（低风险切换）
- 将首页与仪表盘迁移到 `app/`，使用 SSR/SSG 测试首屏渲染
- 在 `app/layout.tsx` 中实现全局 layout，并实现 feature flag 路由分流以便回滚
- 完成 Tailwind 全局样式替换（preflight + 基础样式）

Deliverable: `/` 与 `/dashboard` 在 staging 可通过新架构访问，且可通过 feature flag 切回旧架构

Phase 3 — 组件迁移与 Shadcn 整合
- 分批替换基础组件（Button、Card、Input、Table），每批次 1-2 个组件
- 保证组件 API 向后兼容或通过 adapter 层提供兼容实现

Deliverable: 若干页面使用新组件集且验收通过

Phase 4 — Auth、API 适配与 CRUD 页面
- 根据已确认的鉴权方案实现 server-side 验证支持（在 SSR 中安全获取会话）
- 适配前端数据层以支持 App Router 的 data fetching（server components / route handlers / fetch）
- 实现至少一个完整 CRUD 页面并通过集成测试

Deliverable: 可登录用户完成 CRUD 流程，受保护路由生效

Phase 5 — 验证、性能与上线切换
- 运行集成测试、端到端测试（Playwright）与 Lighthouse 性能/可访问性报告
- 在非高峰窗口进行灰度/流量切换，监控关键指标（错误率、响应时延、首屏时间）
- 若指标达标，进行正式流量切换并下线旧实现

## Complexity Tracking

如存在违反 Constitution 的情形（例如需对后端进行破坏性改动），须在本节列明并提供简化替代方案。当前 Plan 假定后端合约不变，以降低复杂度。

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 迁移鉴权到 NextAuth | 提升 SSR 安全性与开发一致性 | 需改动后端会话，风险高；暂不采用（除非明确要求） |

## Next Steps

1. 确认 `NEEDS CLARIFICATION` 项（鉴权方案、API 部署模型、测试栈）。
2. 若同意默认假设，开始 Phase 0 的模板兼容验证与 Phase 1 初始化工作。
3. 我可以继续生成 `tasks.md`（待生成）并拆解为可执行任务。

````
