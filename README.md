# Tech Trends - 技术趋势追踪网站

> 追踪 GitHub 热门项目和 AI 资讯的技术日报网站

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

访问 `http://localhost:3000` 查看网站

---

## 📁 目录结构

```
tech-trends-site/
├── docs/                       # 日报内容目录
│   ├── 2026-02/               # 按月份组织
│   │   ├── 10.md              # 每日日报
│   │   ├── 11.md
│   │   └── 12.md
│   ├── README.md              # 首页预览
│   └── prompt-template.md     # 生成提示词模板
├── src/                       # 源代码
│   ├── components/            # React 组件
│   ├── pages/                 # 页面组件
│   ├── hooks/                 # 自定义 Hooks
│   └── utils/                 # 工具函数
├── public/                    # 静态资源
└── dist/                      # 构建输出
```

---

## ✨ 功能特点

- ✅ **React SPA** - 现代化单页应用
- ✅ **Markdown 驱动** - 简单编辑，实时更新
- ✅ **移动端适配** - 响应式设计，支持手机浏览
- ✅ **打印优化** - 支持打印和导出长图
- ✅ **GitHub Pages** - 一键部署

---

## 🛠️ 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **React Router** - 路由管理
- **React Markdown** - Markdown 渲染
- **html2canvas** - 长图导出

---

## 📝 如何更新内容

### 方式一：编辑 Markdown 文件

直接编辑 `docs/YYYY-MM/DD.md` 文件，保存后刷新网页即可。

### 方式二：使用 AI 生成

参考 `docs/prompt-template.md` 中的提示词模板，让 AI 帮你生成日报内容。

---

## 🚢 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为构建和部署来源
4. 推送代码后会自动构建和部署

或者手动部署：

```bash
npm run build
# 将 dist 目录内容部署到任意静态托管服务
```

---

## 📌 更新日志

### 2026-02-12
- ✨ 重构移动端界面，优化触摸体验
- ✨ 添加底部导航栏
- ✨ 优化表格移动端展示

### 2026-02-10
- ✨ 初始版本发布
- ✨ React SPA 架构
- ✨ 日报展示页面
