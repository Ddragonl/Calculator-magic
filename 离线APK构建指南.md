# 📱 构建完全离线的APK（使用Capacitor）- 详细教程

## 🎯 为什么需要这个？

PWA Builder生成的APK是TWA（Trusted Web Activity），会加载远程网页。如果你想要完全离线、不依赖网络的应用，需要使用Capacitor打包。

---

## 📋 第一步：安装Node.js

### 1.1 下载Node.js

1. **访问Node.js官网**
   - 打开浏览器，访问：https://nodejs.org/
   - 你会看到两个版本：LTS（推荐）和Current（最新）

2. **选择版本**
   - 点击 **"LTS"** 版本的下载按钮（推荐，更稳定）
   - 例如：`20.x.x LTS` 版本

3. **下载安装包**
   - Windows用户：下载 `.msi` 文件
   - 文件大小约30-40MB

### 1.2 安装Node.js

1. **运行安装程序**
   - 双击下载的 `.msi` 文件
   - 如果出现安全提示，点击"运行"或"是"

2. **安装向导**
   - 点击"Next"（下一步）
   - 接受许可协议，点击"Next"
   - 选择安装路径（默认即可），点击"Next"
   - **重要**：确保勾选 "Add to PATH"（添加到PATH环境变量）
   - 点击"Next" → "Install"（安装）

3. **完成安装**
   - 等待安装完成（约1-2分钟）
   - 点击"Finish"（完成）

### 1.3 验证Node.js安装

1. **打开命令行**
   - 按 `Win + R` 键
   - 输入 `cmd` 或 `powershell`
   - 按回车

2. **检查Node.js版本**
   ```bash
   node --version
   ```
   - 应该显示版本号，例如：`v20.10.0`
   - 如果显示"不是内部或外部命令"，说明安装失败或PATH未配置

3. **检查npm版本**
   ```bash
   npm --version
   ```
   - 应该显示版本号，例如：`10.2.3`
   - npm会随Node.js一起安装

**✅ 如果两个命令都能显示版本号，说明Node.js安装成功！**

---

## 📋 第二步：配置Android环境变量（Windows）

### 2.1 找到Android SDK路径

1. **打开Android Studio**
   - 启动Android Studio

2. **打开SDK Manager**
   - 点击菜单：`File` → `Settings`（或按 `Ctrl + Alt + S`）
   - 在左侧找到：`Appearance & Behavior` → `System Settings` → `Android SDK`
   - 或者直接点击工具栏的SDK Manager图标

3. **查看SDK路径**
   - 在"Android SDK Location"中可以看到SDK路径
   - 默认路径通常是：`C:\Users\你的用户名\AppData\Local\Android\Sdk`
   - **复制这个路径**（后面会用到）

### 2.2 配置环境变量

#### 方法一：通过系统设置（推荐）

1. **打开环境变量设置**
   - 按 `Win + R` 键
   - 输入 `sysdm.cpl`，按回车
   - 或者：右键"此电脑" → "属性" → "高级系统设置"

2. **进入环境变量**
   - 在"系统属性"窗口中，点击"环境变量"按钮

3. **添加ANDROID_HOME变量**
   - 在"系统变量"区域，点击"新建"按钮
   - 变量名：`ANDROID_HOME`
   - 变量值：粘贴你刚才复制的SDK路径（例如：`C:\Users\你的用户名\AppData\Local\Android\Sdk`）
   - 点击"确定"

4. **编辑PATH变量**
   - 在"系统变量"区域，找到 `Path` 变量
   - 选中 `Path`，点击"编辑"按钮
   - 点击"新建"，添加以下两条路径：
     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\tools
     ```
   - 点击"确定"保存所有更改

5. **验证配置**
   - **重要**：关闭所有命令行窗口
   - 重新打开PowerShell或CMD
   - 运行以下命令验证：
     ```bash
     adb --version
     ```
   - 如果显示版本信息，说明配置成功
   - 如果还是报错，检查路径是否正确

#### 方法二：通过PowerShell（临时，不推荐）

```powershell
# 临时设置（仅当前会话有效）
$env:ANDROID_HOME = "C:\Users\你的用户名\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

**⚠️ 注意**：这种方法只在当前PowerShell窗口有效，关闭后失效。

---

## 📋 第三步：初始化Capacitor项目

### 3.1 打开项目目录

1. **打开命令行**
   - 在项目文件夹中，按住 `Shift` 键，右键点击空白处
   - 选择"在此处打开PowerShell窗口"或"在此处打开命令窗口"
   - 或者：在文件资源管理器地址栏输入 `cmd` 或 `powershell` 后按回车

