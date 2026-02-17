const NODE_ENV = process.env.NODE_ENV || 'development';

type Loggable = string | object | Error;
const format = (m: Loggable) =>
  m instanceof Error ? (m.stack ?? m.message) : m;

export const logger = {
  info: (message: Loggable) => console.log(format(message)),
  debug: (message: Loggable) => {
    if (NODE_ENV === 'development') console.debug(format(message));
  },
  error: (message: Loggable) => console.error(format(message)),
  warn: (message: Loggable) => console.warn(format(message))
};
