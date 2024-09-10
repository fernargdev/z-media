require('dotenv').config();

import express, { NextFunction, Request, Response } from 'express';
export const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';

import { ErrorMidleware } from './middleware/error';

// body parser
app.use(express.json({ limit: '50mb' }));

// cookie parser
app.use(cookieParser());

app.use();

// cors => cors origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// testing route
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'API is working',
  });
});

// unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Router ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMidleware);
