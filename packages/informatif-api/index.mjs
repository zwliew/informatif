import app from "./app";

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Started on port ${PORT}`));
