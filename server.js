var express = require('express');
var app = express();
var server = require('http').Server(app);
//socket io
var io = require('socket.io')(server);
//mqtt
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.1.131');
//gpio
var gpio = require('rpi-gpio')
var gpiop = gpio.promise;
//MongoDB
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
//verilables
var bPower = false;
var db;
//music
var MPlayer = require('mplayer')
var player = new MPlayer()
//Cmd
var cmd = require('node-cmd')
//varible
let GameStatus = false


//http Web page 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.post('/tips', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body);
    var tips = {
        name: req.body.name,
        text: req.body.text,
        node: req.body.node,
        time: req.body.time
    };
    db.collection('tips').insertOne(tips, function (err, result, ops) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log(result);
        res.send(tips);
    })
})
app.get('/tips', function (req, res) {
    db.collection('tips').find().toArray(function (err, docs) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
})
app.get('/tips/:id', function (req, res) {
    db.collection('tips').findOne({
        _id: ObjectID(req.params.id)
    }, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    })
})
app.put('/tips', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    db.collection('tips').findOneAndUpdate({
            _id: ObjectID(req.body.id)
        }, {
            $set: {
                name: req.body.name,
                text: req.body.text,
                node: req.body.node,
                time: req.body.time
            }
        }, {
            returnOriginal: false
        },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log(result.value);
            res.send(result.value);
        }
    )
})
app.delete('/tips/:id', function (req, res) {
    db.collection('tips').findOneAndDelete({
            _id: ObjectID(req.params.id)
        },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log(result.value);
            res.send(result.value);
        }
    )
})
//GPIO Raspberry
gpiop.setup(7, gpio.DIR_OUT)
    .then(() => {
        console.log('SolidRelay Export true');
        gpiop.write(7, false);
    })
    .catch((err) => {
        console.log('Error: ', err.toString());
    })



//music

//Mqtt connetct to nodes
client.on('connect', function () {
    //Subscribe Actions Node[s]
    //Tips Display
    client.subscribe('/TipsWebDisplay/Actions')
    client.subscribe('/IdentRoom1/Actions')
    client.subscribe('/Cabinet/Actions')
    client.subscribe('/Lungs/Actions')
    client.subscribe('/Applause/Actions')
    client.subscribe('/Volftar/Actions')
    client.subscribe('/CabinetMirrol/Actions')
    client.subscribe('/Knives/Actions')
    client.subscribe('/MagicianCabinet/Actions')
    client.subscribe('/Tobi/Actions')
    

    
    //Watch Conneted Node[s]
    //Tips Display
    client.subscribe('/TipsWebDisplay/Connected')  
    client.subscribe('/IdentRoom1/Connected')
    client.subscribe('/Cabinet/Connected')
    client.subscribe('/Lungs/Connected')
    client.subscribe('/Applause/Connected')
    client.subscribe('/Volftar/Connected')
    client.subscribe('/CabinetMirrol/Connected')
    client.subscribe('/Knives/Connected')
    client.subscribe('/MagicianCabinet/Connected')
    client.subscribe('/Tobi/Connected')
})

