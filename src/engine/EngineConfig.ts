import {getLogger, levels, Logger, LoggingMethod, LogLevelDesc, LogLevelNumbers, RootLogger} from "loglevel";
import * as process from "process";
import * as chalk from "chalk";
import {BiConsumer} from "./type/Type";

export interface EngineConfig {
	logLevel: LogLevelDesc;
	logLevels: Record<string, LogLevelDesc>;
	watch: boolean;
	write: boolean;
}

export const ENGINE_CONFIG_DEFAULT: EngineConfig = {
	logLevel: levels.WARN,
	logLevels: {},
	watch: false,
	write: false,
};

export const LOG_LEVEL_NAMES: Record<LogLevelDesc | string, string> = {
	TRACE: "TRACE",
	DEBUG: "DEBUG",
	INFO: "INFO",
	WARN: "WARN",
	ERROR: "ERROR",
	SILENT: "SILENT",
	0: "TRACE",
	1: "DEBUG",
	2: "INFO",
	3: "WARN",
	4: "ERROR",
	5: "SILENT",
	trace: "TRACE",
	debug: "DEBUG",
	info: "INFO",
	warn: "WARN",
	error: "ERROR",
	silent: "SILENT",
};

export const LOG_LEVEL_COLORS: Record<LogLevelNumbers | string, chalk.Chalk> = {
	"0": chalk.dim,
	"1": chalk.cyan,
	"2": chalk.blue,
	"3": chalk.yellowBright,
	"4": chalk.redBright,
	"5": chalk.whiteBright,
	trace: chalk.dim,
	debug: chalk.cyan,
	info: chalk.blue,
	warn: chalk.yellowBright,
	error: chalk.redBright,
	silent: chalk.whiteBright,
};

export function ellipsize(str: string, len: number): string {
	if (str.length === len) {
		return str;
	} else if (str.length < len) {
		return str + " ".repeat(len - str.length);
	} else {
		const headLen = Math.ceil((len - 1) / 2);
		const tailLen = len - (headLen + 1);
		const head = str.substr(0, headLen);
		const tail = str.substr(str.length - tailLen);
		return `${head}…${tail}`;
	}
}

export function lpad(num: number, len: number, str: string): string {
	const padded = `${str.repeat(len)}${num}`;
	return padded.substr(padded.length - len);
}

export function formatTime(date: Date = new Date()): string {
	const h = date.getHours();
	const m = date.getMinutes();
	const s = date.getSeconds();
	const ms = date.getMilliseconds();
	return `${lpad(h, 2, "0")}:${lpad(m, 2, "0")}:${lpad(s, 2, "0")}.${lpad(ms, 3, "0")}`;
}

const originalMethodFactory = getLogger("default").methodFactory;

export function configureLogger(name: string, config: EngineConfig): Logger {
	const logger = getLogger(name);
	const desiredLevel = config.logLevels[name.toUpperCase()] || config.logLevel;
	logger.methodFactory = (methodName: string, level: LogLevelNumbers, loggerName: string): LoggingMethod => {
		const originalMethod = originalMethodFactory(methodName, level, loggerName);
		return (...message: any[]): void => originalMethod(LOG_LEVEL_COLORS[methodName](`${formatTime()} ${ellipsize(name, 20)} ${ellipsize(LOG_LEVEL_NAMES[methodName], 5)}`), ...message);
	};
	logger.setLevel(desiredLevel);
	return logger;
}

export function configParam(argName: string, envName: string): string | undefined {
	const envValue = process.env[envName];
	if (envValue != null) {
		return envValue;
	}
	const argIndex = process.argv.findIndex(arg => arg === argName || arg.startsWith(`${argName}=`));
	if (argIndex < 0) {
		return undefined;
	}
	const argValue = process.argv[argIndex];
	if (argValue === argName) {
		return process.argv.length > (argIndex + 1) ? process.argv[argIndex + 1] : undefined;
	} else {
		return argValue.substr(argName.length + 1);
	}
}

export function boolFrom(value: any): boolean {
	if (value == null) {
		return false;
	} else if (typeof value === "string") {
		return !["false", "0", ""].includes(value.toLowerCase());
	} else if (typeof value === "number") {
		return value !== 0;
	} else {
		throw new Error(`Don't know how to convert ${typeof value} to Boolean: ${JSON.stringify(value)}`);
	}
}

export const ENGINE_CONFIG_PARAMS: Array<{ argName: string; envName: string; setter: BiConsumer<Partial<EngineConfig>, string>; }> = [
	{argName: "--log-level", envName: "LOG_LEVEL", setter: (config, value) => config.logLevel = value as LogLevelDesc},
	{argName: "--watch", envName: "WATCH", setter: (config, value) => config.watch = boolFrom(value)},
	{argName: "--write", envName: "WRITE", setter: (config, value) => config.write = boolFrom(value)},
];

export function configFromEnvironment(): Partial<EngineConfig> {
	const config: Partial<EngineConfig> = {};
	for (let param of ENGINE_CONFIG_PARAMS) {
		const value = configParam(param.argName, param.envName);
		if (value != null) {
			param.setter(config, value);
		}
	}
	let anyLogLevels: boolean = false;
	const logLevels: Record<string, LogLevelDesc> = {};
	Object.entries(process.env).forEach(([key, value]) => {
		let match = key.match(/^LOG_LEVEL_(?<name>\w+)$/);
		if (match != null) {
			anyLogLevels = true;
			logLevels[match.groups?.name.toUpperCase() || ""] = value as LogLevelDesc;
		}
	});
	if (anyLogLevels) {
		config.logLevels = logLevels;
	}
	return config;
}

export function buildConfig(supplied: Partial<EngineConfig> = configFromEnvironment()): EngineConfig {
	return Object.assign({}, ENGINE_CONFIG_DEFAULT, supplied);
}
