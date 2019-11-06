<template>
    <div id ="group">
        <div class="controll">
            <p>{{ name_stage }}</p>
            <button @click="showModal = true">Изменить</button>
            <modal  v-show="showModal" 
                    @close="showModal = false"
                    :data_stage="stage"
                    >

            </modal>
        </div>
        <ul class="tips_list">
            <li v-for = "name in stage.tips">
                <timer :text="name.text" :time="name.time" :statustimer="name.work_time" :idtimer="name.id" :ident_group="stage.order_game"></timer>
            </li> 
        </ul>
            <!-- <ul class="tips_list">
                <li v-for = "name in stage.tips">
                    <timer :text="name.text" :time="name.time" :statustimer="name.work_time" :idtimer="name.id" :ident_group="game.order_game"> </timer>
                </li>
            </ul> -->
    </div>
</template>
<script>
import Timer from './Timer.vue'
import Modal from './EditTips.vue'

export default {
    name: 'group',
    components:{
        Timer,
        Modal
    },
    props: {
        name_stage:{
            type: String,
            default: 'ERROR'
        },
        order_stage: {
            type: Number,
            default: -1
        },
        current_stage: {
            type: Number,
            default: -1
        },
        stage_game: {
            type: Boolean,
            default: false
        },
        stage: {
            type: null
        }
    },
    data(){
        return{
            count_timer: 1,  
            showModal: false
        }
    },
    methods: {
        startNextTimer(){
            this.$root.$emit('startTimer',{ current_timer: this.count_timer, current_stage: this.order_stage })
        }
    },
    mounted() {
        this.$root.$on('startGame', (data)=>{
            if(data.groop_stage == this.order_stage && data.game_status == true ){
                this.$root.$emit('startTimer',{ current_timer: this.count_timer, current_stage: this.order_stage })
            }
        }),
        this.$root.$on('statusTimer', (data)=>{
            if(data.groop == this.order_stage && this.count_timer == data.id){
                this.count_timer +=1
                this.startNextTimer()
                if(this.count_timer == 5) {
                    this.$root.$emit('WorkGroup', { group_stage: this.order_stage })
                }
            }
        }),
        this.$root.$on('skipGroup', (data)=>{
            if(this.order_stage == data.skip_group){
                this.$root.$emit('stopTimer', { current_groop: this.current_stage })
            } 
        })     
    }
}
</script>
<style scoped>
p{
    margin: 0px;
    padding: 4px;
    font-weight: bold;
    text-transform: uppercase;
}
.controll{
    display: flex;
}
.tips_list{
    padding: 10px 0px 20px 40px;
  }
  .tips_list li{
    margin-bottom: 10px;
  }
  .tips_list li:last-child{
    margin-bottom: 0px;
  }
</style>
