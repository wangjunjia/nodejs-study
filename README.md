# nodejs-study

## koa2-ts-hello

### 环境要求

> Node > v8.9.1
> npm > v5.5.1
> nodemon > v1.14.7

### 目录结构

- vscode配置（.vscode）
- 编译后的 JS 文件（dist）
- 开发目录（src）
- 项目配置（package.json）
- TS 配置（tsconfig.json）
- TS 语法规则检测配置（tslint.json）
- nodemon 配置（监听文件改变自动重启 Node Server 服务的工具）（tasks.json）

### 安装依赖

1. 核心依赖

    ```
    npm install --save koa
    ```
  
2. 开发依赖

    ```
    npm install --save-dev @types/koa tslint typescript
    ```

### 启动

1. TS 自动编译为 JS 

    ```
    npm run watch
    ```

2. VSCode debug 开启 Node-Debugger 或者 Node-Builder 任务
3. 或者 使用 nodemon 开启监听服务