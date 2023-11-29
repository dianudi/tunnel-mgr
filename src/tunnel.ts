import db from "./db.js";
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
    tunnels = await Promise.all(tunnelInstances);
    tunnels.forEach((tunn: any) => {
      tunn.on("error", (err: Error) => console.error(err));
    });
  }
} catch (error) {
  console.error(error);
}

export default tunnels;
