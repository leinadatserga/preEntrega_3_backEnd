import { Router } from 'express';
import { getCarts, getCart, postCart, postProdCart, putProdCart, putProdsCart, deleteProdCart, deleteCart, postPurchase } from '../controllers/carts.controller.js';
import { passportError, authorization } from '../utils/errors.js';

const routerCart = Router ();
routerCart.get ( "/", passportError ( "jwt" ), authorization ( "admin" ), getCarts );
routerCart.get ( "/:cid", passportError ( "jwt" ), authorization ( "user" ), getCart );
routerCart.post ( "/", passportError ( "jwt" ), authorization ( "user" ), postCart );
routerCart.post ( "/:cid/products/:pid", passportError ( "jwt" ), authorization ( "user" ), postProdCart );
routerCart.put ( "/:cid/products/:pid", passportError ( "jwt" ), authorization ( "user" ), putProdCart );
routerCart.put ( "/:cid", passportError ( "jwt" ), authorization ( "user" ), putProdsCart );
routerCart.delete ( "/:cid/products/:pid", passportError ( "jwt" ), authorization ( "admin" ), deleteProdCart );
routerCart.delete ( "/:cid", passportError ( "jwt" ), authorization ( "admin" ), deleteCart );
routerCart.post ( "/:cid/purchase", postPurchase );

export default routerCart;