# 📤 GitHub上传文件清单

## ✅ 需要上传的文件和目录

### 📱 应用核心文件（必须）
- `index.html` - 主页面
- `script.js` - 核心逻辑
- `style.css` - 样式文件
- `manifest.json` - PWA配置
- `service-worker.js` - 服务工作线程
- `icon-192.png` - 应用图标（192x192）
- `icon-512.png` - 应用图标（512x512）

### 📁 目录（必须）
- `www/` - 网页文件目录（包含所有应用文件的副本）
  - `index.html`
  - `script.js`
  - `style.css`
  - `manifest.json`
  - `service-worker.js`
  - `icon-192.png`
  - `icon-512.png`

### ⚙️ 项目配置（必须）
- `package.json` - npm项目配置
- `package-lock.json` - npm依赖锁定文件
- `capacitor.config.json` - Capacitor配置
- `.gitignore` - Git忽略文件配置

### 📱 Android项目（必须，但排除构建缓存）
- `android/` 目录下的所有文件，**除了**：
  - `android/app/build/` ❌（构建缓存，已通过.gitignore排除）
  - `android/build/` ❌（构建缓存，已通过.gitignore排除）
  - `android/capacitor-cordova-android-plugins/build/` ❌（构建缓存，已通过.gitignore排除）
  - `android/local.properties` ❌（本地路径配置，已通过.gitignore排除）

### 📚 文档文件（建议上传）
- `README.md` - 项目说明文档（已优化）
- `离线APK构建指南.md` - 构建教程（供开发者参考）

## ❌ 不需要上传的文件（已通过.gitignore排除）

- `node_modules/` - npm依赖包（体积大，可通过npm install重新安装）
- `android/app/build/` - 构建缓存（体积大，构建时自动生成）
- `android/build/` - 构建缓存
- `android/capacitor-cordova-android-plugins/build/` - 插件构建缓存
- `android/local.properties` - 本地路径配置（包含个人路径信息）
- `*.apk` - APK构建产物（体积大，可以单独发布Release）
- `项目文件整理说明.md` - 内部文档（已通过.gitignore排除）

## 📋 上传步骤

1. **确保.gitignore文件已创建**
   - 检查项目根目录是否有 `.gitignore` 文件
   - 如果没有，使用上面提供的 `.gitignore` 内容创建

2. **初始化Git仓库（如果还没有）**
   ```bash
   git init
   ```

3. **添加文件**
   ```bash
   git add .
   ```

4. **提交**
   ```bash
   git commit -m "Initial commit: Magic Calculator"
   ```

5. **连接到GitHub仓库**
   ```bash
   git remote add origin https://github.com/你的用户名/Calculator-magic.git
   git push -u origin main
   ```

## ⚠️ 注意事项

1. **不要上传APK文件** - 如果已经构建了APK，建议在GitHub Releases中单独发布
2. **检查敏感信息** - 确保没有上传包含个人信息的配置文件
3. **文件大小** - 如果某些文件太大，考虑使用Git LFS

## 📊 预计上传大小

- 核心文件：约100KB
- www目录：约100KB
- android目录（不含build）：约10-20MB
- 文档：约50KB
- **总计：约10-20MB**（很小，上传很快）

---

**提示：** 使用 `.gitignore` 文件可以自动排除不需要上传的文件，非常方便！

