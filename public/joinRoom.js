function joinRoom(roomName) {
  // send this roomName to the server!
  nsSocket.emit("joinRoom", roomName);

  // populate room's history with messages
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

  // users-in-room UI
  nsSocket.on("updateMembers", (numMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span>`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });

  // search bar functionality
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
