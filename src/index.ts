import express from "express";
import { spawn } from "node:child_process";
import routes from "./routes.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.disable("x-powered");
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(3000, () => console.log("App running"));

process.on("exit", function () {
  spawn(process.argv.shift() || "", process.argv, {
    cwd: process.cwd(),
    detached: true,
    stdio: "inherit",
  });
});
