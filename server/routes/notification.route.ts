import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { getNotifications } from '../controllers/notificatioin.controller';
const notificationRouter = express.Router();

notificationRouter.get(
  '/get-all-notifications',
  isAuthenticated,
  authorizeRoles('admin'),
  getNotifications
);

export default notificationRouter;
