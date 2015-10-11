/**
 * 模块依赖
 */

 var net = require('net');

/**
 * 追踪连接数
 */

 var count = 0,
     users = {};

 /**
  * 创建服务器
  */

  var server = net.createServer(function(conn) {
    // handle connection
    console.log('\033[90m    new connection!033[39m');
    conn.setEncoding('utf8');
    var nickname = '';
    conn.write(
        '\n > welcome to \033[92mnode-chat\033[39m!' +
        '\n >' + count + ' other people are connected at this time.' +
        '\n > please write your name and press enter: '
    );
    count++;

    function broadcast(msg, exceptMyself) {
        for(var i in users) {
            if(!exceptMyself || i != nickname) {
                users[i].write(msg);
            }
        }
    }

    conn.on('data', function(data) {
        // 清除回车
        data = data.replace('\r\n', '');

        //接收到的第一份数据应当是用户输入的昵称
        if(!nickname) {
            if(users[data]) {
                conn.write('\033[93m> nickname already in use. try again:\033[39m ');
                return;
            }else{
                nickname = data;
                users[nickname] = conn;

                for(var i in users ) {
                    broadcast('\033[90m > ' + nickname + ' joined the room\033[39m\n');
                }
            }
        }else{
            // 否则，视为聊天信息
            for(var i in users) {
                // 使用i ！= nickname 来确保消息只发送给除了自己以外的其他客户端
                if(i != nickname) {
                    broadcast('\033[96m > ' + nickname + ':\033[39m ' + data + '\n', true);
                }
            }
        }

    });

    conn.on('close', function() {
        count--;
        delete users[nickname];
        broadcast('\033[90m > ' + nickname + ' left the room\033[39m\n');
    });
  });

  /**
   * 监听
   */

   server.listen(3000, function() {
    console.log('\033[96m    server listening on *:3000\033[39m');
   });