# TodoList

基于 Next.js + TypeScript + Tailwind + Prisma + SQLite 的待办事项应用。

## 项目启动方式

### 本地开发

```bash
# 安装依赖
npm install

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### Docker 部署

```bash
# 构建并启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DATABASE_URL` | SQLite 数据库路径 | `file:./dev.db` |
| `PORT` | 服务端口 | `3000` |
| `HOSTNAME` | 服务地址 | `0.0.0.0` |
| `NODE_ENV` | 运行环境 | `production` |

## 数据库初始化方法

```bash
# 推送 schema 到数据库
npm run db:push

# 生成 Prisma Client
npm run db:generate

# 打开 Prisma Studio 可视化数据库
npm run db:studio
```

## 测试命令

```bash
# 运行测试
npm test

# 运行测试（一次性）
npm run test:run
```

### 测试覆盖

- **功能测试**: 创建/编辑/删除/完成状态/筛选
- **边界测试**: 空标题/超长标题/无效日期
- **API 测试**: 所有接口的 200/201/400/404 状态码

## 已知限制

1. **单用户架构**: 数据存储在本地 SQLite 文件，不支持多用户并发写入
2. **无数据迁移**: 使用 `prisma db push` 而非正式迁移，生产环境需迁移
3. **无认证授权**: API 无权限控制，直接暴露
4. **无分页**: GET /api/todos 返回全量数据，大数据量时需添加分页

## 下一步可扩展建议

### 高优先级
- [ ] 添加用户认证 (NextAuth.js)
- [ ] 添加数据迁移流程 (prisma migrate)
- [ ] 实现分页功能

### 中优先级
- [ ] 添加任务分类/标签
- [ ] 添加任务评论功能
- [ ] 添加提醒/通知
- [ ] 实现数据导出 (JSON/CSV)

### 低优先级
- [ ] PWA 支持离线访问
- [ ] 添加任务分享功能
- [ ] 实现任务排序（拖拽）
- [ ] 添加深色模式

## API 文档

### GET /api/todos

查询待办事项列表。

**Query 参数:**
- `filter`: `all` | `uncompleted` | `completed`

**响应:**
```json
{
  "todos": [
    {
      "id": "xxx",
      "title": "待办标题",
      "completed": false,
      "priority": "HIGH|MEDIUM|LOW",
      "dueDate": "2026-05-01T00:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### POST /api/todos

创建待办事项。

**请求体:**
```json
{
  "title": "待办标题",
  "priority": "HIGH|MEDIUM|LOW",
  "dueDate": "2026-05-01"
}
```

### PATCH /api/todos/:id

更新待办事项。

**请求体:**
```json
{
  "title": "更新后的标题",
  "completed": true,
  "priority": "LOW",
  "dueDate": "2026-05-10"
}
```

### DELETE /api/todos/:id

删除待办事项。

**响应:**
```json
{
  "success": true
}
```
