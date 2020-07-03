const ws = require('nodejs-websocket');

//在线用户连接池
let connPool = [];
//所有用户连接池
let userPool = [];
//群组连接池
let groupPool = [];

const service = function (conn) {
    conn.on('text', function (mess) {
        mess = JSON.parse(mess);
        if (mess.code === 1) {
            let message = '<p style=\\"font-size: 10px; color: grey; text-align: center\\">' +
                mess.name + "登录成功 </p>";
            boardCast(`{"notice":"${message}"}`);
            // 创建连接对象 保存自己的信息
            let newConn = {
                name: mess.name,
                conn: conn
            };
            connPool.push(newConn)
        } else if (mess.code === 10) {
            let connection = single(mess.target, connPool);
            connection.code === 200 && connection.conn.sendText(`{"content":"${mess.text}", "name": "${mess.name}"}`);
            connection.code === 404 && boardCast(`{"notice": "<p style='font-size: 10px; color: grey; text-align: center'>消息发送失败</p>"}`)
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
    let targetConn = {
        code: 403,
        conn: null,
    };
    pool.forEach(function (conn, index) {
        if (conn.name === target) {
            targetConn.code = 200;
            targetConn.conn = conn.conn;
        }
        if (index===pool.length-1 && targetConn.code === 403) targetConn.code = 404;
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
    })
};
