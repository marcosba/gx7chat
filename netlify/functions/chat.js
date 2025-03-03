const { Server } = require("ws");

let clients = [];

exports.handler = async (event, context) => {
    if (!global.websocketServer) {
        global.websocketServer = new Server({ noServer: true });

        global.websocketServer.on("connection", (ws) => {
            if (clients.length >= 20) {
                ws.send("El chat está lleno. Intenta más tarde.");
                ws.close();
                return;
            }

            clients.push(ws);
            console.log("Nuevo usuario conectado. Total: " + clients.length);

            ws.on("message", (message) => {
                clients.forEach((client) => {
                    if (client !== ws && client.readyState === 1) {
                        client.send(message);
                    }
                });
            });

            ws.on("close", () => {
                clients = clients.filter((client) => client !== ws);
                console.log("Usuario desconectado. Total: " + clients.length);
            });
        });
    }

    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: "WebSocket server running",
        };
    }

    return {
        statusCode: 405,
        body: "Method Not Allowed",
    };
};
