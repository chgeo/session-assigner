const cds = require('@sap/cds')
const { WebSocketServer } = require('ws')

cds.once('listening', ({ server }) => {
  const wss = new WebSocketServer({ server })

  cds.once('shutdown', () => {
    wss.clients?.forEach(ws => ws.terminate())
    wss.close()
  })

  // @ts-ignore
  cds.on('assignment.changed', (assignment) => {
    const payload = JSON.stringify({
      type: 'assignment.changed',
      data: assignment
    })
    wss.clients?.forEach(ws => ws.send(payload))
  })

})

