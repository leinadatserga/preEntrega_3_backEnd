import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import { generateToken } from "../utils/jwt.js";

const expect = chai.expect;
const requester = supertest ( "http://localhost:8080" );
const user = JSON.parse ( config.realUser );
const product = JSON.parse ( config.fakeProduct );
const cookieToken = generateToken ( user );
const token = `jwtCookie=${ cookieToken }`;
await mongoose.connect ( config.mongoURL )
.then (() => {
    logger.http ( `DB connected` );
});
describe ( "Integration test for e-commerce", () => {
    let prodId;
    describe ( "Sessions test", () => {
        it ( "Endpoint test /api/session/login, expect to initiate a session", async function () {
            this.timeout(6000);
            const client = {
                email: user.email,
                password: user.password
            }
            const session = await requester.post ( "/api/session/login" ).send ( client );
            expect ( session.status ).to.equal ( 200 );
            expect ( session.body ).to.have.property ( "email" ).to.be.a ( "string" );
            expect ( session.body ).to.have.property ( "_id" ).to.be.a ( "string" );
        });
        it ( "Endpoint test /api/session/current, expect to obtain the current session data", async function () {
            const sessionData = await requester.get ( "/api/session/current" ).set ( "Cookie", token );
            expect ( sessionData.status ).to.equal ( 200 );
            expect ( sessionData.body.user ).to.have.property ( "_id" ).to.be.a ( "string" );
            expect ( sessionData.body ).to.have.property ( "iat" ).to.be.a ( "number" );
        });
        it ( "Endpoint test /api/session/logout, expect to logout of the active session", async function () {
            const terminate = await requester.get ( "/api/session/logout" );
            expect ( terminate.status ).to.equal ( 200 );
            expect ( terminate.body ).to.have.property ( "result" ).to.be.a ( "string" );
        });
    }); 
    describe ( "Products test", () => {
        let prevProp;
        it ( "Endpoint test /api/products, expect to create a product", async function () {
            const newProduct = await requester.post ( "/api/products" ).send ( product ).set ( "Cookie", token );
            expect ( newProduct.status ).to.equal ( 201 );
            expect ( newProduct.body ).to.have.property ( "status" ).to.be.a ( "boolean" );
            expect ( newProduct.body ).to.have.property ( "thumbnails" ).to.be.a ("array");
            prodId = newProduct.body._id;
            prevProp = newProduct.body.title;
        });
        it ( "Endpoint test /api/products:id, expect to update a product by the Id", async function () {
            const newValues = {
                title: "Bala Inactivo",
                category: "balota"
            }
            const updatedProduct = await requester.put ( `/api/products/${ prodId }` ).send ( newValues ).set ( "Cookie", token );
            expect ( updatedProduct.status ).to.equal ( 200 );
            expect ( updatedProduct.title ).to.not.deep.equal ( prevProp );
            expect ( updatedProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
        it ( "Endpoint test /api/products:id, expect to eliminate the product", async function () {
            const cleanProduct = await requester.delete ( `/api/products/${ prodId }` ).set ( "Cookie", token );
            expect ( cleanProduct.status ).to.equal ( 200 );
            expect ( cleanProduct.body ).to.have.property ( "thumbnails" ).to.be.a ( "array" );
            expect ( cleanProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
    });
    describe ( "Carts test", () => {
        let cartId = user.cart;
        it ( "Endpoint test /api/carts/:cid, expect to get a cart by the Id", async function () {
            const cart = await requester.get ( `/api/carts/${ cartId }` ).set ( "Cookie", token );
            expect ( cart.status ).to.equal ( 200 );
            expect ( cart.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( cart.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
        it ( "Endpoint test /api/carts/:cid/products/:pid, expect to add products to a cart by respective Ids", async function () {
            const addProd = await requester.post ( `/api/carts/${ cartId }/products/651c613036dd8e4e2f64e836` ).send ({ "quantity": 2 }).set ( "Cookie", token );
            expect ( addProd.status ).to.equal ( 200 );
            expect ( addProd.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( addProd.body.products ).to.be.a ( "array" );
        });
        it ( "Endpoint test /api/carts/:cid, expect to empty a cart by Id", async function () {
            const emptyCart = await requester.delete ( `/api/carts/${ cartId }` ).set ( "Cookie", token );
            expect ( emptyCart.status ).to.equal ( 200 );
            expect ( emptyCart.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( emptyCart.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
    });
});