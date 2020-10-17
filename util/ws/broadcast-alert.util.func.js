module.exports = (WsProvider, id, type, data) => {
  const channel = WsProvider.getChannel('alert:*')

  if (!channel) return

  const topic = channel.topic(`alert:${id}`)

  if (!topic) {
    // ! FIXME: Remove console logging before production.
    console.log('this user is not actively monitering their session.')
    return
  }

  topic.broadcastToAll('alert', {
    type,
    data
  })
}
