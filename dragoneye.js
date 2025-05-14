const {Dragoneye} = require('dragoneye-node');
async function verify() {

    const file = 'photo.jpg';
    const dragoneyeClient =new  Dragoneye({
        apiKey: "lKtySX1v9lWOeRe1ac2JWHjx6Vlkx_Z3MQfnGjk7nyjo5vmlnXV2FPjSSHKHtC-qdJ7SvXE2FTw0kkq2jhOXPjSNLcNyxREWyCLuOZmJYSiRqHZYILi_QDeq-aQ7IbT4WbvTRPZwl8zvvlptiI6YOLYayObNP_CSEQWoOj-ED6c=RE"
    });

    const results = await dragoneyeClient.classification.predict({
        image: {
            blob: file
        },
        modelName: "dragoneye/animal"
    });
}

verify();