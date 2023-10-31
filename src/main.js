import config from "../config.js";
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

const PORT = config.port;
const app = express ();
const server = app.listen ( PORT, () => {
    console.log ( `Server port: ${ PORT }` );
});

mongoose.connect ( config.mongoURL )
.then ( async () => {
    console.log ( "DB connected" )
})
.catch (( error ) => console.log ( "Failed to connect to MongoDB Atlas: ", error ));
const io = new Server ( server );
app.use ( express.urlencoded ({ extended: true }));
app.use ( express.json ());
app.use ( cookieParser ( config.JWTSecret ));
app.use ( session ({
    store: MongoStore.create ({
        mongoUrl: config.mongoURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 900
    }),
    secret: config.privateSession,
    resave: true,
    saveUninitialized: true
})
);
initializePassport ();
app.use ( passport.initialize ());
app.use ( passport.session ());
app.engine ( "handlebars", engine ());
app.set ( "view engine", "handlebars" );
app.set ( "views", path.resolve ( __dirname, "./views" ));
app.use ( "/static", express.static ( path.join ( __dirname, "/public" )));
app.use ( "/", router );

