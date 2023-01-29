import { config as allConfig } from './env/all';
import { config as developmentConfig } from './env/development';

if (!process.env['NODE_ENV']) {
  process.env['NODE_ENV'] = 'development';
  console.log('NODE_ENV not set, running in development mode');
} else {
  console.log(`NODE_ENV set to ${process.env['NODE_ENV']}, running in ${process.env['NODE_ENV']} mode`);
}

let config = allConfig;

if (process.env['NODE_ENV'] === 'development') {
  config = { ... allConfig, ...developmentConfig || {} }
}

export { config };