2. **确认当前目录**
   ```bash
   cd
   ```
   - 应该显示：`E:\AI项目\Calculator-magic`
   - 如果不是，使用 `cd` 命令切换到项目目录

### 3.2 初始化npm项目

1. **创建package.json**
   ```bash
   npm init -y
   ```
   - `-y` 参数表示使用默认值
   - 这会创建一个 `package.json` 文件

2. **验证创建成功**
   - 检查项目文件夹中是否出现了 `package.json` 文件

### 3.3 安装Capacitor

1. **安装Capacitor核心包**
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```
   - 这会下载并安装Capacitor相关包
   - 等待安装完成（可能需要1-2分钟）
   - 如果出现警告，可以忽略

2. **验证安装**
   ```bash
   npx cap --version
   ```
   - 应该显示版本号，例如：`5.5.0`

### 3.4 初始化Capacitor

1. **运行初始化命令**
   ```bash
   npx cap init
   ```

2. **按提示输入信息**
   - **App name（应用名称）**：输入 `魔法计算器` 或 `Calculator Magic`
   - **App ID（应用ID）**：输入 `com.calculator.magic`（必须是小写，用点分隔）
   - **Web dir（网页目录）**：输入 `www`
     - ⚠️ **重要**：输入 `www`（不要留空）
     - 如果还没有创建www目录，先创建并复制文件（见3.6步骤）

3. **验证初始化**
   - 检查项目文件夹中是否出现了 `capacitor.config.json` 文件
   - 打开这个文件，确认配置正确

### 3.5 添加Android平台

1. **创建www目录并复制文件**
   
   **⚠️ 重要：Capacitor需要文件在 `www` 目录中！**
   
   - 在项目根目录创建 `www` 文件夹
   - 将以下文件复制到 `www` 文件夹：
     - `index.html`
     - `script.js`
     - `style.css`
     - `manifest.json`
     - `service-worker.js`
     - `icon-192.png`
     - `icon-512.png`

2. **检查capacitor.config.json配置**
   
   - 打开 `capacitor.config.json` 文件
   - 确保 `webDir` 设置为 `"www"`：
     ```json
     {
       "appId": "com.calculator.magic",
       "appName": "魔法计算器",
       "webDir": "www",
       "bundledWebRuntime": false
     }
     ```
   - 保存文件

2. **如果android文件夹已存在但创建失败**
   
   - 删除 `android` 文件夹（如果存在）
   - 然后继续下一步

3. **添加Android平台**
   ```bash
   npx cap add android
   ```
   - 这会创建 `android` 文件夹
   - 等待完成（可能需要几分钟，会下载Android相关文件）
   - 如果看到错误 `"." is not a valid value for webDir`，说明配置还没修复，请先修复配置

4. **验证添加成功**
   - 检查项目文件夹中是否出现了 `android` 文件夹
   - 检查是否有错误信息
   - 如果成功，应该没有错误提示

### 3.6 准备网页文件目录

**⚠️ 重要：Capacitor需要文件在 `www` 目录中！**

1. **创建www目录并复制文件**

   **方法一：使用批处理脚本（最简单，推荐）**
   
   - 双击运行项目根目录中的 `创建www目录.bat` 文件
   - 脚本会自动创建www目录并复制所有文件
   - 完成后会显示提示信息
   
   **方法二：使用命令行（CMD）**
   
   在项目根目录的CMD中运行以下命令（一行一行执行）：
   
   ```bash
   mkdir www
   copy index.html www\
   copy script.js www\
   copy style.css www\
   copy manifest.json www\
   copy service-worker.js www\
   copy icon-192.png www\
   copy icon-512.png www\
   ```
   
   **方法三：手动操作**
   
   1. 在项目文件夹中创建 `www` 文件夹
   2. 将以下文件复制到 `www` 文件夹中：
      - `index.html`
      - `script.js`
      - `style.css`
      - `manifest.json`
      - `service-worker.js`
      - `icon-192.png`
      - `icon-512.png`

2. **更新capacitor.config.json配置**

   - 打开 `capacitor.config.json` 文件
   - 确保 `webDir` 字段设置为 `"www"`：
     ```json
     {
       "appId": "com.calculator.magic",
       "appName": "魔法计算器",
       "webDir": "www",
       "bundledWebRuntime": false
     }
     ```
   - 如果还没有这个字段，添加它
   - 保存文件

3. **验证www目录**
   
   - 检查 `www` 文件夹是否存在
   - 检查 `www` 文件夹中是否有所有文件
   - 确认 `www/index.html` 文件存在

### 3.7 同步文件

1. **同步文件到Android项目**
   ```bash
   npx cap sync
   ```
   - 这会将 `www` 目录中的文件复制到Android项目中
   - 等待完成
   - 如果成功，应该没有错误信息

2. **验证同步**
   - 检查 `android/app/src/main/assets/public/` 文件夹
   - 应该能看到你的 `index.html`、`script.js`、`style.css` 等文件
   - 如果文件都在，说明同步成功

---

## 📋 第四步：在Android Studio中构建APK

### 4.1 打开Android Studio项目

1. **使用Capacitor命令打开**
   ```bash
   npx cap open android
   ```
   - 这会自动启动Android Studio并打开项目
   - 如果Android Studio没有自动打开，手动打开Android Studio

2. **或者手动打开**
   - 打开Android Studio
   - 点击 "Open" 或 "Open an Existing Project"
   - 选择项目文件夹中的 `android` 文件夹
   - 点击"OK"

### 4.2 等待项目加载

1. **首次打开需要时间**
   - Android Studio会自动下载Gradle和依赖
   - 底部状态栏会显示进度
   - 可能需要5-15分钟（取决于网络速度）
   - **不要关闭Android Studio，等待完成**

2. **查看进度**
   - 底部会显示 "Gradle sync in progress..."
   - 等待显示 "Gradle sync finished"

3. **如果出现错误**
   - 检查网络连接
   - 点击 "Try Again" 重试
   - 或者点击 "File" → "Invalidate Caches" → "Invalidate and Restart"

### 4.3 构建APK

#### 方法一：构建Debug APK（用于测试）

1. **打开构建菜单**
   - 点击顶部菜单：`Build`（构建）
   - 选择：`Build Bundle(s) / APK(s)`（构建Bundle或APK）
   - 选择：`Build APK(s)`（构建APK）

2. **等待构建完成**
   - 底部会显示构建进度
   - 通常需要1-3分钟
   - 构建完成后会显示通知

3. **找到APK文件**
   - 构建完成后，点击通知中的 "locate"（定位）链接
   - 或者手动导航到：`android/app/build/outputs/apk/debug/`
   - APK文件名：`app-debug.apk`

#### 方法二：构建Release APK（用于发布）

1. **生成签名密钥**
   - 点击菜单：`Build` → `Generate Signed Bundle / APK`
   - 选择 `APK`，点击 "Next"
   - 如果没有密钥，点击 "Create new..." 创建新密钥
   - 填写密钥信息：
     - Key store path: 选择保存位置和文件名
     - Password: 设置密码（记住这个密码！）
     - Key alias: 输入别名（例如：calculator-key）
     - Key password: 设置密钥密码
     - Validity: 默认25年即可
     - 填写个人信息（姓名、组织等）
   - 点击 "OK" 创建密钥

2. **选择密钥并构建**
   - 选择刚才创建的密钥文件
   - 输入密码
   - 选择 "release" build variant
   - 点击 "Next" → "Finish"

3. **找到APK文件**
   - APK位置：`android/app/build/outputs/apk/release/`
   - APK文件名：`app-release.apk`

---

## 📋 第五步：安装和测试APK

### 5.1 传输APK到手机

1. **通过USB连接**
   - 用数据线连接手机和电脑
   - 在手机上允许USB调试
   - 将APK文件复制到手机

2. **通过其他方式**
   - 微信/QQ发送给自己
   - 上传到网盘下载
   - 通过邮件发送

### 5.2 在手机上安装

1. **找到APK文件**
   - 打开手机文件管理器
   - 找到APK文件

2. **安装APK**
   - 点击APK文件
   - 如果提示"未知来源"，进入设置允许安装
   - 点击"安装"
   - 等待安装完成

3. **打开应用**
   - 点击"打开"或从桌面启动
   - **现在应该直接显示计算器界面，不需要网络！**

---

## ✅ 验证成功

如果以下条件都满足，说明构建成功：

- ✅ APK文件生成（在 `android/app/build/outputs/apk/debug/` 或 `release/` 文件夹）
- ✅ APK可以安装到手机
- ✅ 应用打开后直接显示计算器界面（不需要网络）
- ✅ 所有功能正常工作

---

## 🔧 常见问题和解决方案

### 问题1：`node` 命令未找到

**错误信息**：`node: 无法将"node"项识别为...`

**解决方案**：
1. 检查Node.js是否安装：访问 https://nodejs.org/ 重新安装
2. 重启命令行窗口
3. 检查PATH环境变量是否包含Node.js路径

### 问题2：`adb` 命令未找到

**错误信息**：`adb: 无法将"adb"项识别为...`

**解决方案**：
1. 检查ANDROID_HOME环境变量是否正确设置
2. 检查PATH中是否包含 `%ANDROID_HOME%\platform-tools`
3. **重要**：关闭所有命令行窗口，重新打开
4. 验证：运行 `adb --version` 应该显示版本

### 问题3：项目路径包含非ASCII字符错误

**错误信息**：
```
Your project path contains non-ASCII characters. This will most likely cause the build to fail on Windows.
Please move your project to a different directory.
```

**原因**：项目路径中包含中文或其他非ASCII字符（如 `E:\AI项目\...`），Android Gradle插件默认不允许这种情况。

**解决方案**：

**方法一：添加配置忽略检查（推荐，最简单）**

1. 打开 `android/gradle.properties` 文件
2. 在文件末尾添加以下内容：
   ```properties
   # Override path check to allow non-ASCII characters in project path
   android.overridePathCheck=true
   ```
3. 保存文件
4. 在Android Studio中点击 "Sync Project with Gradle Files"（Gradle同步按钮）
5. 等待同步完成

**方法二：移动项目到纯英文路径（彻底解决）**

1. 将项目移动到纯英文路径，例如：
   - `E:\Projects\Calculator-magic`
   - `D:\Calculator-magic`
2. 在新路径下重新打开项目
3. 运行 `npx cap sync` 重新同步

**推荐使用方法一，简单快速！**

### 问题4：Gradle同步失败

**错误信息**：`Gradle sync failed`

**解决方案**：
1. 检查网络连接
2. 点击 "File" → "Invalidate Caches" → "Invalidate and Restart"
3. 等待重新同步
4. 如果还是失败，检查防火墙设置

### 问题4：找不到web assets目录

**错误信息**：`Could not find the web assets directory: .\www`

**原因**：Capacitor默认查找 `www` 目录，但文件在根目录。

**解决方案**：
1. **创建www目录**
   ```bash
   mkdir www
   ```

2. **复制文件到www目录**
   ```bash
   copy index.html www\
   copy script.js www\
   copy style.css www\
   copy manifest.json www\
   copy service-worker.js www\
   copy icon-192.png www\
   copy icon-512.png www\
   ```

3. **更新capacitor.config.json**
   - 添加或修改 `webDir` 为 `"www"`：
     ```json
     {
       "appId": "com.calculator.magic",
       "appName": "魔法计算器",
       "webDir": "www",
       "bundledWebRuntime": false
     }
     ```

4. **重新运行同步**
   ```bash
   npx cap sync
   ```

### 问题5：构建APK时出错

**错误信息**：各种构建错误

**解决方案**：
1. 检查 `capacitor.config.json` 配置是否正确
2. 运行 `npx cap sync` 重新同步
3. 在Android Studio中：`File` → `Sync Project with Gradle Files`
4. 清理项目：`Build` → `Clean Project`，然后重新构建

### 问题5：应用打开后是空白页面

**解决方案**：
1. 检查 `android/app/src/main/assets/public/` 文件夹中是否有所有文件
2. 运行 `npx cap sync` 重新同步
3. 检查 `capacitor.config.json` 中的 `webDir` 是否为 `.`

### 问题6：找不到APK文件

**解决方案**：
1. APK位置：`android/app/build/outputs/apk/debug/app-debug.apk`
2. 如果文件夹不存在，说明构建失败，检查错误信息
3. 在Android Studio中查看 "Build" 标签页的错误信息

---

## 📝 重要提示

1. **首次构建需要时间**
   - 下载依赖可能需要10-30分钟
   - 请耐心等待，不要中断

2. **保持网络连接**
   - 构建过程中需要下载依赖
   - 确保网络连接稳定

3. **环境变量配置后需要重启**
   - 配置环境变量后，必须关闭所有命令行窗口
   - 重新打开命令行才能生效

4. **定期同步文件**
   - 修改代码后，运行 `npx cap sync` 同步到Android项目
   - 然后重新构建APK

5. **备份签名密钥**
   - 如果创建了签名密钥，务必备份
   - 丢失密钥后无法更新应用

---

## 🎉 完成！

按照以上步骤，你就可以构建完全离线的APK了！

构建完成后，APK会：
- ✅ 完全离线运行，不需要网络
- ✅ 直接显示计算器界面
- ✅ 不依赖GitHub Pages
- ✅ 可以分享给他人使用

---

## 📚 后续操作

### 更新应用

1. 修改代码（`index.html`、`script.js`、`style.css`等）
2. 运行 `npx cap sync`
3. 在Android Studio中重新构建APK
4. 安装新APK到手机

### 发布到应用商店

1. 构建签名APK（Release版本）
2. 按照应用商店要求准备材料
3. 上传APK和相关信息

---

**需要帮助？** 如果遇到问题，检查上面的"常见问题和解决方案"部分。
