<template>
    <div id="timer">
        <span class="timer_area">
            <div class="timer_text">
                <span>Текст подсказки: <span class="text_style">{{ text }}</span></span>
                <span> Время срабатывания: <span class="text_style">{{ prettyTime | prettify }}</span></span>
            </div>
            <div class="timer_button" v-if="displayButton">
                <button @click="dropOnScreen">Send Tips</button>
                <button @click="startTimer">Start</button>
            </div> 
        </span>
    </div>
</template>
<script>
export default {
    name:'timer',
    props: {
        text:{
            type: String,
            default:"ERROR"
        },
        time:{
            type: String,
            default: "12:32"
        },
        interval: {
            type: Number,
            default: 1
        },
        statustimer: {
            type: Boolean,
            default: false
        },
        idtimer: {
            type: Number,
            default: -1
        },
        ident_group: {
            type: Number,
            default: -1
        }
    },   
    data(){
        return {
            timer: null,
            timeTimer: this.convertTime(this.time),
            displayButton: false,
            isConnected: false
        }
    },
    methods: {
        dropOnScreen(){
            console.log(this.text)
            this.$socket.emit('TextTips', {
                tips: this.text
            })
        },
        convertTime(ms){
            let a = ms.split(':')
            return ((a[0]*60)+(+a[1]))
        },
        startTimer(){
            this.timer = setInterval(this.onMutchTimer, this.interval*1000)
        },
        onMutchTimer(){
            this.timeTimer = this.timeTimer -= this.interval
            if(this.timeTimer <= 0){
                clearInterval(this.timer)
                console.log(this.text)
                this.timeTimer = 0,
                this.$root.$emit('statusTimer', { id:this.idtimer, groop: this.ident_group, status: "true"})
            }
        },
        skipTimer(){
            clearInterval(this.timer)
            this.timer = null
        }
    },
    mounted: function() {
        this.$root.$on('startTimer', (data)=>{
            
            if(data.current_timer == this.idtimer && data.current_stage == this.ident_group){
                this.startTimer()
            }
        })
        this.$root.$on('pauseGame', (data)=>{
            if(data.game_status == false){
                clearInterval(this.timer)
                this.timer = null
            }
        })
        this.$root.$on('stopTimer', (data)=>{ 
            if(this.idtimer == data.current_timer && this.ident_group == data.current_groop){
                this.skipTimer()
            } else if(this.ident_group == data.current_groop){
                this.skipTimer()
            }
        })
    },
    sockets:{
        connect(){
            this.isConnected = true
            this.$socket.emit('TextTips',{
                tips: 'gdfg'
            })
            console.log('Socket connected to Tips')
        },
        disconnected(){
            this.isConnected = false
            console.log('Socket disconnected from Tips')
        }
    },
    computed:{
        prettyTime(){
            let time = this.timeTimer / 60
            let minutes = parseInt(time)
            let second = Math.round((time - minutes) *60)
            return minutes+":"+second
        }
    },
    filters:{
        prettify : function(value) {
			  let data = value.split(':')
			  let minutes = data[0]
			  let secondes = data[1]
			  if (minutes < 10) {
					minutes = "0"+minutes
			  }
			  if (secondes < 10) {
					secondes = "0"+secondes
			  }
			  return minutes+":"+secondes
		 }
    }    
}
</script>
<style scoped>
p{

    margin: 0px;
}
    .timer_area{
        display: flex;
    }
    .timer_area p{
        font-weight: bold;
    }
    .timer_button{
        padding-left: 20px
    }
    .timer_text{
        display: flex;
        flex-direction: column;
        width: 300px;
    }
    .text_style{
        font-style: italic;
    }
</style>
