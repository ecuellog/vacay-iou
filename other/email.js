var nodemailer = require('nodemailer');

// Email transport
var transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '5e2bb79814e919',
    pass: 'c4a619ba59ebc2'
  }
});

module.exports = {
  transport
};
