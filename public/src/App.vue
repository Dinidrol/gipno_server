<template>
  <div id="test" class="container">
    <div class="game-control">
      <div class="timer">
        <p>Текущее время:</p>
        <gamer-time :blink="true" :displaySeconds="true"></gamer-time>
      </div>
      <div class="time">
        <game-time :time="game_time"></game-time>
      </div>
      <div class="game-button">
        <button @click="startGame">Start Game</button>
        <button @click="pause">Pause Game</button>
        <button @click="stop">Stop Game</button>
        <button @click="skip">Skip Game</button>
        

        <button id="show-modal" @click="showModal = true">Power Room</button>
        <modal-power v-if="showModal" @close="showModal = false" :modules="games_room.modules"></modal-power>
        
        <button >Setting</button>
      </div>
    </div>
    <div class="game-tips">
      <p>Прохождение игры</p>
      <ul class="game">
          <li v-for = "game in games_room.stage" class="game_list">
              <group  :name_stage ="game.name" 
                      :order_stage="game.order_game" 
                      :current_stage="games_room.stage_order"
                      :stage="game" >
              </group>
          </li>
      </ul>
    </div>
    <chat></chat>
    <pre>{{ $data }}</pre>
  </div>
</template>

<script>
import Group from './componets/GroupTimer.vue'
import ModalPower from './componets/PowerManeger.vue'
import GamerTime from './componets/Time.vue'
import Chat from './componets/ChatTips.vue'
import GameTime from './componets/GamerTime.vue'

var games_room = {
      stage: [{
              name: "Emergensy_1",
              tips: [{
                      text: "Выставить крутилки",
                      time: '00:05',
                      id: 1,
                      work_time: false
                  },
                  {
                      text: "Выпить 100 грамм",
                      time: '00:05',
                      id: 2,
                      work_time: false
                  },
                  {
                      text: "Выпить 150 грамм",
                      time: '00:05',
                      id: 3,
                      work_time: false
                  },
                  {
                      text: "Выпить 200 грамм",
                      time: '00:05',
                      id: 4,
                      work_time: false
                  }
              ],
              order_game: 1,
              group_stage: false
          },
          {
              name: "Emergensy_2",
              tips: [{
                      text: "horosho",
                      time: '00:05',
                      id: 1,
                      work_time: false
                  },
                  {
                      text: "horosho",
                      time: '00:05',
                      id: 2,
                      work_time: false
                  },
                  {
                      text: "horosho",
                      time: '00:05',
                      id: 3,
                      work_time: false
                  },
                  {
                      text: "horosho",
                      time: '00:05',
                      id: 4,
                      work_time: false
                  }
              ],
              order_game: 2,
              group_stage: false
          },
          {
              name: "Emergensy_3",
              tips: [
                  {
                      text: "horosho",
                      time: '00:05',
                      id: 1
                  },
                  {
                      text: "horosho",
                      time: '00:05',
                      id: 2
                  },
                  {
                      text: "horosho",
                      time: '00:05',
                      id: 3
                  },
                  {
                      text: "horosho",
                      time: '00:05',
                      id: 4
                  }
              ],
              order_game: 3,
              group_stage: false
          }
      ],
      stage_order: 1,
      modules:{
        name_modules:[
          {
            name: 'Table',
            id: 1
          },
          {
            name: 'Musem',
            id:2
          },
                    {
            name: 'Table',
            id: 1
          },
          {
            name: 'Musem',
            id:2
          },
                    {
            name: 'Table',
            id: 1
          },
          {
            name: 'Musem',
            id:2
          },
                    {
            name: 'Table',
            id: 1
          },
          {
            name: 'Musem',
            id:2
          },
                    {
            name: 'Table',
            id: 1
          },
          {
            name: 'Musem',
            id:2
          }
          ,          {
            name: 'Table',
            id: 1
          },
          {
            name: 'Musem',
            id:2
          },
          {
            name: 'Table',
            id: 1
          },
          {
            name: 'Musem',
            id:2
          }],
        mubmer_modules: 14
      }
      
  }
        







export default {
  name: 'test',
  components: {
    Group,
    ModalPower,
    GamerTime,
    Chat,
    GameTime
  },
  data () {
    return {
      games_room: {},
      data: null,
      showModal: false,
      game_time: "60:00",
    }
  },
  created: function () {
      this.games_room = games_room
      this.$root.$on('WorkGroup', (data)=>{
          if(this.games_room.stage_order == data.group_stage) {
              this.games_room.stage_order +=1;
              this.$root.$emit('startGame', { game_status: true, groop_stage: this.games_room.stage_order })
          }
      })
  },
  methods:{
      startGame(){
          this.$root.$emit('startGame', { game_status: true, groop_stage: this.games_room.stage_order })
          this.$socket.emit('StartGame', {
            GameStatus: true
          })
      },
      skip(){
          this.$root.$emit('skipGroup', { skip_group: this.games_room.stage_order})
          this.games_room.stage_order += 1
          this.data = this.games_room.stage_order
          this.$root.$emit('startGame', { game_status: true, groop_stage: this.games_room.stage_order })
      },
      nextGroup(){

      },
      pause(){
          this.$root.$emit('pauseGame', { game_status: false })
          this.$socket.emit('PauseGame', {
            GameStatus: false
          })
      },
      stop(){
        this.$socket.emit('StopGame', {
          GameStatus: false
        })
      },
      gamertime(){
      }
  },
}
</script>
<style scoped>
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  .container{
    width: 1200px;
    margin: 20px auto;
    padding-bottom: 10px;
    padding-top: 5px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
    
  }
  .timer{
    margin-top: 10px;
  }
  .timer p{
    font-weight: bold;
    padding-left: 14px;
  }
  .time {
    margin-top: 10px;
  }
  .game-control{
    background-color: #ffffff;
    height: 135px;
    box-shadow: 0 22px 22px -22px grey;
    padding: 1px 10px 15px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    margin: 20px;
    border-radius: 0.7em;
    height: 100px;
    background-color: #e5e5e5;
  }
  /* button{
    text-decoration: none;
    text-transform: uppercase;
    background-color: #009688;
    text-align: center;
    color: #000;
    border-radius: 0.7em;
    height: 45px;
    width: 110px;
    margin-right: 5px;
  } */
  .game-tips{
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border-radius: 0.7em;
    background-color: #e5e5e5;
    margin: 20px;
  }
  .game-tips p{
    margin: 10px 0px 10px 14px;
    font-weight: bold;
  }
  .game{
    /* width: 700px; */
    height: 300px;
    position: relative;
    overflow: auto;
    background-color:#1561ba2b;
    margin: 5px 10px 30px;
    border-radius: 10px;
  }
  .game_list{
    padding: 5px 10px;
  }
  
  
</style>



