const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Smart Utility Billing System server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
