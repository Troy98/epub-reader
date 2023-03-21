let socketIOServer;
let socketIO;


let setSocketIOServer = (obj) => {
  socketIOServer = obj;
  if (socketIOServer) {
    socketIOServer.on('connection', (socket) => {
      socketIO = socket
    });
  }
}

let getSocketIOServer = () => {
  return socketIOServer;
}

const broadCastToReader = (event, room, data) => {
  if (data) {
    socketIOServer.to(room).emit(event, data);
    return;
  }
  socketIOServer.in(room).emit(event);
}

module.exports = {
  setSocketIOServer,
  getSocketIOServer,
  broadCastToReader
}
