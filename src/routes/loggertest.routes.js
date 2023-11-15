import { Router } from 'express';
//import { passportError, authorization } from '../utils/errors.js';
import { loggerTest } from '../controllers/loggertest.controller.js';

const routerLogg = Router ();

routerLogg.get ( "/", loggerTest );

export default routerLogg;