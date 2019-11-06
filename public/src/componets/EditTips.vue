<template>
    <div id='modal'>
       <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
              <h1>Редактор подсказок</h1>
          </div>

          <div class="modal-body">
              <div class="edit">
                    <input v-if="editTips" v-model="data_stage.name" class="tips">
                    <p v-else>{{data_stage.name}}</p>
                    <button v-if="!editTips"  @click="edit(editTips)"> <i class="fas fa-pen"></i></button>
                    <button v-else @click="compliteEdit(editTips)">    <i class="fas fa-save"></i></button>
              </div>

              <ul class="text_tips">
                  <li v-for="(data,index) in data_stage.tips">
                        <div class="text">
                            <input v-if="editText" v-model="data.text" class="tips">
                            <p v-else>{{data.text}}</p>
                            <button v-if="!editText"  @click="edit(index)"> <i class="fas fa-pen"></i></button>
                            <button v-else @click="compliteEdit(index)">    <i class="fas fa-save"></i></button>
                        </div>
                        <div class="time">
                            <input v-if="editTime" v-model="data.time" class="tips">
                            <p v-else>{{data.time}}</p>
                            <button v-if="!editTime"  @click="edit(editTime)"> <i class="fas fa-pen"></i></button>
                            <button v-else @click="compliteEdit(editTime)">    <i class="fas fa-save"></i></button>
                        </div>
                    
                  </li>
              </ul>
          </div>

          <div class="modal-footer">
                <button>Сохранить</button>
                <button class="modal-default-button" @click="$emit('close')">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
export default {
    name: 'modal',
    props:{
        data_stage:{
            type: null
        }
    },
    data(){
        return{
            editTips: false,
            editText: false,
            editTime: false
        }
    },
    methods:{ 
        edit(data){
            console.log(data)
            data = true
        },
        compliteEdit(data){
            this.editTips = false
        }
    }
}
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h1 {
  margin-top: 0;
  font-weight: bold;
  text-transform: uppercase;
}

.modal-body {
  margin: 20px 0;
}
.edit {
    display: flex;
    margin: 5px 0px 5px;
}
.edit .tips{
    border-radius: 5px;
    outline: none;
    /* font-weight: bold; */
    font-style: italic;
}
.edit p{
    font-weight: bold;
}
.edit svg{
    margin-left: 10px;
    cursor: pointer;
    margin: 0px
}
.edit svg:hover{
    color: RoyalBlue;
}
.edit button{
    border: none;
    cursor: pointer;
    padding: 0px;
    font-size: 16px;
    background: none;
    outline: none;
    margin-left: 5px;
}
.text_tips li {
    display: flex;
    justify-content: space-between;
}
.text_tips li p{
    padding: 5px;
}
.text_tips li .time{
    display: flex;
}
.text_tips li .text{
    display: flex;
    justify-content: space-between;
    width: 230px;
}
.modal-default-button {
  float: right;
  background-color: none;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
