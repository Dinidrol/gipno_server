let cmd = require('node-cmd')

cmd.get(
    'mpg123 -a hw:1,0 /home/pi/server_room/music/music.mp3',
    (err, data, stderr)=>{
        if(err){
            return console.log(err)
        }
        console.log('Play music: ', data)
        console.log('Message: ', stderr)
    }
)