
const generateMessage = (text) => {
    const item = {
        text,
        createdAt: new Date().getTime()
    }

    return item
}

const generateLocation = (url, text) => {
    const locItem = {
        url,
        text,
        createdAt: new Date().getTime()
    }

    return locItem
}

module.exports = {
    generateMessage,
    generateLocation
}