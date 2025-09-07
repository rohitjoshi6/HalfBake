const net = require("net");
const host = process.env.MYSQL_HOST || "mysql";
const port = Number(process.env.MYSQL_PORT || 3306);

function check() {
  return new Promise((resolve) => {
    const s = net.createConnection(port, host);
    s.on("connect", () => { s.end(); resolve(true); });
    s.on("error", () => resolve(false));
  });
}

(async () => {
  while (!(await check())) {
    console.log(`waiting for mysql at ${host}:${port}...`);
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log("mysql is up.");
})();
