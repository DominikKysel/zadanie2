<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted } from 'vue';
import { reactive, ref } from 'vue';
import * as bootstrap from 'bootstrap';

let table = ref();
let dt;
let columns = reactive([
    { title: 'Typ', data: 'type' },
    { title: 'Názov práce', data: 'name', render: (data, type, row) => {
        let escapedName = encodeURIComponent(row.name.replace(/\\/g, '\\\\').replace(/\n/g, '&#10;').replace(/\r/g, '&#13;').replace(/"/g, '&quot;'));
        let escapedAbstract = encodeURIComponent(row.abstract.replace(/\\/g, '\\\\').replace(/\n/g, '&#10;').replace(/\r/g, '&#13;').replace(/"/g, '&quot;'));
        return `<a onclick="javascript:window.showAbstract('${escapedName}', '${escapedAbstract}')">${data}</a>`;
    }, searchable: true},
    { title: 'Vedúci práce', data: 'consultant' },
    { title: 'Pracovisko', data: 'workplace', searchable: false},
    { title: 'Program', data: 'program', searchable: false},
    { title: 'Zameranie', data: 'program-detail', searchable: false},
    { title: 'Obsadenosť', data: 'capacity', searchable: false},
    { title: 'Abstrakt', data: 'abstract', searchable: true, visible: false}
])

let rules = ref({
    selectedType: [
        v => !!v || 'Vyberte typ práce',
    ],
    selectedWorkplace: [
        v => !!v || 'Vyberte pracovisko',
    ]
})

let clickedName = ref(String)
let clickedAbstract = ref(String)
let selectedType = ref('')
let selectedWorkplace = ref('')

onMounted(() => {
    dt = table.value.dt;
})

function showAbstract(name, abstract) {
    clickedName.value = decodeURIComponent(name).replace(/&#10;/g, '<br/>');
    clickedAbstract.value = decodeURIComponent(abstract).replace(/&#10;/g, '<br/>');
    document.getElementById('abstraktModal').style.display = 'block';
}

function loadItems() {
    let myForm = document.getElementById('selectWorkplaceForm')
    if (!myForm.checkValidity()) {
        return;
    }
    //put loading to dt table while fetching data
    dt.clear().draw();
    //Add loading text to table to footer
    dt.rows.add([{name: 'Loading...', type: '', consultant: '', workplace: '', program: '', 'program-detail': '', capacity: '', abstract: ''}]).draw();
    //Load data from API
    dt.ajax.url(`https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/works?${selectedWorkplace.value}?${selectedType.value}?`).load();
}

function hideAbstract() {
    document.getElementById('abstraktModal').style.display = 'none';
}

window.showAbstract = showAbstract;

</script>
<template>
    <v-container>
        <v-row class="justify-center w-100">
            <v-col cols="12">
                <v-form id="selectWorkplaceForm" @submit.prevent>
                    <v-row class="justify-center">
                        <v-col cols="4">
                            <v-select v-model="selectedType" :rules="rules.selectedType" :items="['BP', 'DP']" label="Vybrať typ práce" class="mr-3" required></v-select>
                        </v-col>
                        <v-col cols="4">
                            <v-select  v-model="selectedWorkplace" :rules="rules.selectedWorkplace" :items="['642', '548', '549', '550', '816', '817', '818', '356']" label="Vybrať pracovisko" class="mr-3" required></v-select>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="teal-darken-1" class="w-100" @click="loadItems">Načítať</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <DataTable
            :ajax="{url:'https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/works?642?BP?'}"
            :columns="columns"
            class="table table-hover table-bordered table-striped"
            ref="table"
            :options="{paging: true, searching: true, ordering: true, responsive: true}"
            width="100%"
        />
        <div id="abstraktModal">
            <div id="abstraktContent">
                <h4 v-html="clickedName"></h4>
                <p v-html="clickedAbstract"></p>
            </div>
            <v-btn @click="hideAbstract">Zavrieť</v-btn>
        </div>
    </v-container>
</template>
<style scoped>
@import 'datatables.net-bs5';

#abstraktModal {
    display: none;
    position: fixed;
    z-index: 100;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.6);
    text-align: center;
}
#abstraktContent {
    margin: 5% auto;
    padding: 20px;
    width: 80%;
    background: black;
    border-radius: 15px;
}
#abstraktContent p {
    text-align: justify;
}

</style>