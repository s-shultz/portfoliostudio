import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register your routes
registerRoutes(app);

// Export the handler for Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};