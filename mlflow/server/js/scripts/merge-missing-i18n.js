#!/usr/bin/env node
/**
 * Merge missing i18n keys from en.json into zh-CN.json.
 * Uses English defaultMessage as placeholder for untranslated keys.
 * Overrides specific keys with Chinese translations where provided.
 */
const fs = require('fs');
const path = require('path');

const EN_PATH = path.join(__dirname, '../src/lang/default/en.json');
const ZH_CN_PATH = path.join(__dirname, '../src/lang/zh-CN.json');

// Chinese translations for commonly used keys (override en defaultMessage)
const ZH_OVERRIDES = {
  '3oBg7C': 'AI 网关',
  '9HzNUt': '支持多个 LLM 提供商的统一 API，支持速率限制。',
  Qr3GVE: '模型训练',
  aecpPo: '使用参数、指标和工件跟踪实验。',
  xNKhsu: '最近实验',
  qvEOHi:
    'MLflow 收集使用数据以改进产品。如需确认您的偏好，请访问导航侧栏中的设置页面。要了解收集了哪些数据，请访问 <documentation>文档</documentation>。',
};

const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
const zhCN = JSON.parse(fs.readFileSync(ZH_CN_PATH, 'utf8'));

const zhKeys = new Set(Object.keys(zhCN));
const missing = Object.keys(en).filter((k) => !zhKeys.has(k));

let added = 0;
for (const key of missing) {
  const entry = { ...en[key] };
  if (ZH_OVERRIDES[key]) {
    entry.defaultMessage = ZH_OVERRIDES[key];
  }
  zhCN[key] = entry;
  added++;
}

// Apply overrides to existing keys (for when re-running after merge)
for (const [key, defaultMessage] of Object.entries(ZH_OVERRIDES)) {
  if (zhCN[key]) {
    zhCN[key] = { ...zhCN[key], defaultMessage };
  }
}

fs.writeFileSync(ZH_CN_PATH, JSON.stringify(zhCN, null, 2) + '\n', 'utf8');
console.log(`Added ${added} missing keys to zh-CN.json`);
