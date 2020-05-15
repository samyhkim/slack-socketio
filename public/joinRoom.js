function joinRoom(roomName) {
  // Send this roomName to the server!
  console.log("hello");
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    // we want to update the room member total now that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });
}
