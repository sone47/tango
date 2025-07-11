# TanGo - 产品说明文档

> 一个智能化移动端语言学习应用，专注于卡片式学习体验和个性化学习进度管理。

## 📖 产品概述

TanGo 是一款语言学习应用，通过卡片式学习模式帮助用户高效掌握外语词汇。应用支持自定义词包导入、智能学习进度追踪，以及直观的交互体验。

### 🎯 核心特性

- **渐进式学习**：采用三阶段内容展示（音标 → 写法 → 释义），降低学习压力
- **智能进度管理**：基于熟练度算法的个性化学习进度跟踪
- **灵活词包系统**：支持多词包管理，Excel 格式一键导入
- **现代化交互**：丰富的动画效果和直观的触摸操作
- **本地数据存储**：基于 IndexedDB 的离线数据管理

## 🚀 功能详解

### 练习模块

#### 📚 卡包选择区
- **多卡包支持**：左上角按钮快速切换不同卡包
- **智能过滤**：支持按熟悉程度过滤内容
- **洗牌功能**：随机打乱卡片顺序，提升学习效果
- **实时切换**：练习过程中可随时切换卡包（需确认提示）

#### 🎴 智能卡片系统
- **渐进式展示**：三个内容区（音标、写法、释义）从左向右逐步展示
- **交互式遮挡**：滑动遮挡展示内容，增强记忆效果
- **3D翻转动画**：点击卡片查看例句，支持流畅的3D翻转
- **手势操作**：向上滑动进入下一张卡片

#### 📊 熟练度标记
- **精确评分**：支持1-100%的熟练度调整
- **智能锁定**：遮挡物完全移除前禁止操作，确保完整学习
- **即时反馈**：操作后立即更新学习进度

#### 📖 历史卡池
- **学习回顾**：右上角按钮查看本次已学习的卡片
- **时间排序**：按进入时间逆序排列，最新学习的在前
- **进度调整**：支持回顾时修改卡片熟练度
- **左右滑动**：便捷的横向浏览历史卡片

### 个人中心

#### 📈 学习统计
- **进度可视化**：各词包学习进度一目了然
- **统计数据**：总体进度、今日学习量等关键指标
- **趋势分析**：基于学习记录的进度趋势展示

#### 🎯 词包管理
- **卡片式展示**：最多展示3个词包，超出部分支持查看更多
- **当前词包高亮**：边框突出显示当前使用的词包
- **快速切换**：点击词包即可切换当前学习词包
- **滑动操作**：左滑显示修改和删除选项
- **进度算法**：
  ```javascript
  let total = 0
  for (word in package) {
    total += (word * proficiency)
  }
  const progress = total / word_count_in_package * 100
  ```

#### 📥 Excel 导入功能
- **标准格式支持**：按照指定列格式解析Excel文件
- **批量导入**：一次性导入整个词包的所有内容
- **自动分类**：根据卡包信息自动组织词汇结构

## 📥 Excel导入格式

应用支持标准Excel格式的词包导入，请按照以下格式准备文件：

| 列名 | 必填 | 说明 | 示例 |
|-----|------|------|------|
| 音标 | 可选 | 读音标注（假名、音标等） | べんきょう |
| 写法 | 必填 | 词汇的文字写法 | 勉強 |
| 释义 | 必填 | 中文含义或翻译 | 学习 |
| 例句 | 可选 | 使用例句 | 勉強すればするほど、難しくなる感じがします。 |
| 卡包 | 必填 | 所属卡包名称 | 第一課　出会い |
| 词汇音频 | 可选 | 词汇发音音频文件 | - |
| 例句音频 | 可选 | 例句发音音频文件 | - |

### 导入步骤
1. 准备符合格式的Excel文件
2. 在"我的"页面点击"导入词包"
3. 选择Excel文件上传
4. 系统自动解析并存储到IndexedDB
5. 新词包自动出现在词包列表中

## 🎨 设计特色

### 现代化UI设计
- **轻量化设计语言**：大量使用透明度和毛玻璃效果
- **渐变色彩搭配**：温暖的蓝色渐变营造舒适学习环境
- **移动端优先**：专为移动设备优化的响应式设计
- **微交互动画**：Framer Motion驱动的流畅动画效果

### 交互体验优化
- **直观触摸操作**：点击、滑动、翻转等自然手势
- **渐进式学习**：内容逐步展示，减少认知负担
- **即时视觉反馈**：所有操作都有明确的动画反馈
- **智能状态管理**：应用状态持久化，重启后保持学习进度

## 📚 使用指南

### 开始学习
1. **导入词包**：通过“我的”页面上传Excel格式的词包，或通过“推荐词包”页面导入词包
2. **选择卡包**：在练习页面选择要学习的卡包
3. **开始练习**：按照卡片提示进行渐进式学习
4. **标记熟练度**：完成学习后对每张卡片进行熟练度评估

### 学习技巧
- **渐进式记忆**：不要急于查看所有内容，按顺序逐步展示
- **定期复习**：利用历史卡池功能回顾已学内容
- **合理标记**：诚实地标记熟练度，有助于系统推荐复习内容
- **多样化练习**：尝试洗牌功能增加学习挑战性

### 进度管理
- **查看统计**：定期检查学习进度和统计数据
- **调整计划**：根据进度调整学习节奏和目标
- **词包切换**：根据学习需要灵活切换不同词包
