<template>
    <div id = "power">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <p>Питание и сосотояние комнаты</p>
                    </div>

                    <div class="modal-body">
                        <button @click="PowerOn">Включить</button>
                        <button @click="PowerOff">Выключить</button>

                        <h2>Состояние модулей</h2>
                        <ul class = "list-modules">
                            <li v-for = "name_module in modules.name_modules">
                                <div class="modules">
                                    <p>{{ name_module.name }} </p>
                                    <button @click="HardReset(name_module.id)">Hard Reset</button>
                                </div>
                                
                            </li>
                        </ul>
                    </div>

                    <div class="modal-footer">
                        <button class="modal-default-button" @click="$emit('close')">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import io from 'socket.io-client'

export default {
    name: 'power',
    props:{
        modules:{
            type: Object
        }
    },
    methods: {
        PowerOn(){
            this.$socket.emit('PowerRoom', {
                power: true
            })
        },
        PowerOff(){
            this.$socket.emit('PowerRoom', {
                power: false
            })
        },
        HardReset(data){
            this.$socket.emit('HardReset', {
                module: data 
            })
        },
        mounted() {
            this.$socket.on('conect-node', (data)=>{
                console.log(data)
            }),
            this.$socket.emit('model-connect', {data: true})

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
    width: 700px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header h3 {
    margin-top: 0;
    color: #42b983;
    }
    .modal-header p{
        font-weight: bold;
        font-size: 20px
    }
    .modal-body {
    margin: 20px 0;
    }

    .modal-default-button {
    float: right;
    }

    .modal-footer{
        padding-bottom: 20px;
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
    .list-modules li{
        padding: 5px;
    }
    .modules{
        width: 250px;
        display: flex;
        justify-content: space-between;
    }
</style>
