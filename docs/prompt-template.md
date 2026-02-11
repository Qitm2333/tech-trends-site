# Tech Trends 日报生成提示词

## 任务
更新当日的技术日报（`docs/YYYY-MM/DD.md`）和首页预览（`docs/README.md`）。

---

## 核心原则

**不要假设已有内容完整。每次更新都必须重新验证当日所有重要新闻。**

---

## 信息获取流程

### 第一步：系统性搜索（关键！）

不要仅依赖资讯站点浏览，必须执行针对性搜索：

```
搜索查询模板：
1. "{厂商名} 发布 2026年{MM}月{DD}日" - 逐个搜索必查厂商
2. "AI大模型 最新发布 2026年{MM}月{DD}日" 
3. "GitHub Trending 热门项目 2026年2月"
4. "机器之心 量子位 AI新闻 {MM}月{DD}日"
```

### 第二步：必查厂商逐一验证

**必须逐个搜索验证**，不能仅浏览资讯站点：

| 优先级 | 国内厂商 | 国际厂商 |
|--------|----------|----------|
| P0 | 智谱/GLM、DeepSeek、阿里千问 | OpenAI、Anthropic/Claude |
| P1 | 字节跳动/豆包、月之暗面/Kimi | Google/Gemini、Meta/Llama |
| P2 | 科大讯飞、面壁智能、MiniMax | xAI/Grok |
| P3 | 阶跃星辰、原力灵机、生数科技 | |

**验证动作**：对每个厂商执行搜索，确认24小时内是否有新发布

### 第三步：核心资讯源交叉验证

1. **机器之心** (jiqizhixin.com)
2. **量子位** (qbitai.com)
3. **Hacker News** (news.ycombinator.com)

### 第四步：GitHub Trending

访问 https://github.com/trending 获取今日热门项目Top 10

---

## 重要性判断标准

发现新闻后，立即按以下标准评估：

| 等级 | 判断标准 | 处理方式 |
|------|----------|----------|
| 🔴 **头条** | 开源SOTA、硬刚国际顶尖模型、神秘模型揭晓、股价波动>30% | 重大发布卡片 + 首页头条 |
| 🟠 **重要** | 头部厂商核心产品更新、重大开源、技术突破 | 重大发布卡片 |
| 🟡 **普通** | 行业动态、合作消息、应用落地 | 行业动态卡片 |

**关键词触发器**：
- "开源SOTA"、"超越GPT"、"硬刚Claude" → 立即头条
- "神秘模型"、"真身揭晓" → 立即头条
- "股价大涨"、"市值飙升" → 重要
- "首次"、"首个"、"业界首个" → 重要

---

## 检索范围

### 必查产品类别
- **视频生成**：Seedance、Sora、Runway、Pika、可灵
- **图像生成**：Midjourney、DALL-E、Stable Diffusion、Seedream、Imagen
- **编程助手**：Copilot、Cursor、ClaudeCode
- **AI搜索**：Perplexity、秘塔AI
- **端侧模型**：MiniCPM、Llama.cpp、本地部署相关

⚠️ **注意**：同一厂商可能有多个相似产品（如字节Seedance视频、Seedream图像）

---

## 输出格式

### 1. 日报文件 `docs/YYYY-MM/DD.md`

#### 头部信息
```markdown
# YYYY年MM月DD日 技术日报
<p class="daily-meta">YYYY-MM-DD | 热度指数: XX | 主导趋势: XXX</p>
```

#### 今日概览
统计卡片：GitHub Top数量、AI新闻数量、热度指数、趋势状态

#### GitHub 热门项目
**Top 10 表格**（使用 HTML 表格格式，便于移动端适配）：

```html
<table class="top10-table">
<thead>
<tr><th>排名</th><th>项目</th><th>Stars</th><th>语言</th><th>亮点</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>**项目名**</td><td>XXK</td><td>语言</td><td>一句话亮点</td></tr>
<tr><td>2</td><td>**项目名**</td><td>XXK</td><td>语言</td><td>一句话亮点</td></tr>
<!-- ... 共10条 -->
</tbody>
</table>
```

**项目详解卡片**（每个项目必须包含完整结构）：

```markdown
#### #N 项目名称 - 一句话描述

<div class="project-card">
  <div class="project-card-header">
    <h4>项目名称 - 一句话描述</h4>
    <span class="project-card-toggle">▼</span>
  </div>
  <div class="project-card-basic">
    <span class="tag tag-primary">语言/标签</span>
    <span class="tag tag-ai">AI</span>
    <span>⭐ X.XK (+增长)</span>
  </div>
  <div class="project-card-content">

**项目简介**

2-3 句话描述项目核心功能和价值。

**技术架构**

- **核心模块**: 描述
- **技术特点**: 描述
- **创新点**: 描述

**关键数据**

- Stars: X.XK (+X 今日)
- 语言: XXX (XX%)
- 许可证: XXX

**核心能力**

- 能力1
- 能力2
- 能力3

**市场影响**

分析该项目对行业的影响和价值。

  </div>
</div>
```

#### AI 最新动态
**重大发布**（使用 `<div class="news-card priority-high">`）：
- 事件概要（2-3句话）
- 技术突破/核心亮点（3-5条）
- 影响分析（表格：维度、影响、程度）
- 专家观点/市场反应

**行业动态**（使用 `<div class="news-card">`）：普通新闻

#### 深度洞察
- 今日主题
- 现象观察
- 技术演进路径（代码块）
- 竞争格局分析（使用 HTML 表格格式）：

```html
<table class="analysis-table">
<thead>
<tr><th>厂商</th><th>代表产品</th><th>优势领域</th><th>今日动态</th></tr>
</thead>
<tbody>
<tr><td>厂商名</td><td>产品名</td><td>优势描述</td><td>今日动态</td></tr>
<!-- ... 更多厂商 -->
</tbody>
</table>
```

- 明日预测

#### 页脚
更新时间、数据来源、编辑信息

---

### 2. README.md 首页预览更新

**今日概览标签**：
```markdown
<span class="tag tag-ai">趋势1</span> <span class="tag tag-primary">趋势2</span>
```

**今日AI动态**（5-8条，按重要性排序）：
```markdown
- **新闻标题** — 一句话描述
```

---

## 质量检查清单

### 信息收集阶段
- [ ] 已逐个搜索所有P0/P1必查厂商
- [ ] 已访问机器之心/量子位/HN至少2个站点
- [ ] 已检查GitHub Trending

### 内容编写阶段
- [ ] 所有头条/重要新闻已识别并标注
- [ ] 每条新闻都有具体日期和可靠来源
- [ ] 竞争格局分析表格已更新（包含今日有动态的厂商）

### 格式检查阶段
- [ ] GitHub Top 10 使用 `<table class="top10-table">` HTML 格式
- [ ] 竞争格局分析使用 `<table class="analysis-table">` HTML 格式
- [ ] 重大发布使用了 `priority-high` 标记
- [ ] README.md 今日动态和标签已同步更新

### 最终验证阶段
- [ ] 新闻总数统计正确
- [ ] 首页概览标签反映今日主导趋势
- [ ] 更新时间已更新为当前时间

---

## 常见错误预防

**错误1：假设已有内容完整**
→ 每次更新前重新执行完整搜索流程

**错误2：遗漏头部厂商动态**
→ 必须逐个搜索验证，不能仅浏览资讯站点

**错误3：重要性判断失误**
→ 使用重要性判断标准表格，关键词触发立即升级

**错误4：竞争格局表格过时**
→ 每添加一条厂商新闻，立即更新竞争格局表格

---

**输入**：请更新 YYYY年MM月DD日 的技术日报