client.on('message', function (topic, message) {
    console.log(topic + " ");
    console.log(message.toString());
    //Game Ivents
    //First Game Room
    if (topic.toString() === '/TipsWebDisplay/Actions') {
        if (message.toString() === 'RFID-true') {
            client.publish('/IdentRoom1/Activated', 'TOG-true');
            client.publish('/MagicianCabinet','VIDEO-false');
            player.stop()
            PlayMusic({music: '../music/1st_room.mp3'})
            console.log("Passed Tug");
        }
    }

    if (topic.toString() === '/IdentRoom1/Actions') {
        if (message.toString() === 'TUG-true') {
            client.publish('/IdentRoom1/Activated', 'BUT-true');
            HeadPhoneMusic()
            console.log("Passed Button");
        }
    }

    if (topic.toString() === '/IdentRoom1/Actions') {
        if (message.toString() === 'POSTER-true') {
            client.publish('/IdentRoom1/Activated', 'RFID-true');
            console.log("Passed Poster Button and Activated RFID");
        }
    }

    if (topic.toString() === '/IdentRoom1/Actions') {
        if (message.toString() === 'IDENT-true') {
            client.publish('/Lungs/Activated', 'AUDIO-true');
            client.publish('/Cabinet/Activated', 'TUBES-true');
            console.log("Passed RFID and Activated Audio-Lungs, Tubes");
        }
    }

    if (topic.toString() === '/Cabinet/Actions') {
        if (message.toString() === 'TEST-true') {
            client.publish('/Cabinet/Activated', 'RFID-true');
            console.log("Passed RFID cabinet");
        }
    }

    if (topic.toString() === '/Cabinet/Actions') {
        if (message.toString() === 'IDENT-true') {
            client.publish('/Cabinet/Activated', 'TOG-true');
            console.log("Passed Tog");
        }
    }

    if (topic.toString() === '/Cabinet/Actions') {
        if (message.toString() === 'TOG-true') {
            player.stop()
            PlayMusic({music: './music/2nd_room_opening.mp3'})
            client.publish('/Applause/Activated', 'MIC-true');
            client.publish('/CabinetMirrol/Activated', 'HALL-true');
            console.log("Passed Mic");

            setTimeout(()=>{
                player.stop()
                PlayMusic({music: './music/2nd_room.mp3'})
            },20000)
        }
    }
    //Second Room Game
    if (topic.toString() === '/Applause/Actions') {
        if (message.toString() === 'NOISE-true') {
            client.publish('/Volftar/Activated', 'COIN_V-true')
            console.log("Passed NOISe");
        }
    }

    if (topic.toString() === '/Volftar/Actions') {
        if (message.toString() === 'COIN-true') {
            player.stop()
            PlayMusic({music: './music/1_wolf.mp3'})
            client.publish('/Volftar/Activated', 'WHEEL-true')
            console.log("Passed COIN");
            setTimeout(()=>{
                player.stop()
                PlayMusic({music: './music/2nd_room.mp3'}) 
            },12000)
        }
    }

    if (topic.toString() === '/Volftar/Actions') {
        if (message.toString() === 'ROTATED-true') {
            setTimeout(()=>{
                client.publish('/MagicianCabinet', 'RELAY-on')
            }, 10000)
            setTimeout(()=>{
                client.publish('/MagicianCabinet', 'VIDEO-true')
            }, 12000)
            console.log("Rotated wheel");
        }
    }

    if (topic.toString() === '/MagicianCabinet/Actions') {
        if (message.toString() === 'PLAY-true') {
            client.publish('/Train/Activated', 'LIGH-true')
            client.publish('/Tobi/Activated', 'TOBI-true')
            console.log("Cabinet Demons");
            setTimeout(()=>{
                client.publish('/MagicianCabinet', 'RELAY-off')
            },8000)
        }
    }

    if (topic.toString() === '/Tobi/Actions') {
        if (message.toString() === 'HALL-true') {
            client.publish('/Volftar/Mosf', 'MOSF3-OFF')
            console.log("Tobi OK");
            setTimeout(()=>{
                client.publish('/Tobi/Relay', 'REL1-false')
            }, 60000)
        }
    }

    if (topic.toString() === '/CabinetMirrol/Actions') {
        if (message.toString() === 'HALL2-true') {
            player.stop()
            PlayMusic({music: './music/scream.mp3'})
            setTimeout(()=>{
                client.publish('/Volftar/Relay', 'REL1-true')
                client.publish('/Volftar/Mosf', 'MOSF1-ON')
                player.stop()
                PlayMusic({music: './music/2_wolf.mp3'})
            }, 10000)
            setTimeout(()=>{
                client.publish('/Knives/Relay', 'REL1-true')
                client.publish('/Knives/Activated', 'TOG-true')

                client.publish('/Volftar/Relay', 'REL1-false')
                client.publish('/Volftar/Mosf', 'MOSF1-OFF')

                player.stop()
                PlayMusic({music: './music/2nd_room.mp3'})
            }, 24000)
            console.log('Vofltar say')
        }
    }

    if (topic.toString() === '/Knives/Actions') {
        if (message.toString() === 'TOGGLE-true') {
            console.log("Knives OK");
            client.publish('/CabinetMirrol/Mosf', 'MOSF2-OFF')
        }
    }

    if(topic.toString() === '/CabinetMirrol/Actions'){
        if(message.toString() === 'HALL3-true'){
            client.publish('/Psychopath','VIDEO-true')
        }
    }




    //Connected Node-Modules
    if (topic.toString() === '/IdentRoom1/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Ident-Room1');
        }
    }

    if (topic.toString() === '/Cabinet/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Cabinet');
        }
    }

    if (topic.toString() === '/Lungs/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Lungs');
        }
    }

    if (topic.toString() === '/Applause/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Applause');
        }
    }

    if (topic.toString() === '/Volftar/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Volftar');
        }
    }

    if (topic.toString() === '/CabinetMirrol/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Cabinet-Mirrol');
        }
    }

    if (topic.toString() === '/Knives/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Knives');
        }
    }

    if (topic.toString() === '/Tobi/Connected') {
        if (message.toString() === 'true') {
            console.log('Connected Node - Ok');
            connectedNode('Tobi');
        }
    }

    if (topic.toString() === '/Train/Connected') {
        if (message.toString() === 'true') {
            connectedNode('Train');
        }
    }
})

