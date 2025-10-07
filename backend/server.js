const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes.js");
const messageRoute = require("./routes/messageRoutes.js");
const ConversationRoute = require("./routes/conversationRoutes.js");
const errorHandler = require("./middleware/errorMiddleware.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socketio/socket.js");
const connect = require("./database/db");
dotenv.config();
connect();
const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173", //needed for cookies
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//socket.io setup
const server = http.createServer(app);
initSocket(server);

app.use(`/${process.env.api}/users`, userRoutes);
app.use(`/${process.env.api}/messages`, messageRoute);
app.use(`/${process.env.api}/conversations`, ConversationRoute);

app.use(errorHandler);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
