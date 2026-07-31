// Simple logging utility for error tracking
// In production, integrate with a service like Sentry, Datadog, or CloudWatch

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
}

const logs: LogEntry[] = [];

function formatLog(entry: LogEntry): string {
  return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${
    entry.context ? ` - ${JSON.stringify(entry.context)}` : ''
  }`;
}

export function logError(message: string, error?: unknown, context?: Record<string, any>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message,
    context: {
      error: error instanceof Error ? error.message : String(error),
      ...context,
    },
  };

  logs.push(entry);
  console.error(formatLog(entry));

  // In production, send to external logging service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with Sentry, Datadog, or similar
  }
}

export function logInfo(message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'info',
    message,
    context,
  };

  logs.push(entry);
  console.log(formatLog(entry));
}

export function logWarn(message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    message,
    context,
  };

  logs.push(entry);
  console.warn(formatLog(entry));
}

export function getLogs(limit: number = 100) {
  return logs.slice(-limit);
}
