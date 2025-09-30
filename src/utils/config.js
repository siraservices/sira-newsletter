import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

// Load environment variables
dotenv.config({ path: join(rootDir, '.env') });

class Config {
  constructor() {
    this.configPath = join(rootDir, 'config.json');
    this.load();
  }

  load() {
    try {
      const configFile = readFileSync(this.configPath, 'utf-8');
      this.data = JSON.parse(configFile);
    } catch (error) {
      console.error('Error loading config.json:', error.message);
      process.exit(1);
    }
  }

  save() {
    try {
      writeFileSync(this.configPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving config.json:', error.message);
    }
  }

  get(key) {
    const keys = key.split('.');
    let value = this.data;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    let obj = this.data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this.save();
  }

  getEnv(key, defaultValue = null) {
    return process.env[key] || defaultValue;
  }

  getRootDir() {
    return rootDir;
  }

  getDraftsDir() {
    const dir = join(rootDir, 'drafts');
    return dir;
  }

  getLogsDir() {
    const dir = join(rootDir, 'logs');
    return dir;
  }
}

export default new Config();
