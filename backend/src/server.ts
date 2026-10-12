import app from './app';
import connectDB from './config/db';

const PORT = Number.parseInt(process.env.PORT || '5001', 10);

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
