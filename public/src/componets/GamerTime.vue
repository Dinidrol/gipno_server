<template>
    <div id="game_timer">
        <div>
            <p>Время игры:</p>
            <span>{{ prettyTime | prettify }}</span> 
        </div>
    </div>
</template>
<script>
export default {
    name: 'game_timer',
    props: {
        time:{
            type: String,
            default: 'ERROR'
        }
    },
    data(){
        return{
            timerId: null,
            gameTime: this.convertTime(this.time),
            isRunning: false,
            seconds: null
        }
    },
    methods:{
        convertTime(ms){
            let a = ms.split(':')
            return ((a[0]*60)+(+a[1]))
        },
        startTime(){
            this.isRunning = true
            if(!this.timerId){
                this.timerId = setInterval(()=>{
                    if(this.gameTime>0){
                        this.gameTime--
                    } else {
                        clearInterval(this.timerId)
                    }
                }, 1000)
            }
        }
    },
    computed: {
        prettyTime(){
            let time = this.gameTime / 60
            let minutes = parseInt(time)
            let second = Math.round((time - minutes) *60)
            this.seconds = second
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
    },
    mounted: function(){
        this.$root.$on('startGame', (data)=>{
            if(data.game_status == true){
                this.startTime()
            }
        }),
        this.$root.$on('pauseGame', (data)=>{
            if(data.game_status == false){
                this.isRunning = false
                clearInterval(this.timerId)
                this.timerId = null
            }
        })
    }

}
</script>
<style scoped>
  .time p{
    font-weight: bold;
    
  }
  .time span{
    font-weight: bold;
    font-size: 35px;
  }
</style>
