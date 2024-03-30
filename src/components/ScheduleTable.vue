<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const headers = [
    { title: 'Názov', value: 'name' },
    { title: 'Deň', value: 'day' },
    { title: 'Čas', value: 'time' },
    { title: 'Typ', value: 'type', sortable: false },
    { title: 'Prednášajúci', value: 'lecturer', sortable: false },
    { title: 'Miestnosť', value: 'room', sortable: false },
    { title: 'Akcie', value: 'actions', sortable: false }
]
let data = reactive([])
let form = ref(false)
let editedItem = reactive({
    name: '',
    day: '',
    time: '',
    type: '',
    lecturer: '',
    room: ''
})
let editForm = ref(false)
let formData = reactive({
    name: '',
    day: '',
    time: '',
    type: '',
    lecturer: '',
    room: ''
})

let formSelectValue = ref('')

let rules = {
    name: [
        v => {
            if (!v || v.length === 0) {
                return 'Názov je povinný';
            }
            if (v.length < 3) {
                return 'Názov musí mať aspoň 3 znaky';
            }
            return true;
        }
    ],
    day: [
        v => {
            if (!v || v.length === 0) {
                return 'Deň je povinný';
            }
            if (v.length < 2) {
                return 'Deň musí mať aspoň 3 znaky';
            }
            return true;
        }
    ],
    time: [
        v => {
            if (!v || v.length === 0) {
                return 'Čas je povinný';
            }
            if (!/^\d{2}.\d{2} - \d{2}.\d{2}$/.test(v)) {
                return 'Neplatný formát času. Očakávaný formát je HH.MM - HH.MM';
            }
            //check form time validity
            return true;
        }
    ],
    type: [
        v => {
            if (!v || v.length === 0) {
                return 'Typ je povinný';
            }
            if (v.length < 2) {
                return 'Typ musí mať aspoň 3 znaky';
            }
            return true;
        }
    ],
    lecturer: [
        v => {
            if (!v || v.length === 0) {
                return 'Prednášajúci je povinný';
            }
            if (v.length < 3) {
                return 'Prednášajúci musí mať aspoň 3 znaky';
            }
            return true;
        }
    ],
    room: [
        v => {
            if (!v || v.length === 0) {
                return 'Miestnosť je povinná';
            }
            if (v.length < 4) {
                return 'Miestnosť musí mať aspoň 4 znaky';
            }
            return true;
        }
    ],
    select: [
        v => !!v || 'Vyberte typ alebo zadajte iný typ a vyplňte pole "Uveďte"!'
    ]
}

