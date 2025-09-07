import { createServer } from "./server.js";
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

const app = createServer();
app.listen(port, () => {
  console.log(`HalfBake API listening on http://localhost:${port}`);
});
