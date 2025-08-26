# TanGo - 现代化语言学习应用

> 一个基于 React + TypeScript 的智能化移动端语言学习应用，专注于卡片式学习体验和个性化学习进度管理。

## 📖 项目简介

TanGo 是一款语言学习应用，通过卡片式学习模式帮助用户高效掌握外语词汇。应用支持自定义词包导入、智能学习进度追踪，以及直观的交互体验。

### ✨ 主要特性
- 熟练度管理
- Excel 词包导入支持
- 基于 IndexedDB 的本地存储

> 📋 详细的产品功能说明请查看 [PRODUCT.md](./PRODUCT.md)

## 🛠 技术架构

### 核心技术栈

| 技术 | 版本 | 用途 |
|-----|------|-----|
| **React** | 19.1.0 | 前端框架，组件化开发 |
| **TypeScript** | 5.8.3 | 类型安全，代码质量保障 |
| **Vite** | 6.3.5 | 构建工具，快速开发体验 |
| **Tailwind CSS** | 4.1.8 | 原子化CSS，快速样式开发 |
| **Framer Motion** | 12.15.0 | 动画库，丰富交互效果 |
| **Zustand** | 5.0.5 | 状态管理，轻量级方案 |
| **IndexedDB (IDB)** | 8.0.3 | 本地数据存储 |


### 项目结构

```
src/
├── components/             # 通用组件库
│   ├── Button.tsx          # 按钮组件
│   ├── Card.tsx            # 卡片组件
│   ├── Modal.tsx           # 模态框组件
│   ├── ProficiencySlider.tsx # 熟练度滑块
│   └── ...
├── pages/                  # 页面组件
│   ├── practice/           # 练习页面
│   ├── profile/            # 个人中心
│   ├── wordpack/ # 词包管理
│   ├── recommended-packs/  # 词包库
|   └── settings/           # 设置
├── services/               # 业务服务层
│   ├── wordPackService.ts  # 词包服务
│   ├── practiceService.ts  # 练习服务
│   └── vocabularyService.ts # 词汇服务
├── schemas/                # 数据模型定义
│   ├── wordPackSchema.ts   # 词包数据模式
│   ├── vocabularySchema.ts # 词汇数据模式
│   └── practiceSchema.ts   # 练习记录模式
├── stores/                 # 状态管理
├── hooks/                  # 自定义Hook
├── utils/                  # 工具函数
└── types/                  # TypeScript类型定义
```

### 数据存储架构

基于 IndexedDB 的本地存储方案，包含以下数据表：

#### 词包表 (wordPacks)
```typescript
interface WordPackEntity {
  id: number              // 自增主键
  name: string           // 词包名称
  createdAt: string      // 创建时间
  updatedAt: string      // 更新时间
  cardPacks: CardPackEntity[] // 关联卡包
}
```

#### 卡包表 (cardPacks)
```typescript
interface CardPackEntity {
  id: number              // 自增主键
  wordPackId: number      // 词包ID（外键）
  name: string           // 卡包名称
  createdAt: string      // 创建时间
  updatedAt: string      // 更新时间
}
```

#### 词汇表 (vocabularies)
```typescript
interface VocabularyEntity {
  id: number              // 自增主键
  cardPackId: number      // 卡包ID（外键）
  phonetic?: string       // 音标/假名
  word: string           // 写法
  definition: string     // 释义
  example?: string       // 例句
  wordAudio?: string     // 词汇音频
  exampleAudio?: string  // 例句音频
  createdAt: string      // 创建时间
  updatedAt: string      // 更新时间
}
```

#### 练习表 (practices)
```typescript
interface PracticeEntity {
  id: number              // 自增主键
  vocabularyId: number    // 词汇ID（外键）
  practiceCount: number   // 练习次数
  proficiency: number     // 熟练度 (1-100)
  lastPracticeTime: string // 最近练习时间
  createdAt: string      // 创建时间
  updatedAt: string      // 更新时间
}
```

## 🔧 开发指南

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/sone47/tango.git
   cd tango
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm run dev
   ```

4. **在浏览器中访问**
   ```
   http://localhost:5173
   ```

### 可用脚本

| 命令 | 说明 |
|-----|-----|
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm run preview` | 预览生产构建 |
| `pnpm run lint` | 运行ESLint检查 |
| `pnpm run lint:fix` | 自动修复ESLint问题 |
| `pnpm run format` | 格式化代码 |
| `pnpm run type-check` | TypeScript类型检查 |


## 🚀 部署指南

### 构建生产版本
```bash
pnpm run build
```

### 静态文件服务
构建后的文件位于 `dist/` 目录，可以部署到任何静态文件服务器：

- **Vercel**: 直接连接 Git 仓库自动部署
- **Netlify**: 拖拽 `dist/` 文件夹即可部署
- **GitHub Pages**: 使用 GitHub Actions 自动部署
- **Nginx**: 配置静态文件服务

### 环境变量
目前项目为纯前端应用，无需配置环境变量。

## 📄 开源协议

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源协议。

## 🤝 贡献指南

我们欢迎所有形式的贡献，包括但不限于：
- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献

### 贡献流程
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发规范
- 遵循现有的代码风格
- 添加适当的类型定义
- 编写清晰的提交信息
- 更新相关文档
