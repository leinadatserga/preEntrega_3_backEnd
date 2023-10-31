import messageModel from "../models/messages.models.js";

export const getMessages = async ( req, res ) => {
    try {
        const messages = await messageModel.find ();
        return res.status ( 200 ).send ( messages );
    } catch ( error ) {
        return res.status ( 500 ).send ({ error: `Error checking messages: ${ error }`});
    }
};
export const getMessageByMail = async ( req, res ) => {
    const { email } = req.params;
    try {
        const findMessage = await messageModel.findOne ({ email });
        if ( findMessage ) {
            const message = await messageModel.find ({ email });
            return res.status ( 200 ).send ( message );
        } else {
            return res.status ( 404 ).send ({ error: "Not found" });
        }
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error getting messages: ${ error }`});
    }
};
export const postMessage = async ( req, res ) => {
    const { email, message } = req.body;
    try {
        const newMessage = await messageModel.create ({ email, message });
        return res.status ( 200 ).send ( newMessage );
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error creating message: ${ error }` });
    }
};
export const deleteMessage = async ( req, res ) => {
    const { email } = req.params;
    try {
        const deletedMessages = await messageModel.findOneAndDelete ( email );
        if ( deletedProduct ) {
            return res.status ( 200 ).send ( deletedMessages );
        } else {
            return res.status ( 404 ).send ({ error: "Not found" });
        }
    } catch (error) {
        return res.status ( 500 ).send ({ error: `Error deleting message: ${ error }` });
    }
};