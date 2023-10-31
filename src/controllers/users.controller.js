export const postUser = async ( req, res ) => {
    try {
        if ( !req.user ) {
            res.status ( 400 ).send ({ message: "Existing user" });
        }
        res.status ( 200 ).send ({ message: "User created", user: req.user });
    } catch (error) {
        res.status ( 500 ).send ({ message: `Error creating user: ${ error }`}); 
    }
};