function getSchedule(){
    axios.get('https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/schedule')
        .then(response => {
            data = []
            data = response.data.data
            document.querySelector('#scheduleBody').innerHTML = ''
            if(data.length == 0){
                let row = document.createElement('tr');
                let cell = document.createElement('td');
                cell.colSpan = headers.length;
                cell.textContent = 'Žiadne dáta';
                row.appendChild(cell);
                document.querySelector('#scheduleBody').appendChild(row);
            } else {
                data.forEach(activity => {
                    let row = document.createElement('tr');
                    headers.forEach(header => {
                        let cell = document.createElement('td');
                        cell.textContent = activity[header.value];
                        row.appendChild(cell);
                    });
                    let actions = document.createElement('td');
                    let editButton = document.createElement('button');
                    editButton.classList.add('mr-2');
                    editButton.textContent = 'Upraviť';
                    editButton.addEventListener('click', () => {
                        editedItem = activity
                        editForm.value = true
                    });
                    let deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Vymazať';
                    deleteButton.addEventListener('click', () => {
                        axios.delete('https://node67.webte.fei.stuba.sk/zadanie2/api/schedule.php/activity', { data: { id: activity.id } })
                            .then(response => {
                                console.log(response)
                                getSchedule()
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    });
                    actions.appendChild(editButton);
                    actions.appendChild(deleteButton);
                    row.appendChild(actions);
                    document.querySelector('#scheduleBody').appendChild(row);
                });
            }
            
        })
        .catch(error => {
            console.log(error)
        })
}
function showForm(){
    form.value = true;
}
function hideForm(){
    let myForm = document.getElementById('addScheduleForm')
    myForm.reset()
    form.value = false
}
function hideEditForm(){
    let editForm = document.getElementById('updateActivityForm')
    editForm.reset()
    editForm.value = false
}

function sendForm(){
    let myForm = document.getElementById('addScheduleForm')
    if (!myForm.checkValidity()) {
        return
    }
    if(formSelectValue.value != 'Iné'){
        formData.type = formSelectValue.value
    }
    axios.post('https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/schedule', formData)
        .then(response => {
            console.log(response)
            hideForm()
            getSchedule()
        })
        .catch(error => {
            console.log(error)
        })
    hideForm()
}
function deleteSchedule(){
    axios.delete('https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/schedule')
        .then(response => {
            console.log(response)
            document.querySelector('#scheduleBody').innerHTML = ''
        })
        .catch(error => {
            console.log(error)
        })
}
function updateAcitity(){
    let myForm = document.getElementById('updateActivityForm')
    if (!myForm.checkValidity()) {
        return
    }
    axios.put('https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/activity', editedItem)
        .then(response => {
            console.log(response)
            hideEditForm()
            getSchedule()
        })
        .catch(error => {
            console.log(error)
        })
    hideEditForm()
}
</script>
<template>
    <v-container>
        <v-row>
            <v-col class="text-center">
                <v-btn color="teal-darken-1" @click="getSchedule">Načítať rozvrh</v-btn>
            </v-col>
            <v-col class="text-center">
                <v-btn color="light-blue-darken-1" @click="showForm">Pridať rozvrhovú akciu</v-btn>
            </v-col>
            <v-col class="text-center">
                <v-btn color="red-darken-3" @click="deleteSchedule">Vymazať rozvrh</v-btn>
            </v-col>
        </v-row>
    </v-container>
    <v-container>
        <v-row class="justify-center" v-if="form">
            <v-form id="addScheduleForm" @submit="sendForm">
                <v-row class="justify-center">
                    <v-col cols="4">
                        <v-text-field :rules="rules.name" label="Názov" v-model="formData.name" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field :rules="rules.day" label="Deň" v-model="formData.day" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field :rules="rules.time" label="Čas" v-model="formData.time" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-select v-model="formSelectValue" :rules="rules.select" label="Typ" :items="['Prednáška', 'Cvičenie', 'Iné']" required></v-select>
                    </v-col>
                    <v-col cols="4" v-if="formSelectValue == 'Iné'">
                        <v-text-field :rules="rules.type" label="Uveďte" v-model="formData.type" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field :rules="rules.lecturer" label="Prednášajúci" v-model="formData.lecturer" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field :rules="rules.room" label="Miestnosť" v-model="formData.room" required></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-btn type="submit" color="teal-darken-1" class="w-100">Pridať</v-btn>
                    </v-col>
                    <v-col cols="4">
                        <v-btn color="red-darken-3" class="w-100" @click="hideForm">Zrušiť</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-table>
                    <thead>
                        <tr>
                            <th v-for="header in headers" :key="header.value">
                                {{ header.title }}
                            </th>
                        </tr>
                    </thead>
                    <tbody id="scheduleBody">
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
        <v-row class="justify-center" v-if="editForm">
            <v-form id="updateActivityForm" @submit="updateAcitity">
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Názov" :rules="rules.name" v-model="editedItem.name"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="Deň" :rules="rules.day" v-model="editedItem.day"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="Čas" :rules="rules.time" v-model="editedItem.time"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="Typ" :rules="rules.type" v-model="editedItem.type"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="Prednášajúci" :rules="rules.lecturer" v-model="editedItem.lecturer"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field label="Miestnosť" :rules="rules.room" v-model="editedItem.room"></v-text-field>
                    </v-col>
                </v-row>
                <v-btn color="blue-darken-1" @click="hideEditForm">Zrušiť</v-btn>
                <v-btn type="submit" color="red-darken-1">Uložiť</v-btn>
            </v-form>
        </v-row>
    </v-container>
</template>
<style scoped>
</style>