declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: number;
        MONGO_URI: string;
        JWT_SECRET: string;
        FRONT_URL: string;
        EMAIL_HOST: string;
        EMAIL_PORT: number;
        EMAIL_USER: string;
        EMAIL_PASS: string;
    }
}


declare namespace Express {
    export interface User {
        email: string;
        login: string;
    }
}