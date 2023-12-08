import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../../config/config.js";
import logger from "../../utils/logger.js";

const expect = chai.expect;
const requester = supertest ( "http://localhost:8080" );
const user = JSON.parse(config.realUser);
const product = JSON.parse(config.fakeProduct);
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
        it ( "Endpoint test /api/session/testjwt, expect to obtain the addProd session data", async function () {
            const addProd = await requester.get ( "/api/session/testjwt" );
            console.log(addProd.error);
            expect ( addProd.status ).to.equal ( 200 );
            expect ( addProd.body ).to.have.property ( "user" ).to.be.a ( "object" );
            expect ( addProd.body ).to.have.property ( "_id" ).to.be.a ("string");
            console.log(addProd.status);
            console.log(addProd.body.payload);
            console.log(addProd.body._id);
        });
        it ( "Endpoint test /api/session/logout, expect to logout of the addProd session", async function () {
            const terminate = await requester.get ( "/api/session/logout" );
            expect ( terminate.status ).to.equal ( 200 );
            expect ( terminate.body ).to.have.property ( "result" ).to.be.a ( "string" );
        });
    });  
    describe ( "Products test", () => {
        let prevProp;
        it ( "Endpoint test /api/products, expect to create a product", async function () {
            const newProduct = await requester.post ( "/api/products" ).send ( product );
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
            const updatedProduct = await requester.put ( `/api/products/${ prodId }` ).send ( newValues );
            expect ( updatedProduct.status ).to.equal ( 200 );
            expect ( updatedProduct.title ).to.not.deep.equal ( prevProp );
            expect ( updatedProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
        it ( "Endpoint test /api/products:id, expect to eliminate the product", async function () {
            const cleanProduct = await requester.delete ( `/api/products/${ prodId }` );
            expect ( cleanProduct.status ).to.equal ( 200 );
            expect ( cleanProduct.body ).to.have.property ( "thumbnails" ).to.be.a ( "array" );
            expect ( cleanProduct.body ).to.have.property ( "_id" ).to.be.a ("string");
        });

    });
    describe ( "Carts test", () => {
        let cartId = user.cart;
        it ( "Endpoint test /api/carts/:cid, expect to get a cart by the Id", async function () {
            const cart = await requester.get ( `/api/carts/${ cartId }` );
            expect ( cart.status ).to.equal ( 200 );
            expect ( cart.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( cart.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
        it ( "Endpoint test /api/carts/:cid/products/:pid, expect to add products to a cart by respective Ids", async function () {
            const addProd = await requester.put ( `/api/carts/${ cartId }/products/${ prodId }` ).send ({ "quantity": 2 });
            expect ( addProd.status ).to.equal ( 200 );
            expect ( addProd.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( addProd.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
        it ( "Endpoint test /api/carts/:cid, expect to empty a cart by Id", async function () {
            const emptyCart = await requester.delete ( `/api/carts/${ cartId }` );
            expect ( emptyCart.status ).to.equal ( 200 );
            expect ( emptyCart.body ).to.have.property ( "products" ).to.be.a ( "array" );
            expect ( emptyCart.body ).to.have.property ( "_id" ).to.be.a ("string");
        });
    });
});