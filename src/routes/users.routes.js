import { Router } from 'express';
import passport from 'passport';
import { postUser, postUserRol, sendRecoveryMail, verifyRecoveryLink } from '../controllers/users.controller.js';
import { passportError, authorization } from '../utils/errors.js';

const routerUsers = Router ();
routerUsers.post ( "/", passport.authenticate ( "register" ), postUser );
routerUsers.post ( "/premium/:uid", passportError ( "jwt" ), authorization ( "admin" ), postUserRol );
routerUsers.post ( "/sendpassreset", sendRecoveryMail );
routerUsers.post ( "/verify/:token", verifyRecoveryLink );

export default routerUsers;