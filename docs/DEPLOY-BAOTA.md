# 宝塔面板 Node 项目部署指南

本文说明如何在宝塔面板（BT Panel）上以 **Node 项目** 方式部署 Bing Wallpaper。

## 环境要求

| 项目 | 要求 |
|------|------|
| Node.js | **20.x** 或更高（推荐 LTS） |
| 包管理器 | **pnpm** 10.x（也可用 npm） |
| 内存 | 建议 **≥ 1GB** 可用（构建时占用较高） |
| 网络 | 服务器需能访问 `cn.bing.com`（构建与运行时都会请求） |

---

## 一、服务器准备

### 1. 安装 Node.js

宝塔 → **软件商店** → 搜索 **Node 版本管理器** → 安装 → 选择 **Node 20+**。

### 2. 安装 pnpm（推荐）

SSH 登录服务器后执行：

```bash
npm install -g pnpm
pnpm -v
```

若宝塔包管理器选 **npm**，可跳过此步。

### 3. 克隆代码

```bash
cd /www/wwwroot
git clone https://github.com/ideshun/bing-wallpaper.git bing-wallpaper
cd bing-wallpaper
```

目录可按你的域名调整。

---

## 二、宝塔添加 Node 项目

路径：**网站** → **Node 项目** → **添加 Node 项目**

| 配置项 | 建议值 |
|--------|--------|
| 项目目录 | `/www/wwwroot/bing-wallpaper` |
| 项目名称 | `bing-wallpaper` |
| 启动选项 | **`start`**（对应 `next start`，不要选 `dev`） |
| Node 版本 | v20+ / v22 |
| 包管理器 | `pnpm` 或 `npm` |
| 项目端口 | `3000`（更多配置里设置） |
| 运行用户 | `www` |

### 环境变量（可选）

多域名场景可不设。单域名时可加：

```env
NODE_ENV=production
PORT=3000
```

### 首次构建（重要）

本项目使用 **pnpm**（见 `packageManager` 字段），请勿用 npm 安装。宝塔启动前先在 SSH 执行：

```bash
cd /www/wwwroot/bing-wallpaper
corepack enable
pnpm install
pnpm build
```

构建成功后再在宝塔中 **启动** 项目。

> **说明：** 上游 `i18next` 发布包误带了 `prepare: husky`。仓库已通过 `pnpm.patchedDependencies` 去掉该脚本；安装请务必用 pnpm，以便应用补丁。

---

## 三、绑定域名与 SSL

1. 宝塔 → **网站** → 添加站点（或使用 Node 项目绑定的域名）
2. 站点设置 → **SSL** → 申请 Let's Encrypt 并开启 **强制 HTTPS**
3. Node 项目若已自动配置反代，可跳过手动 Nginx；否则见下方配置

---

## 四、Nginx 反向代理（手动配置时）

若需手动编辑，在站点 Nginx 配置的 `server` 块内加入：

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
    proxy_connect_timeout 60s;
}
```

---

## 五、部署验证

```bash
# 1. 进程是否在跑
curl -I http://127.0.0.1:3000

# 2. 首页
curl -I https://你的域名/

# 3. 壁纸 API（应返回 302 Location 指向 cn.bing.com）
curl -I https://你的域名/img/uhd
```

---

## 六、更新发布流程

```bash
cd /www/wwwroot/bing-wallpaper
git pull
pnpm install   # 或 npm install
pnpm build     # 或 npm run build
```

然后到宝塔 **Node 项目** 中点击 **重启**。

---

## 七、常见问题

### 1. 启动后 502 Bad Gateway

- 确认启动选项是 **`start`** 而不是 `dev`
- 确认已执行过 `pnpm build` / `npm run build`，存在 `.next` 目录
- 确认端口与 Nginx `proxy_pass` 一致

### 2. 构建失败：无法访问 cn.bing.com

- 检查服务器出站网络、DNS、防火墙

### 3. 内存不足导致构建被 Kill

- 建议服务器至少 1GB 可用内存再执行 build

### 4. 部署后页面无样式（像纯 HTML）

Next.js 样式在 `/_next/static/css/` 里，**必须 build 后 restart**，且 HTML 与 CSS 文件名 hash 要一致。

**在服务器上检查：**

```bash
cd /www/wwwroot/bing-wallpaper
ls -la .next/static/css/    # 应有 .css 文件
pnpm build                  # 若目录空或很旧，重新构建
# 宝塔 Node 项目 → 重启
```

**在浏览器 F12 → Network：**

- 找 `/_next/static/css/xxxxx.css` 是否为 **200**
- 若是 **404**，多半是：只 `git pull` 了但没 `pnpm build`，或 **CDN 缓存了旧 HTML**（新 CSS hash 对不上）

你站点响应头里有 `eo-cache`，若用了 **EdgeOne / CDN**，部署后请 **刷新 CDN 缓存**（至少刷新 `/` 和 `/_next/static/*`），再强制刷新浏览器（Ctrl+F5）。

**典型现象（HTML 与静态资源 hash 不一致）：**

```
GET /_next/static/css/b4ad15e39e3874f1.css 404
GET /_next/static/GlgyjFgz4s1g1rW1OBqg5/_buildManifest.js 404
```

说明浏览器/CDN 拿到的是**旧 HTML**，但服务器已是**新 build**。EdgeOne 控制台 → 缓存刷新 → 刷新 URL `https://bz.w3h5.com/` 即可。

**宝塔安装注意：** 构建前要用完整依赖（含 devDependencies），Tailwind 在 devDependencies 里：

```bash
pnpm install    # 不要加 --prod
pnpm build
```

**Nginx 不要拦截静态资源：** `/_next/` 必须反代到 Node（你当前的 `location /` 反代是对的）；勿把 `/_next` 当成磁盘目录去 `root` 或 return 404。

---

## 八、多域名绑定

项目**支持多个域名指向同一 Node 实例**，无需为每个域名单独部署。

1. **Node 项目**：保持一个实例（如端口 3000）
2. **网站**：为每个域名添加站点，反代都指向 `127.0.0.1:3000`
3. **SSL**：每个域名分别申请证书

首页会根据请求头 `Host` 自动生成对应域名的 API 示例链接。

---

## 九、端口与安全建议

- 生产环境仅通过 **Nginx 80/443** 对外，不必开放 3000 到公网
- 定期 `git pull` 更新依赖

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `package.json` | `build` / `start` 脚本 |
| `next.config.js` | Next.js 配置 |
| `lib/site-url.ts` | 从请求头解析当前域名 |
