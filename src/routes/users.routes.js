import { Router } from 'express';
import passport from 'passport';
import { postUser } from '../controllers/users.controller.js';

const routerUsers = Router ();
routerUsers.post ( "/", passport.authenticate ( "register" ), postUser );

export default routerUsers;