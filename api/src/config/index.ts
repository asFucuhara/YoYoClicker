interface Config {
  PORT: number;
  mongoURL: string;
}

let configs = {} as Config;

if (process.env.NODE_ENV === 'production') {
  configs = require('./prod');
} else {
  configs = require('./dev');
}

export = configs;
