import config from "./config.js";
import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import userModel from "../models/users.models.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const JWTExtractor = jwt.ExtractJwt;
const initializePassport = () => {
    const cookieExtractor = req => {
        const token = req.cookies ? req.cookies.jwtCookie : {};
        return token;
    }
    passport.use ( "jwt", new JWTStrategy ({
        jwtFromRequest: JWTExtractor.fromExtractors ([ cookieExtractor ]),
        secretOrKey: config.JWTSecret
    }, async ( jwt_payload, done ) => {
        try {
            return done ( null, jwt_payload );
        } catch (error) {
            return done ( error );
        }
    }));
    passport.use ( "register", new LocalStrategy ( 
        { passReqToCallback: true, usernameField: "email" }, async ( req, username, password, done ) => {
            const { first_name, last_name, email, age } = req.body;
            if ( !first_name || !last_name || !email || age < 18 ) {
                CustomError.createError ({
                    name: "User handler error",
                    cause: generateUserErrorInfo ({ first_name, last_name, email, age }),
                    message: "Error in creation of new User",
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }
            try {
                const user = await userModel.findOne ({ email: username })
                if ( user ) {
                    return done ( null, false );
                }
                const cryptdPassword = createHash ( password )
                const newUser = await userModel.create ({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: cryptdPassword
                })
                console.log ( newUser );
                return done ( null, newUser )
            } catch (error) {
                return done ( error )
            }
        }
    ));



    passport.use ( "login", new LocalStrategy ({ usernameField: "email" }, async ( username, password, done ) => {
        try {
            const user = await userModel.findOne ({ email: username })
            if ( !user ) {
                return done ( null, false ); 
            }
            if ( validatePassword ( password, user.password )) {
               return done ( null, user ) 
            }
            return done ( null, false )
        } catch (error) {
           return done ( error ) 
        }
    }))
}

passport.use ( "github", new GithubStrategy ({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.callBackURL
}, async ( accessToken, refreshToken, profile, done ) => {
    try {
        console.log(accessToken);
        console.log(refreshToken);
        const user = await userModel.findOne ({ email: profile._json.email });
        if ( user ) {
            done ( null, false );
        } else {
            const newUser = await userModel.create ({
                first_name: profile._json.name,
                last_name: " ",
                email: profile._json.email,
                age: 18,
                password: "password"
            })
            done ( null, newUser )
        } 
    } catch ( error ) {
       done ( error ) 
    }
}))

passport.serializeUser (( user, done ) => {
    done ( null, user._id )
});

passport.deserializeUser ( async ( id, done ) => {
    const user = await userModel.findById ( id );
    done ( null, user )
});


export default initializePassport;
