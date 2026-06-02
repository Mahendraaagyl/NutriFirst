import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  
  console.log(`Server      : http://localhost:${PORT}`);
  console.log(`Frontend    : ${process.env.FRONTEND_URL}`);
  console.log(`AI Service  : ${process.env.AI_SERVICE_URL}`);
  console.log(`Environment : ${process.env.NODE_ENV}`);
 
});
