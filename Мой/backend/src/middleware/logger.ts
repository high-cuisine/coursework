import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const body = req.body;
  const query = req.query;
  const params = req.params;

  console.log(`[${timestamp}] ${method} ${url}`);
  if (Object.keys(body).length > 0) {
    console.log('Request Body:', body);
  }
  if (Object.keys(query).length > 0) {
    console.log('Query Parameters:', query);
  }
  if (Object.keys(params).length > 0) {
    console.log('URL Parameters:', params);
  }

  // Логируем ответ после его отправки
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
    return originalSend.call(this, body);
  };

  next();
}; 