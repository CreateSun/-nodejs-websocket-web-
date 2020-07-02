const ws = require('nodejs-websocket');

const connPool = [];

const service = function (conn) {
    conn.on('text', function (mess) {
        mess = JSON.parse(mess);
        if (mess.code === 1) {
            let message = '<p style=\\"font-size: 10px; color: grey; text-align: center\\">' +
                mess.name + "加入了聊天 </p>";
            boardCast(`{"content":"${message}"}`);
            // 创建连接对象 保存自己的信息
            let newConn = {
                name: mess.name,
                conn: conn
            };
            connPool.push(newConn)
        } else if (mess.code === 10) {
            console.log(mess.name + "发消息给" + mess.target + "\n");
            let connection = single(mess.target, connPool);
            console.log(connection)
            connection.sendText(`{"content":"${mess.text}"}`)
        } else {
            let message = '<p>' + mess.name + ":" + mess.text + '</p>';
            boardCast(`{"content":"${message}"}`)
        }
    });
    conn.on('connection', function (conn) {
        let newConn = {
            name: mess.name,
            conn: conn
        };
        connPool.push(newConn)
    });
    conn.on('error', function (error) {
        console.log('错误：' + error)
    })
};

const server = ws.createServer(function (conn) {
    boardCast(`{"client": "${server.connections.length}"}`);
    service(conn);
}).listen(443);

/**
 * 单聊
 * @param {*} target
 * @param {*} pool
 */
let single = function (target, pool) {
    let targetConn = null;
    pool.forEach(function (conn, index) {
        if (conn.name === target) {
            console.log(conn.conn)
            targetConn = conn.conn
        }
    });
    return targetConn;
};

/**
 * 广播发送消息
 * @param {string} str
 */
let boardCast = function (str) {
    server.connections.forEach(function (conn, index) {
        conn.sendText(str)
        // console.log(connPool[0] && connPool[0].conn)
    })
};
