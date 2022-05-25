import { createHash } from 'crypto';
import { Request } from 'express';
import getDateStamp from './date';

const hash = (req: Request) => {
  const content = `${req.ip}${req.headers['user-agent']}${getDateStamp()}`;
  return createHash('sha256').update(content).digest('hex');
};

export default hash;
