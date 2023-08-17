import * as fs from 'fs';
import * as path from 'path';
import { config as configDotenv } from 'dotenv';

import { EnvironmentFile, Environments } from './environment.constant';
import IEnvironment from './environment.interface';

class Environment implements IEnvironment {
	public port: number;

	public env: string;

	/**
	 *
	 * @param NODE_ENV
	 */
	constructor(NODE_ENV?: string) {
		this.env = NODE_ENV || process.env.NODE_ENV || Environments.LOCAL;
		this.setEnvironment(this.env);
		const port: string | undefined | number = process.env.PORT || 8080;
		this.port = Number(port);
	}

	/**
	 *
	 * @returns
	 */
	public getCurrentEnvironment(): string {
		return this.env;
	}

	/**
	 *
	 * @param env
	 */
	public setEnvironment(env: string): void {
		let envPath: string;
		this.env = env || Environments.LOCAL;
		const rootdir: string = path.resolve(__dirname, '../../');
		switch (env) {
			case Environments.LOCAL:
				envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
				break;
			default:
				envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
		}
		if (!fs.existsSync(envPath)) {
			throw new Error('.env file is missing in root directory');
		}
		configDotenv({ path: envPath });
	}

	/**
	 *
	 * @returns
	 */
	public isDevEnvironment(): boolean {
		return this.getCurrentEnvironment() === Environments.LOCAL;
	}
}

export default Environment;
