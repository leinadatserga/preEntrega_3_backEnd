import { generateToken } from '../utils/jwt.js';

export const postSession = async ( req, res ) => {
    try {
        if ( !req.user ) {
            return res.status ( 401 ).send ({ error: "Invalid user" });
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        }
        const token = generateToken ( req.user );
        res.cookie ( "jwtCookie", token, {
            maxAge: 43200000
        })
        return res.status ( 200 ).send ( req.user );
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error to initiate user session: ${ error }`}); 
    }
};
export const getJWT = async ( req, res ) => {
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        email: req.user.user.email,
        age: req.user.user.age
    }
    return res.status ( 200 ).send ( req.user ); 
};
export const getCurrent = async ( req, res ) => {
    return res.send ( req.user );
};
export const getGithub = async ( req, res ) => {
    return res.status ( 200 ).send ( req.user );
};
export const getGithubSession = async ( req, res ) => {
    req.session.user = req.user;
    return res.status ( 200 ).send ( req.user );
};
export const getLogOut = async ( req, res ) => {
    if ( req.session.login ) {
        req.session.destroy ();
    }
    return res.status ( 200 ).send ({ result: "Logout done" });
};