//Socket IO
io.on('connection', function (socket) {
    console.info(`A user ${socket.id} connected to Socket IO.`)

    socket.on('ChatTips', function(data) {
	    console.log(data.message)
        io.emit('MESSAGE', data)
        client.publish('/TipsWebDisplay/TextInstans', data.message)
    }) 
    socket.on('TextTips', (data)=>{
        console.log(data)
    })
    socket.on('StartGame', function(data){
        console.log(data)
        if(!GameStatus && data.GameStatus == true){
            // PlayMusic({music: './music/music.mp3'})
            GameStatus = true
            client.publish('/TipsWebDisplay/Time', 'start')
        }else{
            // player.play()
            client.publish('/TipsWebDisplay/Time', 'start')
        }
    })
    socket.on('PauseGame',function(data){
        console.log(data)
        player.pause()
        client.publish('/TipsWebDisplay/Time', 'pause')
    })

    socket.on('StopGame',function(data){
        player.stop()
        client.publish('/TipsWebDisplay/Reload','')
        console.log(data)
    })

    socket.on('PowerRoom', function (data) {
        console.log(data)
        if (data.power == true) {
            gpiop.write(7, true);
            bPower = true;
        } else if (data.power == false) {
            gpio.write(7, false);
            bPower = false;
        }
    });
    socket.on('HardReset', (data)=>{
        console.log(data)
    })
    socket.on('SendTipsToServer', function (data) {
        const msg = data.data.toString();
        console.log(msg);
    })
    socket.on('model-connect', (data)=>{
        console.log(data)
    })
    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected from Socket IO. Reset All veribles`)
        GameStatus = false
        bPower = false
        gpio.write(7, false);
        player.stop()
    });
})

MongoClient.connect('mongodb://localhost:27017/tips', {
    useNewUrlParser: true 
    }, 
    function (err, database) {
    if (err) {
        return console.log(err);
    }
    db = database;
    console.log('DB started');
})

server.listen(8081);
process.on("SIGINT", function () {
    gpio.write(7, false);
    bPower = false;
    db.close();
    process.exit();
});

function connectedNode(data) {
    data = data.toString();
    io.emit('conect-node', {
        data: data
    });
    console.log('Connected Node - Ok');
}

//Music
function PlayMusic(data){
    player.on('start', console.log.bind(this, 'playback started'));
    player.openFile(data.music)
}

function HeadPhoneMusic(){
    cmd.get(
        'mpg123 -a hw:1,0  /home/pi/server_room/v1.2/music/1234_long.mp3',
        (err, data, stderr)=>{
            if(err){
                return console.log(err)
            }
            console.log('Play music: ', data)
            console.log('Message: ', stderr)
        }
    )
}