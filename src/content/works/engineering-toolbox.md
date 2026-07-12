---
title:
  zh: "工程计算工具箱"
  en: "Engineering Calculator Toolbox"
description:
  zh: "面向工程人员的 HarmonyOS 本地计算应用，把高频工程初算拆成 50 个可搜索、可复核的工具模块，让移动端计算不只给出结果，也能说明结果从何而来。"
  en: "A HarmonyOS native calculation app for engineers, splitting 50 frequently-used engineering calculations into searchable, reviewable modules — so mobile calculations give not just results, but traceable process."
tags: ["ArkTS", "ArkUI", "HarmonyOS", "API 23", "Stage Model", "Hypium", "DevEco Studio"]
featured: true
date: "2026-05-20"
thumbnail: "/images/toolbox-home.jpg"
demo_url: ""
github_url: ""
gallery:
  - src: "/images/toolbox-home.jpg"
    caption:
      zh: "首页：7 类工程工具的目录化发现体验"
      en: "Home: catalog-based discovery of 7 engineering modules"
  - src: "/images/toolbox-unit-conversion.jpg"
    caption:
      zh: "单位换算：结果、SI 值与公式追踪"
      en: "Unit conversion: result, SI value and formula trace"
  - src: "/images/toolbox-material-property.jpg"
    caption:
      zh: "介质属性查询：按温度或温度-浓度插值查询关键参数"
      en: "Material property query: interpolate by temperature or concentration"
  - src: "/images/toolbox-concentration.jpg"
    caption:
      zh: "溶液浓度换算：多种工程浓度单位互转"
      en: "Solution concentration conversion: multiple engineering units"
  - src: "/images/toolbox-ph.jpg"
    caption:
      zh: "pH 计算：工程警告与计算模式说明"
      en: "pH calculation: engineering warning and calculation mode"
  - src: "/images/toolbox-pressure-drop.jpg"
    caption:
      zh: "管道压降：含公式追踪与数据来源标注"
      en: "Pipe pressure drop: formula trace and data source labeling"
highlights:
  zh:
    - "50 个工程计算工具"
    - "7 大专业模块"
    - "结果可追溯：公式追踪 + 工程警告"
    - "本地优先：无账号、无云同步"
    - "50/50 真机入口路由验证通过"
  en:
    - "50 Engineering Calculation Tools"
    - "7 Professional Modules"
    - "Traceable Results with Formula & Warnings"
    - "Local-First: No Account, No Cloud Sync"
    - "50/50 Device Route Smoke Test Passed"
---

## 项目背景 / Background

工程现场和设计复核中，经常需要处理单位换算、浓度换算、管道压降、泵功率、传热等高频初算。这些计算分散在表格、手册和经验公式中，查找和复核路径长；而且移动端计算往往只给结果，缺少单位、假设和过程说明，容易误用。

工程计算工具箱是一款基于 **ArkTS** 与 **ArkUI** 开发的 **HarmonyOS 原生应用**。项目采用“纯计算领域层 + ArkUI 展示层 + 本地状态层”的分层架构，把 50 个高频工程初算封装成可搜索、可复核的移动端工具。每个工具统一输出主结果、辅助 SI 值、公式追踪、工程假设与风险提示，让移动端计算也能说明“结果从何而来”。

On-site engineering and design review frequently involve unit conversion, concentration conversion, pipe pressure drop, pump power, heat transfer, and other quick calculations. These are scattered across spreadsheets, handbooks, and empirical formulas, making lookup and review time-consuming. Mobile calculations often provide only the result, missing units, assumptions, and process details — increasing misuse risk.

Engineering Calculator Toolbox is a native **HarmonyOS** app built with **ArkTS** and **ArkUI**. It adopts a layered architecture of “pure calculation domain layer + ArkUI presentation layer + local state layer,” packaging 50 frequent engineering calculations into searchable, reviewable mobile tools. Each tool consistently outputs the primary result, auxiliary SI value, formula trace, engineering assumptions, and risk warnings, so mobile calculations can also show “where the result comes from.”

## 核心功能 / Core Features

