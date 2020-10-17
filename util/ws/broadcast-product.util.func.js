module.exports = (WsProvider, id, type, data) => {
  const channel = WsProvider.getChannel('product:*')

  if (!channel) return

  const topic = channel.topic(`product:${id}`)

  if (!topic) {
    // ! FIXME: Remove console logging before production.
    console.log('no body was viewing the product.')
    return
  }

  topic.broadcastToAll('bid', {
    type,
    data
  })
}
