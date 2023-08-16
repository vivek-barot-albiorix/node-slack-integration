import * as os from 'os';
import * as process from 'process';
import { NextFunction, Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseApi from '../BaseApi';
import {
	IServerTimeResponse,
	IResourceUsageResponse,
	IProcessInfoResponse,
	ISystemInfoResponse,
} from './system-status.types';

/**
 * Status controller
 */
export default class SystemStatusController extends BaseApi {
	/**
	 *
	 */
	public register(): Router {
		this.router.get('/test', this.test);
		this.router.get('/error', this.getError.bind(this));
		return this.router;
	}

	public test(req: Request,
		res: Response,
		next: NextFunction,): void {
		console.log('print vivek');
		try {
			res.locals.data = 'print vivek';
			// call base class method
			super.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getError(req: Request, res: Response, next: NextFunction): void {
		try {
			throw new ApiError(
				ReasonPhrases.BAD_REQUEST,
				StatusCodes.BAD_REQUEST,
			);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}
}