| 模块 | 工具数 | 代表能力 |
|------|--------|----------|
| 基础与数据 | 7 | 单位换算、浓度换算、介质属性查询、管道规格速查、气体密度计算、溶液配制计算、pH 计算 |
| 流体输送 | 11 | 管径计算、雷诺数、管道压降、局部阻力、水力坡度、水锤压力、串并联管道 |
| 泵与风机 | 7 | 泵功率选择、泵扬程计算、NPSHa 汽蚀余量、泵相似定律、风机功率、汽蚀余量校核 |
| 容器与储罐 | 5 | 立罐体积、卧罐液位体积、球罐体积、矩形容器、储罐壁厚 |
| 阀门与调节 | 5 | 调节阀 Cv 计算、气体阻塞流判断、孔板流量计算、安全阀泄放面积、减压阀计算 |
| 传热计算 | 11 | 热传导、对流换热、换热器面积、LMTD、NTU、保温层厚度、热损失、辐射换热 |
| 蒸汽系统 | 4 | 饱和蒸汽性质、过热蒸汽性质、蒸汽耗量、冷凝水量 |

**产品与交互亮点：**

- **可追溯结果**：统一结果卡片展示主要结果、辅助 SI 值、公式追踪与警告信息
- **工程边界提示**：输入异常、适用范围、数据来源状态和典型风险不被静默忽略
- **高效检索**：首页支持搜索、按模块折叠/展开与最近使用入口
- **本地优先**：使用 HarmonyOS Preferences 持久化免责声明、最近使用、收藏和计算历史，不依赖账号或云同步
- **统一设计系统**：共享输入控件、结果卡片、警告横幅、公式追踪和按钮，保证 50 个工具页体验一致
- **隐私克制**：不包含广告、支付、定位、相机、麦克风、通讯录、文件上传或云同步

## 技术架构 / Tech Architecture

```text
ArkUI 页面层
  └─ AppShell（首页 / 历史 / 收藏 / 我的）与 50 个工具页
       └─ 共享组件：UnitInput、ResultCard、FormulaTrace、WarningBanner、ActionButton

领域计算层
  └─ 每个工具统一实现 defaultInput / validate / calculate / format
       └─ 输出原始输入、标准化输入、假设、公式追踪、结果、警告与时间

本地状态层
  └─ AppStateStore + HarmonyOS Preferences
       └─ 免责声明、最近使用、收藏、计算历史
```

- **ArkTS** / **ArkUI**：HarmonyOS 原生声明式 UI 与类型化脚本
- **HarmonyOS Stage Model**：应用生命周期与窗口模型
- **HarmonyOS API 23**：能力版本基线
- **DevEco Studio 6.1** / **Hvigor 6.24.3**：开发工具与构建系统
- **Hypium**：自动化测试框架

## 我负责的部分 / My Role

独立设计与开发，覆盖：
- 产品定义、工程模块拆分与工具清单设计
- ArkUI 应用架构与导航、首页、历史、收藏、我的等核心页面
- 50 个工具的领域计算层与界面展示层（defaultInput / validate / calculate / format）
- 共享 UI 组件：UnitInput、ResultCard、FormulaTrace、WarningBanner、ActionButton
- 本地状态层：使用 HarmonyOS Preferences 保存免责声明、最近使用、收藏和计算历史
- 工程参考数据整理与验证状态标注
- 静态审计、50 工具覆盖审计、真机 HDC 路由冒烟与 Hypium 回归测试

## 技术亮点 / Technical Highlights

- **领域层与 UI 层解耦**：每个计算器独立提供默认输入、校验、计算和格式化接口，便于单独测试和逐项扩展
- **公式追踪与工程警告**：不静默忽略适用范围、数据来源和典型风险，结果页明确展示计算假设
- **本地优先**：无账号、无云同步，所有数据使用 HarmonyOS Preferences 本地持久化
- **统一设计系统**：共享输入、结果卡片、警告横幅和公式追踪，保证 50 个工具体验一致
- **隐私克制**：不请求广告、支付、定位、相机、麦克风、通讯录等敏感权限
- **工程数据验证边界**：参考数据保留来源与验证状态，未确认数据不包装成“已验证标准”

## 质量验证 / Quality & Verification

- **编译与打包**：已通过 API 23 ArkTS 编译、HAP 打包签名与静态覆盖检查
- **静态审计**：52 个 `ohosTest` 测试源文件覆盖核心功能
- **真机路由冒烟**：50/50 个工具可通过搜索进入对应页面，入口可达性已验证
- **回归测试**：Hypium 回归报告未记录断言失败
- **发布状态**：已完成可安装调试包验证；AppGallery 正式上架仍需补齐 release 签名、公开隐私政策 URL 与商店发布证据

## 展示边界 / Display Boundaries

- 不表述为“已在 AppGallery 上架”或“正式发布”，因为 release 签名、隐私政策 URL 和商店提交闭环仍待完成
- 不表述为“可替代正式工程设计或专业校审”，本应用定位为工程初算与复核参考
- 不将 50/50 真机路由冒烟描述为 50 个公式均完成现场工况验证，它仅证明页面入口可达
