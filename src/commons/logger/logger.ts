import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',  // Nivel mínimo a registrar (puede ser 'error', 'warn', 'info', 'http', 'debug')
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),  // Logs en la consola
    new transports.File({ filename: 'error.log', level: 'error' }),  // Logs de errores en archivo
    new transports.File({ filename: 'combined.log' })  // Todos los logs en archivo
  ],
});
