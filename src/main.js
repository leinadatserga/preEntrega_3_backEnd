import config from "./config/config.js";
import express, { json } from 'express';
import cookieParser from "cookie-parser";
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import router from "./routes/api.routes.js";
import mongoose from 'mongoose';
import { __dirname } from './path.js';
import path from 'path';
import session from "express-session";
import MongoStore from "connect-mongo";
import initializePassport from "./config/passport.js";
import passport from "passport";
import logger from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";


const PORT = config.port;
const HOST = config.host;
const app = express ();
const server = app.listen ( PORT, HOST, () => {
    logger.http ( `Server host: ${ HOST } / port: ${ PORT }` );
});
logger.http ( `[ SYSTEM INFORMATION: ] [ ${ new Date ().toLocaleString () } ] Server initiated in ${ config.environment } environment mode.` );
mongoose.connect ( config.mongoURL )
.then ( async () => {
    logger.http ( `DB connected` )
})
.catch (( error ) => logger.error ( `Failed to connect to MongoDB Atlas: ${ error }` ));
const io = new Server ( server );
app.use ( express.urlencoded ({ extended: true }));
app.use ( express.json ());
app.use ( cookieParser ( config.JWTSecret ));
app.use ( session ({
    store: MongoStore.create ({
        mongoUrl: config.mongoURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90
    }),
    secret: config.privateSession,
    resave: true,
    saveUninitialized: true
})
);

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentation of WebAPI - Security eCommerce project",
            description: "Web API for Global Tech Market"
        }
    },
    apis: [ `${ __dirname }/docs/**/*.yaml` ]
};
console.log(__dirname);
const specifications = swaggerJSDoc ( swaggerOptions );

initializePassport ();
app.use ( passport.initialize ());
app.use ( passport.session ());
app.engine ( "handlebars", engine ());
app.set ( "view engine", "handlebars" );
app.set ( "views", path.resolve ( __dirname, "./views" ));
app.use ( "/static", express.static ( path.join ( __dirname, "/public" )));
app.use ( "/", router );
app.use ( "/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup ( specifications ) );

