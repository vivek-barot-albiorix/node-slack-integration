interface IEnvironment {
	port: number;
	getCurrentEnvironment(): string;
	setEnvironment(env: string): void;
	isDevEnvironment(): boolean;
}

export default IEnvironment;
