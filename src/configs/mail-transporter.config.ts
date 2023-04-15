import "dotenv/config";

export default {
  transport: {
    host: process.env.EMAIL_HOST || 'host',
    port: process.env.EMAIL_PORT || 587,
    auth: {
      user: process.env.EMAIL_USER || 'user',
      pass: process.env.EMAIL_PASS || 'pass',
    },
  },
  defaults: {
    from: `Email helper <${process.env.EMAIL_USER || 'user'}>`,
  }
};  