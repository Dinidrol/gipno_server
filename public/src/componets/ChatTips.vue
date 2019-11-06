<template>
    <div class="tips">
      <div class="tips-area">
          <p>Мгновенные подсказки</p>
          <form @submit.prevent="sendMessage" @reset="cleanForm" class="form_input">
            <textarea type="text" placeholder="Введите текст..." v-model="message" cols="40" rows="5"></textarea>
            <div class="tips-control">
                <button type="submit">Отправить</button>
                <button type="reset">Очистить</button>
            </div>
          </form>
      </div>
      <div class="history">
        <p>История мгновенных подсказок</p>
        <ul class = "history-tips">
          <li v-for= "(msg, index) in messages" :key="index">{{index+1}}: {{ msg.message }} <button @click="edit(msg.message)">Редактировать</button></li>
        </ul>
      </div>
    </div>
</template>
<script>

export default {
    data(){
        return{
            message: '',
            messages: [],
            messageedit: '',
            isConnected: false
        }
    },
    methods: {
        sendMessage(e){
            e.preventDefault()
            this.$socket.emit('ChatTips', {
                message: this.message
            })
            this.message = ''           
        },
        cleanForm(){
            this.message = ''
        },
        edit(data){
            console.log(data)
            this.message = data
        }
    },
    sockets:{
        connect(){
            this.isConnected = true
            console.log('Socket connected to Chat')
        },
        disconnected(){
            this.isConnected = false
            console.log('Socket disconnected from Chat')
        },
        MESSAGE(data){
            this.messages = [...this.messages, data]
            
        }
    }
}
</script>
<style scoped>
    .tips{
        display: flex;
        justify-content: space-between;
        border-radius: 0.7em;
        background-color: #e5e5e5;
        margin: 20px 20px 0px 20px;
    }
    .tips-area{
        margin: 5px 10px 25px;
    }
    .tips-area p{
        font-weight: bold;
        padding-top: 5px;
        margin: 10px 0px 10px 2px;
    }
    .tips-control{
        margin-top: 5px;
    }
    .history-tips{
        overflow: auto;
        width: 700px;
        height: 150px;
        background-color: #1561ba2b;
        border-radius: 10px;
        margin: 5px 25px 25px;
        padding: 5px 10px 5px;
    }
    .history p{
        font-weight: bold;
        padding-top: 5px;
        margin: 10px 0px 10px 14px;
    }
    .form_input{
        display: flex;
        flex-direction: column;
    }
    button{
        width: 100px;
        height: 20px;
    }
    li{
        display: flex;
        padding: 5px;
    }
    .history p{
        margin-left: 28px;
    }
</style>
