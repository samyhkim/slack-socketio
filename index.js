// Server
const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");
app.use(express.static(__dirname + "/public"));
const expressServer = app.listen(8000);
const io = socketio(expressServer);

// on connection to main NS, build an array, to
// send back with the img and endpoint for each NS
io.of("/").on("connection", (socket) => {
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  // send the nsData back to the client
  // use socket, NOT io, bc we want it to go just to this client
  socket.emit("nsList", nsData);
});

// add a connection listener to each namespace
namespaces.forEach((namespace) => {
  // console.log(namespace);
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    // a socket has connected to one of our chat group namespaces
    // send that ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallback) => {
      // deal with history...once we have it
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomTitle); // leave whatever room user was in
      nsSocket.join(roomToJoin); // join new room
      // io.of("/wiki")
      //   .in(roomToJoin)
      //   .clients((error, clients) => {
      //     numberOfUsersCallback(clients.length);
      //   });
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });
      nsSocket.emit("historyCatchUp", nsRoom.history);
      // send back the number of users in this room to ALL sockets connected to this room
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .clients((error, clients) => {
          io.of(namespace.endpoint)
            .in(roomToJoin)
            .emit("updateMembers", clients.length);
        });
    });

    // server receieved message from client
    // send back constructed message object to client
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "sam",
        avatar: "https://via.placeholder.com/30",
      };
      // send this message to ALL the sockets that are in the room that THIs socket is in
      // how can we find out what room THIS socket is in?
      // console.log(nsSocket.rooms);

      // the user will be in the 2nd room in the object list
      // this is bc the socket ALWAYS joins its own room on connection
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // we need to find the Room object for this room
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});
