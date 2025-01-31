import app from "./app";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`);
});

