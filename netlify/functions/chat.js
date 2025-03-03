let messages = [];

exports.handler = async (event) => {
    if (event.httpMethod === "POST") {
        const data = JSON.parse(event.body);
        if (data.message) {
            messages.push(data.message);
            if (messages.length > 50) messages.shift(); // Evitar demasiados mensajes
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    }

    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify(messages)
        };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
};
