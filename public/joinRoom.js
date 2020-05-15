function joinRoom(roomName) {
  // Send this roomName to the server!
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    // we want to update the room member total now that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`;
  });
  nsSocket.on("historyCatchUp", (history) => {
    console.log(history);
    const messagesUl = document.querySelector("#messages");
    messagesUl.innerHTML = "";

    // first time, currentMessages will be empty -> build top-down
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messagesUl.innerHTML;
      messagesUl.innerHTML = currentMessages + newMsg;
    });
    messagesUl.scrollTo(0, messagesUl.scrollHeight); // scroll to bottom of div
  });

  nsSocket.on("updateMembers", (numMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });

  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    let messages = Array.from(document.getElementsByClassName("message-text"));
    messages.forEach((msg) => {
      if (
        msg.innerText.toLoweerCase().indexOf(e.target.value.toLowerCase()) ===
        -1
      ) {
        // the message does not contain the user search term!
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
