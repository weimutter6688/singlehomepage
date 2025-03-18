# Single Homepage 单页面主页应用

这是一个基于 [Next.js](https://nextjs.org) 构建的单页面主页应用，使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 引导创建。

## 开始使用

### 环境配置

在运行应用之前，你需要设置环境变量：

1. 在项目根目录创建 `.env` 文件，内容如下：
```
ACCESS_TOKEN=your-secret-token-here
```

你可以使用以下命令生成一个安全的随机令牌：

```bash
# Linux/macOS
openssl rand -base64 32

# 或者使用这个命令生成更易读的令牌
head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 32

# Windows PowerShell
$random = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
echo $random
```

### 身份验证系统

本应用使用基于令牌的双层身份验证：

1. **页面级别认证**：用户必须输入有效的访问令牌才能访问应用的任何页面。这通过中间件强制执行，用于检查有效的令牌cookie。

2. **API认证**：相同的令牌用于验证API请求，用于修改数据（添加、更新、删除链接）。

**主要特性：**
- 令牌输入登录页面
- 访问令牌与 `.env` 中的值进行验证
- 安全的cookie存储令牌（httpOnly，生产环境下启用secure）
- 登出功能
- 所有页面和受保护API路由的令牌验证

### 运行开发服务器

运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 权限验证说明

应用采用简单的基于令牌的验证系统：

- 读取链接功能公开访问（无需认证）
- 添加、更新和删除链接需要认证
- 访问令牌在服务器端通过 `.env` 文件定义
- 也可以通过页面底部的UI手动设置访问令牌

## 技术栈详情

- **前端框架**：[Next.js](https://nextjs.org)
- **字体优化**：使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化加载 [Geist](https://vercel.com/font) 字体

## 了解更多

要了解更多关于Next.js的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解Next.js的特性和API
- [学习 Next.js](https://nextjs.org/learn) - 交互式Next.js教程

## 部署

### Vercel部署

推荐使用 [Vercel平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署你的Next.js应用，Vercel是Next.js的创建者。

查看 [Next.js部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

### PM2部署

如果你想在自己的服务器上部署，可以使用PM2进行进程管理：

1. 全局安装PM2:
```bash
npm install -g pm2
```

2. 构建生产版本:
```bash
npm run build
```

3. 使用PM2启动应用:
```bash
pm2 start    # 首次启动应用
```

常用的PM2管理命令:
```bash
pm2 restart singlehomepage  # 重启应用
pm2 stop singlehomepage    # 停止应用
pm2 logs singlehomepage    # 查看应用日志
pm2 list                   # 查看所有应用状态
```
