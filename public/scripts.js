// Client
const username = prompt("What is your username?");
const socket = io("http://localhost:8000", {
  query: {
    username: username,
  },
});
let nsSocket = "";

// listen for nsList, which is a list of all the namespaces
socket.on("nsList", (nsData) => {
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  // populate UI with namespaces
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // add a click listener for each namespace
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      joinNS(nsEndpoint); // join on user click
    });
  });

  joinNS("/wiki"); // join automatically on page load
});
