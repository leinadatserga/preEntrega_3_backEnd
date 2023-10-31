const socket = io ();


const formLogin = document.getElementById ( "loginForm" );
formLogin.addEventListener ( "submit", ( e ) => {
    e.preventDefault ();
    const formData = new FormData ( e.target );
    const userData = Object.fromEntries ( formData );
    socket.emit ( "newUser", userData );
    e.target.reset ();
    socket.on ( "conf", ( confirm ) => {
        if ( confirm ) {
            console.log( "User OK" );
        } else {
            console.log( "User data error" );
        }
    })
});
