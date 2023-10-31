import { Router } from 'express';
import { getMessages, getMessageByMail, postMessage, deleteMessage } from '../controllers/messages.controller.js';
import { passportError, authorization } from '../utils/errors.js';

const routerMessages = Router ();
routerMessages.get ( "/", passportError ( "jwt" ), authorization ( "user" ), getMessages );
routerMessages.get ( "/:email", passportError ( "jwt" ), authorization ( "admin" ), getMessageByMail );
routerMessages.post ( "/", passportError ( "jwt" ), authorization ( "user" ), postMessage );
routerMessages.delete ( "/:email", passportError ( "jwt" ), authorization ( "admin" ), deleteMessage );

export default routerMessages;