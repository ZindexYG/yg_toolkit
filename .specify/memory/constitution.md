<!--
Sync Impact Report

- Version change: unspecified → 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] unspecified → 输出语言与术语统一
	- [PRINCIPLE_2_NAME] unspecified → 技术名词保留英文原名
	- [PRINCIPLE_3_NAME] unspecified → 工程化文档风格
	- [PRINCIPLE_4_NAME] unspecified → 可执行与可验收
	- [PRINCIPLE_5_NAME] unspecified → 迁移优先：可回滚、低风险
- Added sections: 开发流程、治理规则（治理与版本化策略）
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/plan-template.md ✅ updated
	- .specify/templates/spec-template.md ✅ updated
	- .specify/templates/tasks-template.md ✅ updated
	- .specify/templates/commands/*.md ⚠ pending (no command templates found; review references)
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): 原始合宪日期未知，请补充。
	- 验证所有自动化命令引用（如 `/speckit.plan`）指向存在的实现。
	- 若需将合宪检查纳入 CI，请指派对应流水线更新任务。
-->

# yg_toolkit Constitution

## Core Principles

### 1. 输出语言与术语统一
项目范围内所有 Spec、Plan、Tasks、Checklist、Analysis 等文档的默认输出语言为 **简体中文**。
技术名词和项目术语（例如 React、Next.js、Tailwind、Shadcn UI）应保留英文原名，不进行翻译。

理由：统一语言降低沟通成本，保留英文专业名词可减少语义歧义并便于检索与对外协作。

### 2. 技术名词与专有术语保留原名
项目内所有技术名词、框架名、工具名必须使用其英文原名；必要时在首次出现时给出中文括注说明，但文中仍使用英文原名。

理由：确保术语一致，避免翻译造成的混淆，便于与外部文档、依赖项和社区资料对应。

### 3. 工程化、结构化的文档风格
文档撰写应偏向工程化与结构化表达，避免口语化描述。每份规范/计划应包含：摘要、背景、需求、设计方案、验收准则、风险与回滚策略、里程碑。

理由：结构化文档利于审查、追溯与自动化处理，降低误解与实施偏差。

### 4. 可执行与可验收
所有规范必须可执行并具备明确的验收条件（Acceptance Criteria）。每条关键需求应至少对应一条可独立验证的测试场景或验收步骤。

理由：将模糊要求转换为可验证的交付物，提高交付质量并便于审查与回归检测。

### 5. 迁移优先“可回滚、低风险”原则
涉及迁移、升级或潜在破坏性变更时，优先采用可回滚、分阶段、低风险的方案。Plan/Spec 必须包含：回滚步骤、回退条件、风险评估与降级路径。

理由：保障线上稳定性，减少变更带来的业务中断与不可控风险。

## 附加约束
 - 文档风格与术语约束为强制性要求（MUST）；违反需在 PR 中明确标注并说明豁免理由。
 - 所有模板（Spec/Plan/Tasks/Checklist）在生成时必须注入本 Constitution 的合规检查项。

## 开发流程与质量门（示例）
 - 新增或修改 Spec / Plan / Tasks 时需提交 PR，并在 PR 描述中列出与本 Constitution 的对照检查项。
 - 代码变更关联的 Spec/Tasks 必须在合并前通过下列审查：文档合规性检查、测试覆盖与回滚验证。
 - 涉及迁移的变更必须通过实验环境的可回滚演练才能进入生产发布日程。

## Governance
1. 修订流程：任何对 Constitution 的修订须通过提交包含修订说明、影响评估与迁移计划的 Pull Request，至少经由一个技术负责人和一个产品/PO 审核通过。
2. 版本规则：采用语义化版本号 `MAJOR.MINOR.PATCH`。
	 - MAJOR：不向后兼容的治理或原则删除/重定义（需明确迁移路径）。
	 - MINOR：新增原则或扩展现有原则，或新增强制性流程。
	 - PATCH：文字澄清、拼写/格式修正、非语义性细节更新。
3. 合规审查：所有与 Constitution 相关的 PR 应在审查清单中包含：语言检查（简体中文）、术语保留、验收准则、迁移/回滚条目。
4. 合规执行：CI 可择期加入自动化检查以强制语言与模板合规；在未实现自动化时，审查者需人工验证。

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-12-21

