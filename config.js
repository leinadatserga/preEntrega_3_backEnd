import dotenv from "dotenv";

const enviroment = "development";
dotenv.config ({
    path: enviroment === "development" ? "./.env.development" : "./.env.production"
});

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    privateSession: process.env.PRIVATE_SESSION,
    salt: process.env.SALT,
    appId: process.env.APP_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callBackURL: process.env.CALLBACK_URL,
    JWTSecret: process.env.JWT_SECRET,
    emailPassword: process.env.PASSWORD_EMAIL
};
