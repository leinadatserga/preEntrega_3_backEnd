import prodModel from "../models/products.models.js";

export const getProducts = async ( req, res ) => {
    const { limit, page, query, sort } = req.query;
    const pg = page ? page : 1;
    const lmt = limit ? limit : 10;
    const srt = sort == "asc" ? 1 : -1;
    let queryParsed;
    query ? queryParsed = JSON.parse(query) : queryParsed = {};
    try {
        const productsSort = await prodModel.paginate ( queryParsed , { limit: lmt, page: pg, sort: {"price": srt } });
        const products = await prodModel.paginate ( queryParsed , { limit: lmt, page: page });
        if ( sort ) {
            return res.status ( 200 ).send ( productsSort );  
        } else {
            return res.status ( 200 ).send ( products );
        }
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error when consulting products: ${ error }`});  
    }
};
export const getProduct = async ( req, res ) => {
    const { id } = req.params;
    try {
        const product = await prodModel.findById ( id );
        if ( product ) {
            return res.status ( 200 ).send ( product );
        }
        return res.status ( 404 ).send ({ error: "Not found" }); 
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error when consulting products: ${ error }`});  
    }
};
export const postProduct = async ( req, res ) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const newProduct = await prodModel.create ({ title, description, code, price, status, stock, category, thumbnails });
        if ( newProduct ) {
            return res.status ( 201 ).send ( newProduct );
        }
        return res.status ( 404 ).send ({ error: "Not found" });
    } catch (error) {
        if ( error.code == 11000 ) {
            return res.status ( 400 ).send ({ error: "Duplicated code" });
        } else {
            return res.status ( 500 ).send ({ error: `Error creating product: ${ error }` });
        }
    }
};
export const putProduct = async ( req, res ) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const updatedProduct = await prodModel.findByIdAndUpdate ( id, { title, description, code, price, status, stock, category, thumbnails });
        if ( updatedProduct ) {
            return res.status ( 200 ).send ( updatedProduct );
        }
        return res.status ( 404 ).send ({ error: "Not found" }); 
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error updating product: ${ error }` });
    }
};
export const deleteProduct = async ( req, res ) => {
    const { id } = req.params;
    try {
        const deletedProduct = await prodModel.findByIdAndDelete ( id );
        if ( deletedProduct ) {
            return res.status ( 200 ).send ( deletedProduct );
         }
         return res.status ( 404 ).send ({ result: "Not found" });
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error deleting product: ${ error }` });
    }
};