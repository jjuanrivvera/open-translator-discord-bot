const Sentry = require("@sentry/node");

const Tracing = require("@sentry/tracing");

const SENTRY_DSN = process.env.SENTRY_DSN;

module.exports = Sentry;

module.exports.start = () => {
    Sentry.init({
        dsn: SENTRY_DSN,
        
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}