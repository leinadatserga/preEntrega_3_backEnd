const socket = io ();


const formReg = document.getElementById ( "registerForm" );
formReg.addEventListener ( "submit", ( e ) => {
    e.preventDefault ();
    const formData = new FormData ( e.target );
    const clientData = Object.fromEntries ( formData );
    socket.emit ( "newCient", clientData );
    e.target.reset ();
    socket.on ( "conf", ( confirm ) => {
        if ( confirm ) {
            console.log( "User OK" );
        } else {
            console.log( "User data error" );
        }
    })
});
