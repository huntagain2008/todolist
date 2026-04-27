type LogLevel = 'INFO' | 'WARN' | 'ERROR'

interface LogEntry {
  level: LogLevel
  action: string
  timestamp: string
  details?: unknown
}

function formatLog(entry: LogEntry): string {
  const { level, action, timestamp, details } = entry
  const detailsStr = details ? ` | ${JSON.stringify(details)}` : ''
  return `[${timestamp}] ${level} | ${action}${detailsStr}`
}

export const logger = {
  info(action: string, details?: unknown): void {
    console.log(formatLog({
      level: 'INFO',
      action,
      timestamp: new Date().toISOString(),
      details
    }))
  },

  warn(action: string, details?: unknown): void {
    console.warn(formatLog({
      level: 'WARN',
      action,
      timestamp: new Date().toISOString(),
      details
    }))
  },

  error(action: string, details?: unknown): void {
    console.error(formatLog({
      level: 'ERROR',
      action,
      timestamp: new Date().toISOString(),
      details
    }))
  }
}
