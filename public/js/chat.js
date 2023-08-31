const socket = io();

//Elements
const messageform = document.querySelector('#user1')
const messageinput = document.querySelector('#user1Input')
const messageButton = document.querySelector('#user1button')
const locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')
//const $location = document.querySelector('#locations')


//Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})


//Chat codes
socket.on('message', (welcomeMessage) => {
    console.log(welcomeMessage)

    //using mustache to render chat messages
    const html = Mustache.render($messageTemplate, {
        message: welcomeMessage.text,
        createdAt: moment(welcomeMessage.createdAt).format('hh:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
})



messageform.addEventListener('submit', (e) => {
    e.preventDefault()
// for targeting elements within a form
    //e.target.elements.elementname.value 

    //Disable button
    messageButton.setAttribute('disabled', 'disabled')

    socket.emit('user message', messageinput.value, (error) => {
        //Enable button and clear message box
        messageButton.removeAttribute('disabled')
        messageinput.value = '';
        messageinput.focus()
        
        if (error) {
            return console.log(error)
        }
        console.log('Delivered to server')
    })

})

//Location sharing
socket.on('locationMessage', (response) => {
    const html =  Mustache.render($locationTemplate, {
        link: response.url,
        note: response.text,
        createdAt: moment(response.createdAt).format('hh:mm a') 
    })

    $messages.insertAdjacentHTML('beforeend', html);

})

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return console.log('Your Browser has no geolocation')
    }

    //Disabling location button
    locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }

        socket.emit('location',location, (reply) => {
            //enabling location button
            locationButton.removeAttribute('disabled')
            
            console.log(reply)
        })
    })

})

socket.emit('join', {username, room});