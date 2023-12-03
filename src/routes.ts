import { Request, Response, Router } from "express";
import { NewOrUpdateTunnel, Tunnel } from "./types.js";
import db from "./db.js";
import tunnels from "./tunnel.js";
import log from "./log.js";

const r = Router();
r.route("/").get(async (_, res: Response): Promise<void> => {
  try {
    const tunnels: Array<Tunnel> = await db("tunnels").select("*");
    return res.render("index", { tunnels });
  } catch (e: any | Error) {
    log.error(e.message);
  }
});

r.route("/").post(async (req: Request, res: Response): Promise<Response | void> => {
  const { name, subdomain, host, port }: NewOrUpdateTunnel = req.body;
  try {
    await db("tunnels").insert({ name, subdomain, host, port });
    return res.redirect(req.headers["referer"] || "/");
  } catch (e: any | Error) {
    log.error(e.message);
    return res.sendStatus(500);
  }
});

r.route("/apply").post((req: Request, res: Response): Promise<void> => {
  res.redirect(req.headers["referer"] || "/");
  return process.exit(0);
});

r.route("/status").get((_, res: Response): Response => {
  const connections = tunnels.map(
    (i: any) =>
      new Object({
        clientId: i.clientId,
        subdomain: i.opts.subdomain,
        url: i.url,
        closed: i.closed,
      })
  );
  return res.status(200).json(connections);
});

r.route("/:id").get(async (req: Request, res: Response): Promise<Response> => {
  try {
    const tunnel: Tunnel = await db("tunnels").select("*").where("id", req.params.id).first();
    if (!tunnel) return res.sendStatus(404);
    return res.status(200).json(tunnel);
  } catch (e: any | Error) {
    log.error(e.message);
    return res.sendStatus(500);
  }
});

r.route("/:id/enable").patch(async (req: Request, res: Response): Promise<Response> => {
  try {
    const tunnel = await db("tunnels").select("enable").where("id", req.params.id).first();
    if (!tunnel) return res.sendStatus(404);
    await db("tunnels").update("enable", !tunnel.enable).where("id", req.params.id);
    return res.sendStatus(201);
  } catch (e: any | Error) {
    log.error(e.message);
    return res.sendStatus(500);
  }
});
r.route("/:id").post(async (req: Request, res: Response): Promise<Response | void> => {
  const { name, subdomain, host, port }: NewOrUpdateTunnel = req.body;
  try {
    const tunnel = await db("tunnels").select("id").where("id", req.params.id).first();
    if (!tunnel) res.sendStatus(404);
    await db("tunnels").update({ name, subdomain, host, port }).where("id", req.params.id);
    return res.redirect(req.headers["referer"] || "/");
  } catch (e: any | Error) {
    log.error(e.message);
    return res.sendStatus(500);
  }
});
r.route("/:id").delete(async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const tunnel = await db("tunnels").select("id").where("id", req.params.id).first();
    if (!tunnel) res.sendStatus(404);
    await db("tunnels").delete().where("id", req.params.id);
    return res.sendStatus(204);
  } catch (e: any | Error) {
    log.error(e.message);
    return res.sendStatus(500);
  }
});
export default r;
