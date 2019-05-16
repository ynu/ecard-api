export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const database_connectionLimit = process.env.CONNECTION_LIMIT || 10;
export const database_host = process.env.DATABASE_HOST;
export const database_user = process.env.USER;
export const database_password = process.env.PASSWORD;
export const database_database = process.env.DATABASE;
export const secret = process.env.SECRET;
