type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'info':
        console.info(formattedMessage, ...args);
        break;
      case 'warn':
        console.warn(formattedMessage, ...args);
        break;
      case 'error':
        console.error(formattedMessage, ...args);
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production') {
          console.debug(formattedMessage, ...args);
        }
        break;
    }
  }

  public info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  public warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  public error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  public debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = Logger.getInstance();
