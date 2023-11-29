// Modal DOM for update
document.querySelectorAll(".editItem").forEach((e) => {
  e.addEventListener("click", async () => {
    const editModal = new bootstrap.Modal("#addItem");
    editModal.show();
    document.querySelector("button.delete").classList.remove("d-none");
    const data = await fetch(`/${e.getAttribute("data-id")}`).then((res) => res.ok && res.json());
    document.querySelector(".createOrUpdate").setAttribute("action", `/${e.getAttribute("data-id")}`);
    document.querySelector("h1.modal-title").textContent = "Update Tunnel";
    document.querySelector("button.update").textContent = "Update";
    document.querySelector('input[name="name"]').value = data.name;
    document.querySelector('input[name="subdomain"]').value = data.subdomain;
    document.querySelector('input[name="host"]').value = data.host;
    document.querySelector('input[name="port"]').value = data.port;
    document.querySelector("button.delete").setAttribute("data-id", data.id);
  });
});

// Set default for Modal
document.querySelector(".newTunnel").addEventListener("click", () => {
  document.querySelector("button.delete").classList.add("d-none");
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
    await fetch(`/${e.getAttribute("data-id")}/enable`, { method: "PATCH" }).then((res) => res.ok);
  });
});

// Delete button
document.querySelector("button.delete").addEventListener("click", async (e) => {
  document.querySelector("form.createOrUpdate").addEventListener("submit", (e) => e.preventDefault());
  const res = await fetch(`/${document.querySelector("button.delete").getAttribute("data-id")}`, { method: "DELETE" }).then((res) => res.ok);
  if (res) window.location.reload();
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
  try {
    const data = await fetch("/status").then((res) => res.json());
    data.forEach((i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i.subdomain}</td><td><a class="text-decoration-none text-truncate" href="${i.url}">${i.url}</a></td><td>${
        i.closed == false ? "Ready 🚀" : "Closed"
      }</td>`;
      document.querySelector(".status").appendChild(tr);
    });
  } catch (error) {
    const toast = bootstrap.Toast.getOrCreateInstance(document.querySelector("#noConnection"));
    toast.show();
  }
}, 2000);
