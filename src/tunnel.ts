import db from "./db.js";
import log from "./log.js";
import { Tunnel } from "./types.js";
import lt from "localtunnel";

let tunnels: any[] = [];
try {
  let tunnelInstances: Array<any> = [];
  const tunnelList: Array<Tunnel> = await db("tunnels").select("*").where("enable", true);
  if (tunnelList) {
    tunnelList.forEach((tunnel: Tunnel) => {
      tunnelInstances.push(lt({ local_host: tunnel.host, port: tunnel.port, subdomain: tunnel.subdomain }));
    });
    tunnels.forEach((tunn: any) => {
      tunn.on("error", (e: Error) => log.error(e.message));
    });
    tunnels = await Promise.all(tunnelInstances);
  }
} catch (e: any | Error) {
  log.error(e.message);
}

export default tunnels;
