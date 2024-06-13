export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthError";
	}
}

export class UnknownError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnknownError";
	}
}

export class CLIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "CLIError";
	}
}
