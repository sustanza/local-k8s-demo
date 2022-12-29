import { createLogger, transports, format } from "winston";

export default createLogger({
    transports: [new transports.Console()],
    handleExceptions: false,
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
});