import db from "./db.js";
import lt from "localtunnel";
import { Tunnel } from "./types.js";

try {
  let tunnels: Array<any> = [];
  const tunnelConfigs: Array<Tunnel> = await db("tunnels").select("*").where("enable", true);
  if (!tunnelConfigs) {
    process.exit(1);
  }
  tunnelConfigs.forEach((tunnel: Tunnel) => {
    tunnels.push(lt({ local_host: tunnel.host, port: tunnel.port, subdomain: tunnel.subdomain }));
  });
  const conns = await Promise.all(tunnels);
  conns.forEach((tunn: any) => {
    tunn.on("error", (err: Error) => console.error(err));
  });
} catch (error) {
  console.error(error);
}
