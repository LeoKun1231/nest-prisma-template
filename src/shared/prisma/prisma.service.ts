import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, PrismaClient } from "@prisma/client";
import { EnvEnum } from "../enums/env.enum";
import { LoggerService } from "../logger";

type EventType = "query" | "info" | "warn" | "error";

@Injectable()
export class PrismaService
	extends PrismaClient<Prisma.PrismaClientOptions, EventType>
	implements OnModuleInit, OnModuleDestroy
{
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: LoggerService,
	) {
		super({
			datasourceUrl: configService.get<string>(EnvEnum.DATABASE_URL),
			errorFormat: "pretty",
			log: [
				{ emit: "event", level: "query" },
				{ emit: "event", level: "info" },
				{ emit: "event", level: "warn" },
				{ emit: "event", level: "error" },
			],
		});
		this.logger.setContext(PrismaService.name);
	}

	async onModuleInit() {
		await this.$connect();
		this.logger.log(`prisma connect success ✅`);
		this.log();
	}

	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log(`prisma disconnect success ✅`);
	}

	private log() {
		this.$on("query", (e) => {
			this.logger.log(
				`sql: 📝 ${e.query} - params: 💬 ${e.params} - duration: 🚀 ${e.duration}ms`,
			);
		});
		this.$on("error", (e) => {
			this.logger.error(
				`🔖 errorMessage: ${e.message} - target: ${e.target} - timestamp: ${e.timestamp}`,
			);
		});
		this.$on("warn", (e) => {
			this.logger.warn(
				`warnMessage: ${e.message} - target: ${e.target} - timestamp: ${e.timestamp}`,
			);
		});
		this.$on("info", (e) => {
			this.logger.log(
				`infoMessage: ${e.message} - target: ${e.target} - timestamp: ${e.timestamp}`,
			);
		});
	}
}
