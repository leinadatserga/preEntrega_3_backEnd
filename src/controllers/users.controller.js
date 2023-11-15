import CustomError from "../services/errors/CustomError.js";

export const postUser = async ( req, res ) => {
    try {
        if ( !req.user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
        res.status ( 200 ).send ({ message: "User created", user: req.user });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};