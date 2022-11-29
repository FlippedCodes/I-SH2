const rabbitMq = require('rabbit-mq');
const incomingDiscord = require('@libraries/incoming-discord');
const outgoingDiscord = require('@libraries/outgoing-discord');
const hubManager = require('@libraries/hub-manager');

rabbitMq.subscribe('outgoing:discord:createMessage', message => {
    outgoingDiscord.createMessage(message);
})

incomingDiscord.on('createMessage', message => {
    rabbitMq.publish('incoming:discord:createMessage', message)
})

incomingDiscord.on('createHub', async (createHubCommand, callback) => {
    try {
        await hubManager.createHub(createHubCommand.name);
    } catch (err) {
        return callback(err)
    }
    callback();
})