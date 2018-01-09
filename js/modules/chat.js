
let socket = io('https://easycode-test-chat.herokuapp.com/');

class Chat{
    constructor(socketUrl){
        this.chatRoomsList = document.querySelector('.chat-rooms-list');
        this.messageContainer = document.querySelector('.message-container');
    }

    verify(user){

        return new Promise ( function ( resolve, reject ){
            socket.emit('verify', user, function( error, res ){
                if ( error ) reject ( error );
                resolve(res);
            });
        })
    }

    getUsers(){

        return new Promise( function (resolve, reject){
            socket.emit( 'getUsers', function ( users ){
                if ( !users ) reject('Users not found');
                resolve ( users );
            });
        })


    }

    sendMessage(msg, userInfo){
        socket.emit('chatMessage', msg, userInfo);
    }

    writeMessage(userName){
        socket.emit('writeMessage', userName);
    }

    renderUsers(users){
        users.forEach( (user) => {
            let userItem = this.userItemTemplate(user);
            this.chatRoomsList.insertAdjacentHTML('beforeend', userItem);
        })
    }

    userItemTemplate(user){
        let chatRoomItem =
            `
            <div class="chat-room-item d-flex align-items-center">
                <div class="chat-room-user-ava">
                    <img src="img/chat-room-ava.png" alt="">
                    <span class="new-msg-count"></span>
                </div>
                <!-- / chat-room-user-ava -->
                <div class="chat-room-user-info">
                    <span class="chat-room-user-name">${user.name}</span>

                    <div class="chat-room-last-msg d-flex justify-content-between">
                        <span class="last-msg">${user.lastMessage}</span>
                        <span class="last-msg-time">1 min</span>
                    </div>
                    <!-- / chat-room-last-msg -->
                    <span class="chat-room-user-status online"></span>
                </div>
                <!-- / chat-room-user-info -->
            </div>
            `;
        return chatRoomItem;
    }

    renderMessage(message, user, userInfo){
        let newMsg = document.createElement('div');
        newMsg.innerHTML =
            `
            <img src="img/chat-room-ava.png" alt="">
            <div class="message-text">
                ${message}
            </div>
            `;

        if( user.name === userInfo.name){
            newMsg.classList.add('message', 'from-you');
        } else{
            newMsg.classList.add('message', 'to-you');
        }

        this.messageContainer.appendChild(newMsg);

    }
}