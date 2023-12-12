/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-03 16:08:16
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:52:20
 * @FilePath: \cms\src\shared\enums\permission.enum.ts
 * @Description:
 */
export enum PermissionEnum {
	ALL = "*:*:*",
	SYSTEM_USERS_CREATE = "system:users:create",
	SYSTEM_USERS_UPDATE = "system:users:update",
	SYSTEM_USERS_DELETE = "system:users:delete",
	SYSTEM_USERS_QUERY = "system:users:query",

	SYSTEM_DEPARTMENT_CREATE = "system:department:create",
	SYSTEM_DEPARTMENT_UPDATE = "system:department:update",
	SYSTEM_DEPARTMENT_DELETE = "system:department:delete",
	SYSTEM_DEPARTMENT_QUERY = "system:department:query",

	SYSTEM_MENU_CREATE = "system:menu:create",
	SYSTEM_MENU_UPDATE = "system:menu:update",
	SYSTEM_MENU_DELETE = "system:menu:delete",
	SYSTEM_MENU_QUERY = "system:menu:query",

	SYSTEM_ROLE_CREATE = "system:role:create",
	SYSTEM_ROLE_UPDATE = "system:role:update",
	SYSTEM_ROLE_DELETE = "system:role:delete",
	SYSTEM_ROLE_QUERY = "system:role:query",
}
