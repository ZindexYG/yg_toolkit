<!--
Sync Impact Report:
- Version change: N/A → 1.0.0
- List of modified principles:
    - [PRINCIPLE_1_NAME] → I. 语言规范 (Language)
    - [PRINCIPLE_2_NAME] → II. 技术名词 (Technical Terms)
    - [PRINCIPLE_3_NAME] → III. 文档风格 (Documentation Style)
    - [PRINCIPLE_4_NAME] → IV. 可执行性 (Enforceability)
    - [PRINCIPLE_5_NAME] → V. 迁移决策 (Migration Strategy)
- Added sections: 技术栈约束 (Tech Stack Constraints), 开发流程 (Development Workflow)
- Removed sections: None
- Templates requiring updates:
    - .specify/templates/plan-template.md (✅ updated)
    - .specify/templates/spec-template.md (✅ updated)
    - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs: None
-->

# studio-admin Constitution

## Core Principles

### I. 语言规范 (Language)
本项目所有 Spec、Plan、Tasks、Checklist、Analysis 的输出语言统一为【简体中文】。

### II. 技术名词 (Technical Terms)
所有技术名词（如 React、Next.js、Tailwind、Shadcn UI）保留英文原名，不做翻译。

### III. 文档风格 (Documentation Style)
文档风格偏工程化、结构化，避免口语化描述。

### IV. 可执行性 (Enforceability)
所有规范必须可执行、可验收，避免模糊表述。

### V. 迁移决策 (Migration Strategy)
迁移相关决策以“可回滚、低风险”为优先级。

## 技术栈约束 (Tech Stack Constraints)
本项目使用以下核心技术栈：
- 框架: Next.js 15+, React 19+
- 样式: Tailwind CSS 4+
- 组件库: Shadcn UI (Radix UI)
- 规范: Biome (Lint/Format)
- 状态管理: Zustand, TanStack Query
- 表单: React Hook Form + Zod

## 开发流程 (Development Workflow)
开发过程必须遵循以下阶段：
1. **Spec**: 定义功能需求与验收标准。
2. **Plan**: 进行技术调研与方案设计。
3. **Tasks**: 拆分可独立测试的任务。
4. **Implementation**: 编码实现并进行自测。

## Governance
宪法高于所有其他实践；修订需要记录、批准并制定迁移计划。所有 PR/评审必须验证合规性。

**Version**: 1.0.0 | **Ratified**: 2025-12-22 | **Last Amended**: 2025-12-22
