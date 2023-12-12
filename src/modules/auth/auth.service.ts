/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 13:11:58
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-19 19:26:09
 * @FilePath: \cms\src\modules\auth\auth.service.ts
 * @Description:
 */
import { EnvEnum, RedisKeyEnum } from "@/shared/enums";
import { JwtPayloadInterface } from "@/shared/interfaces";
import { LoggerService } from "@/shared/logger";
import { RedisService } from "@/shared/redis";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { plainToClass, plainToInstance } from "class-transformer";
import type { Request } from "express";
import requestIp from "request-ip";
import { UsersService } from "../users/users.service";
import { ExportLoginDto } from "./dtos/export-login.dto";
import { LoginAccountDto } from "./dtos/login-account.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly logger: LoggerService,
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
	) {
		this.logger.setContext(AuthService.name);
	}

	/**
	 * 登录
	 * @param loginAccountDto 登录信息
	 * @returns
	 */
	async login(loginAccountDto: LoginAccountDto, req: Request) {
		this.logger.log(`${this.login.name} was called`);

		//1.验证用户信息
		const user = await this.userService.validateUser(
			loginAccountDto.name,
			loginAccountDto.password,
		);
		const ip = requestIp.getClientIp(req);
		// 2.记录用户登录ip
		this.userService.recordUserIp(user.id, ip);

		const roleId = user.userRole[0].roleId;
		//3.生成token
		const { accessToken, refreshToken } = this.getAccessAndRefreshToken(
			user.id,
			user.name,
			roleId,
		);

		this.redisService.setex(
			RedisKeyEnum.LoginKey + user.id,
			60 * 60,
			accessToken,
		);

		return plainToInstance(ExportLoginDto, {
			accessToken,
			refreshToken,
		});
	}

	/**
	 * 刷新token
	 * @param id 用户id
	 * @returns
	 */
	async refreshToken(id: number) {
		this.logger.log(`${this.refreshToken.name} was called`);
		const user = await this.userService.findUserById(id);
		const roleId = user.role.id;
		return this.getAccessAndRefreshToken(user.id, user.name, roleId);
	}

	/**
	 * 获取access_token和refresh_token
	 * @param id 用户id
	 * @param name 用户名
	 * @returns
	 */
	getAccessAndRefreshToken(id: number, name: string, roleId: number) {
		this.logger.log(`${this.getAccessAndRefreshToken.name} was called`);
		const payload = { id, name, roleId } as JwtPayloadInterface;
		return plainToClass(ExportLoginDto, {
			accessToken: this.jwtService.sign(payload, {
				expiresIn: this.configService.get(EnvEnum.JWT_ACCESS_TOKEN_EXPIRES_IN),
			}),
			refreshToken: this.jwtService.sign(
				{ id },
				{
					expiresIn: this.configService.get(
						EnvEnum.JWT_REFRESH_TOKEN_EXPIRES_IN,
					),
				},
			),
		});
	}
}
