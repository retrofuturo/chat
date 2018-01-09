
// create modal
let enterModal = new Modal('#enter-modal');

// loader
let loader = document.getElementById('loading');

// socket connect
let chat = new Chat();

// enterForm
let enterForm = document.forms['enter-form'];
let messageForm = document.forms['message-form'];
let inputMessage = messageForm.elements['message'];
let userInfo = {};
let writingStatus = document.querySelector('.writing-status');

socket.on('connection', function() {
    console.log('socket connected');

    let lsUserData = JSON.parse(localStorage.getItem('userInfo'));

    if ( lsUserData ) startChat( lsUserData );
    else{

        enterForm.addEventListener('submit', function(e){
            e.preventDefault();

            if ( this.elements['email'].value === '' && this.elements['name'].value === '') return console.log('Empty form');
            userInfo['email'] = this.elements['email'].value;
            userInfo['name'] = this.elements['name'].value;
            console.log(userInfo);

            startChat(userInfo);
        });
    }

});

function startChat (userData){
    chat.verify(userData)
        .then(user => {
            userInfo = user;
            localStorage.setItem('userInfo', JSON.stringify(user));
        })
        .then( enterModal.hide.bind(enterModal))
        .then( chat.getUsers.bind(chat) )
        .then( chat.renderUsers.bind(chat) )
        .then( setSocketEvents )
        .then( setViewEvents )
        .then( loader.classList.add('hide') )
        .catch(error => console.error(error));
}

function setSocketEvents(){
    socket.on('chatMessage', function (message, user){
        chat.renderMessage(message, user, userInfo);
        console.log(message, user);
    });

    socket.on('writeMessage', function (name){
        writingStatus.textContent = name + ' is writing...';
        setTimeout(function(){
            writingStatus.textContent = ''
        }, 1500);
    });
}

function setViewEvents() {
    messageForm.addEventListener('submit', function(e){
        e.preventDefault();

        if ( inputMessage.value === '') return console.log('empty message');

        chat.sendMessage( inputMessage.value, userInfo  );
        inputMessage.value = '';
    });

    inputMessage.addEventListener('keyup', function(e){
        chat.writeMessage(userInfo.name);
    })
}








