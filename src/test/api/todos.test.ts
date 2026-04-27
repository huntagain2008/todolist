import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import http from 'http'

const API_BASE = 'http://localhost:3000/api'

function request(options: http.RequestOptions, body?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

describe('Todo API', () => {
  let createdTodoId: string

  afterAll(async () => {
    // Cleanup: delete created todo
    if (createdTodoId) {
      await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/todos/${createdTodoId}`,
        method: 'DELETE'
      })
    }
  })

  describe('GET /api/todos', () => {
    it('returns 200 with todos array', async () => {
      const data = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/todos',
        method: 'GET'
      })
      const json = JSON.parse(data)
      expect(json.todos).toBeDefined()
      expect(Array.isArray(json.todos)).toBe(true)
    })
  })

  describe('POST /api/todos', () => {
    it('creates todo with 201', async () => {
      const body = JSON.stringify({
        title: '测试任务',
        priority: 'HIGH',
        dueDate: '2026-05-01'
      })
      const data = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/todos',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, body)
      const json = JSON.parse(data)
      expect(json.todo).toBeDefined()
      expect(json.todo.id).toBeDefined()
      expect(json.todo.title).toBe('测试任务')
      expect(json.todo.priority).toBe('HIGH')
      createdTodoId = json.todo.id
    })

    it('rejects empty title with 400', async () => {
      const body = JSON.stringify({ title: '' })
      let statusCode = 0
      await new Promise<void>((resolve) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/todos',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          }
        }, (res) => {
          statusCode = res.statusCode!
          res.resume()
          res.on('end', resolve)
        })
        req.on('error', resolve)
        req.write(body)
        req.end()
      })
      expect(statusCode).toBe(400)
    })

    it('rejects title over 200 chars with 400', async () => {
      const body = JSON.stringify({ title: 'a'.repeat(201) })
      let statusCode = 0
      await new Promise<void>((resolve) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/todos',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
          }
        }, (res) => {
          statusCode = res.statusCode!
          res.resume()
          res.on('end', resolve)
        })
        req.on('error', resolve)
        req.write(body)
        req.end()
      })
      expect(statusCode).toBe(400)
    })
  })

  describe('PATCH /api/todos/:id', () => {
    it('updates todo with 200', async () => {
      if (!createdTodoId) return

      const body = JSON.stringify({
        title: '更新后的标题',
        completed: true
      })
      const data = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/todos/${createdTodoId}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, body)
      const json = JSON.parse(data)
      expect(json.todo.title).toBe('更新后的标题')
      expect(json.todo.completed).toBe(true)
    })
  })

  describe('DELETE /api/todos/:id', () => {
    it('deletes todo with 200', async () => {
      // Create a todo first to delete
      const createBody = JSON.stringify({ title: '待删除任务', priority: 'LOW' })
      const createData = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/todos',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(createBody)
        }
      }, createBody)
      const created = JSON.parse(createData)
      const deleteId = created.todo.id

      const deleteData = await request({
        hostname: 'localhost',
        port: 3000,
        path: `/api/todos/${deleteId}`,
        method: 'DELETE'
      })
      const json = JSON.parse(deleteData)
      expect(json.success).toBe(true)
    })
  })

  describe('Filter tests', () => {
    it('filter=uncompleted returns only uncompleted', async () => {
      const data = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/todos?filter=uncompleted',
        method: 'GET'
      })
      const json = JSON.parse(data)
      json.todos.forEach((todo: { completed: boolean }) => {
        expect(todo.completed).toBe(false)
      })
    })

    it('filter=completed returns only completed', async () => {
      const data = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/todos?filter=completed',
        method: 'GET'
      })
      const json = JSON.parse(data)
      json.todos.forEach((todo: { completed: boolean }) => {
        expect(todo.completed).toBe(true)
      })
    })

    it('filter=all returns all todos', async () => {
      const data = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/todos?filter=all',
        method: 'GET'
      })
      const json = JSON.parse(data)
      expect(Array.isArray(json.todos)).toBe(true)
    })
  })
})
