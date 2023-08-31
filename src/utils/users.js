const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validation
    if ( !username || !room) {
        return {
            error: 'username and room required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
        
    }) 

    //validation
    if (existingUser) {
        return {
            error: 'username already in use'
        }
    }

    //Store user
    const user = {id, username, room}
    users.push(user)
    return user
}

//Remove user function
const removeUser = (id) => {
    //find user
    const userIndex = users.findIndex((user) => {
        return user.id === id
    })

    //remove user
    if (userIndex !== -1) {
        const removedUser =  users.splice(userIndex, 1)[0]
        const note = `User with name ${removedUser.username} has been removed from room ${removedUser.room}`
        return note
    }
}

//get user using id function
const getUser = ((id) => {
    const user = users.find((user) => {
        return user.id === id
    })

    if (!user) {
        return undefined
    }

    return user
})

//get array of users from room using room name
const getUsersInRoom = (roomName) => {
    //clean data
    roomName = roomName.trim().toLowerCase()
    //find users in room
    const roomUsers = users.filter((user) => {
        return user.room === roomName
    }) 

    //validate
    if (roomUsers.length === -1) {
        return {
            error: 'Check room name'
        }
    }

    return roomUsers

}

//Test
addUser({
    id: 2,
    username: 'austine',
    room: 'new York'
})

addUser({
    id: 1,
    username: 'Gabriel',
    room: 'new York'
})

addUser({
    id: 4,
    username: 'Segun',
    room: 'March'
})

addUser({
    id: 5,
    username: 'Meyiwa',
    room: 'March'
})

console.log(users)


const myUser = getUser(3)
console.log(myUser)

const marchUsers = getUsersInRoom('New York')
console.log(marchUsers)
