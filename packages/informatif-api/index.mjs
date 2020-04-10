import app from "./app/index.mjs";

const { PORT } = process.env;
app.listen(PORT, () => console.log(`Started on port ${PORT}`));
