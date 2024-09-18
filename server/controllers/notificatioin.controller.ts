import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncErrors';
import ErrorHandler from '../utils/ErrorHandler';
import NotificationModel from '../models/notification.model';
import cron from 'node-cron';

// get all notification by admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update notification status by admin
export const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const notification = await NotificationModel.findByIdAndUpdate(
      //   req.params.id,
      //   { status: 'read' },
      //   { new: true }
      // );

      const notificatioin = await NotificationModel.findById(req.params.id);

      // notificatioin!.status = 'read';

      if (!notificatioin) {
        return next(new ErrorHandler('Notification not found', 404));
      }

      notificatioin.status
        ? (notificatioin.status = 'read')
        : notificatioin.status;

      await notificatioin.save();

      const notifications = await NotificationModel.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete notification --- only admin
cron.schedule('0 0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  await NotificationModel.deleteMany({
    status: 'read',
    createAt: { $lt: thirtyDaysAgo },
  });
});
