export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  WHATSAPP_BEARER_TOKEN: process.env.WHATSAPP_BEARER_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_WA_ID: process.env.TEST_WA_ID,
  TEST_NUMBER_ID: process.env.TEST_NUMBER_ID,
  ALFRED_WA_ID: process.env.ALFRED_WA_ID,
  ALFRED_NUMBER_ID: process.env.ALFRED_NUMBER_ID,
});
