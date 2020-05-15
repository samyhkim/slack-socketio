const socket = io("http://localhost:8000"); // the / namespace/endpoint
let nsSocket = "";

// listen for nsList, which is a list of all the namespaces
socket.on("nsList", (nsData) => {
  console.log("The list of namespaces has arrived.");
  // console.log(nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // add a click listener for each namespace
  // console.log(document.getElementsByClassName("namespace"));
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    // console.log(elem);
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(`${nsEndpoint} I should go to now`);
    });
  });
  joinNS("/wiki");
});
