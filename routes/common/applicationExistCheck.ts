import { Request, Response, NextFunction } from 'express';

import Application from '@Model/application.model';
import { throwError, catchDBError } from '@Lib/error';

const applicationExistCheck = async (req: Request, res: Response, next: NextFunction) => {
  const phone: Application['phone'] = req.body.phone;

  const application: Application = await Application.findOne({
    where: {
      phone,
    },
  }).catch(catchDBError(res));

  if (req.url == '/application' && req.method == 'POST') {
    if (application) {
      throwError(res, 'Exist_Data', '중복된 신청서입니다.');
    }
    next();
  }

  if (req.url == '/application' && req.method == 'PATCH') {
    if (!application) {
      throwError(res, 'Not_Found', '존재하지 않는 신청서입니다.');
    }
    res.locals.application = application;
    next();
  }

  if (req.url == '/application/load') {
    if (!application) {
      throwError(res, 'Not_Found', '존재하지 않는 신청서입니다.');
    }
    res.locals.application = application;
    next();
  }
};

export default applicationExistCheck;
