import { Router } from 'express';
import SystemStatusController from './components/slack-integration/slack-integration.controller';

/**
 * Here, you can register routes by instantiating the controller.
 *
 */
export default function registerRoutes(): Router {
	const router = Router();

	// System Status Controller
	const systemStatusController: SystemStatusController = new SystemStatusController();
	router.use('/api/slack', systemStatusController.register());

	return router;
}
