import db from "./db.js";
import lt from "localtunnel";
import { Tunnel } from "./types.js";
import express from "express";
let conns: any[] = [];
try {
  let tunnels: Array<any> = [];
  const tunnelConfigs: Array<Tunnel> = await db("tunnels").select("*").where("enable", true);
  if (!tunnelConfigs) {
    process.exit(1);
  }
  tunnelConfigs.forEach((tunnel: Tunnel) => {
    tunnels.push(lt({ local_host: tunnel.host, port: tunnel.port, subdomain: tunnel.subdomain }));
  });
  conns = await Promise.all(tunnels);
  conns.forEach((tunn: any) => {
    tunn.on("error", (err: Error) => console.error(err));
  });
} catch (error) {
  console.error(error);
}

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.disable("x-powered");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const tunnelConfigs: Array<Tunnel> = await db("tunnels").select("*");
  console.log(conns);
  return res.render("index", { tunnelConfigs });
});

app.post("/", async (req, res) => {
  try {
    await db("tunnels").insert(req.body);
    return res.redirect(req.headers["referer"] || "/");
  } catch (error) {}
});

app.get("/:id", async (req, res) => {
  try {
    const tunnel = await db("tunnels").select("*").where("id", req.params.id).first();
    if (!tunnel) res.sendStatus(404);
    return res.status(200).json(tunnel);
  } catch (error) {}
});

app.patch("/:id/enable", async (req, res) => {
  try {
    const tunnel = await db("tunnels").select("*").where("id", req.params.id).first();
    const result = await db("tunnels").update("enable", !tunnel.enable).where("id", req.params.id);
    if (!result) res.sendStatus(404);
    return res.status(201);
  } catch (error) {}
});

app.listen(3000, () => console.log("App running"));
