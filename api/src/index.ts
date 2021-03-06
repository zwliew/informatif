import { config } from "dotenv";

config();

import app from "./app";

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Started on port ${PORT}`));
