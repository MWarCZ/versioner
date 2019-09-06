import jslogger from 'js-logger'

/**
 * @example
 * logger.trace('trace')
 * logger.debug('debug')
 * logger.info('info')
 * logger.warn('warn')
 * logger.error('error')
 */
const logger = jslogger

logger.useDefaults()

if (process.env.NODE_ENV === 'DEBUG') {
  logger.setLevel(logger.DEBUG)
} else {
  logger.setLevel(logger.INFO)
}

export default logger
