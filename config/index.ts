import dotenv from 'dotenv';

dotenv.config();

export const DATABASE = {
    HOST : process.env.DATABASE_HOST,
    NAME : process.env.DATABASE_NAME,
    PORT : process.env.DATABASE_PORT,
}

export const JWT_SECRET = process.env.JWT_SECRET as string