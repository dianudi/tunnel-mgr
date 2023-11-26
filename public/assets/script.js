// Modal DOM for update
document.querySelectorAll(".editItem").forEach((e) => {
  e.addEventListener("click", async () => {
    const editModal = new bootstrap.Modal("#addItem");
    editModal.show();
    const data = await fetch(`/${e.getAttribute("data-id")}`).then((res) => res.ok && res.json());
    document.querySelector(".createOrUpdate").setAttribute("action", `/${e.getAttribute("data-id")}`);
    document.querySelector("h1.modal-title").textContent = "Update Tunnel";
    document.querySelector("button.update").textContent = "Update";
    document.querySelector('input[name="name"]').value = data.name;
    document.querySelector('input[name="subdomain"]').value = data.subdomain;
    document.querySelector('input[name="host"]').value = data.host;
    document.querySelector('input[name="port"]').value = data.port;
  });
});

// Set default for Modal
document.querySelector(".newTunnel").addEventListener("hover", () => {
  document.querySelector(".createOrUpdate").setAttribute("action", `/`);
  document.querySelector("h1.modal-title").textContent = "New Tunnel";
  document.querySelector("button.update").textContent = "Save";
  document.querySelector('input[name="name"]').value = "";
  document.querySelector('input[name="subdomain"]').value = "";
  document.querySelector('input[name="host"]').value = "";
  document.querySelector('input[name="port"]').value = "";
});

// Update enable button
document.querySelectorAll(".enableItem").forEach((e) => {
  e.addEventListener("click", async () => {
    //   console.log(e.getAttribute("data-id"));
    await fetch(`/${e.getAttribute("data-id")}/enable`, { method: "PATCH" }).then((res) => res.ok);
  });
});

// Dark mode toggle
document.querySelector(".darkMode").addEventListener("click", () => {
  const state = document.querySelector("html").getAttribute("data-bs-theme");
  if (state == "dark") {
    document.querySelector("html").setAttribute("data-bs-theme", "white");
  } else {
    document.querySelector("html").setAttribute("data-bs-theme", "dark");
  }
});

// Live update connections state
setInterval(async () => {
  document.querySelector(".status").innerHTML = "";
  const data = await fetch("/status").then((res) => res.json());
  data.forEach((i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i.subdomain}</td><td><a class="text-decoration-none text-truncate" href="${i.url}">${i.url}</a></td><td>${
      i.closed == false ? "Ready 🚀" : "Closed"
    }</td>`;
    document.querySelector(".status").appendChild(tr);
  });
}, 1000);
