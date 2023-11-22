import config from "../config/config.js";
import userModel from "../models/users.models.js";
import CustomError from "../services/errors/CustomError.js";
import crypto from "crypto";
import { mailSender } from "../config/mailer.js";
import { createHash } from "../utils/bcrypt.js";
import logger from "../utils/logger.js";


const tokenLink = {};
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
export const postUserRol = async ( req, res ) => {
    const { uid } = req.params;
    try {
        const user = await userModel.findById ( uid );
        if ( !user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
        const rol = user.rol;
        rol == "user" ? user.rol = "premium" : user.rol = "user";
        await userModel.findByIdAndUpdate( uid, { rol: user.rol });
        res.status ( 200 ).send ({ message: "Rol updated", user: req.user });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};
export const sendRecoveryMail = async ( req, res ) => {
    const { email } = req.body;
    const user = await userModel.findOne ({ email: email });
        if ( !user ) {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        } else {
            logger.debug ( "User finded!" );
        }
    try {
        const token = crypto.randomBytes ( 20 ).toString ( "hex" );
        tokenLink [ token ] = { email, timestamp: Date.now ()};
        const link = `http://${ config.host }:${ config.port }/api/users/verify/${ token }`;
        mailSender ( email, link );
        res.status ( 200 ).send ({ message: "Recovery email sent" });
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` ); 
    }
};

export const verifyRecoveryLink = async ( req, res ) => {
    const { token } = req.params;
    const { password } = req.body;
    const newPassword = createHash ( password );
    const verifiedLink = tokenLink [ token ];
    try {
        if ( verifiedLink && ( Date.now () - verifiedLink.timestamp ) <= 3600000 ) {
            const { email } = verifiedLink;
            const userNewPass = await userModel.findOneAndUpdate({ email: email }, { password: newPassword }, { new: true });
            delete tokenLink [ token ];
            res.status ( 200 ).send ({ message: "Recovery email verify, new password set confirmed" });
        } else {
            res.status ( 400 ).send ( `${ CustomError.BadRequest ()}` );
        }
    } catch (error) {
        res.status ( 500 ).send ( `${ CustomError.InternalServerError ()}` );
    }
};