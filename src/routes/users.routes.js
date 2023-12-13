import { Router } from 'express';
import passport from 'passport';
import { deleteUser, getUsers, postUser, postUserRol, sendRecoveryMail, verifyRecoveryLink } from '../controllers/users.controller.js';
import { passportError, authorization } from '../utils/errors.js';

const routerUsers = Router ();
routerUsers.get ( "/", passportError ( "jwt" ), authorization ( "admin" ), getUsers );
routerUsers.post ( "/", passport.authenticate ( "register" ), postUser );
routerUsers.delete ( "/:uid", passportError ( "jwt" ), authorization ( "admin" ), deleteUser );
routerUsers.post ( "/premium/:uid", passportError ( "jwt" ), authorization ( "admin" ), postUserRol );
routerUsers.post ( "/sendpassreset", sendRecoveryMail );
routerUsers.post ( "/verify/:token", verifyRecoveryLink );

export default routerUsers;