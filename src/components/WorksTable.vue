<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted } from 'vue';
import { reactive, ref } from 'vue';

let table = ref();
let dt;
let columns = reactive([
    { title: 'Typ', data: 'type' },
    { title: 'Názov práce', data: 'name', render: (data, type, row) => {
        return `<a onclick="showAbstract('${row.name}', '${row.abstract}')">${data}</a>`;
    }},
    { title: 'Vedúci práce', data: 'consultant' },
    { title: 'Pracovisko', data: 'workplace', searchable: false},
    { title: 'Program', data: 'program', searchable: false},
    { title: 'Zameranie', data: 'program-detail', searchable: false},
    { title: 'Obsadenosť', data: 'capacity', searchable: false},
    { title: 'Abstrakt', data: 'abstract', searchable: true, visible: false}
])

let clickedName = '';
let clickedAbstract = '';
let selectedType = 'BP';
let selectedWorkplace = '642';

onMounted(() => {
    dt = table.value.dt;
})

function showAbstract(name, abstract) {
    clickedName = name;
    clickedAbstract = abstract;
    document.getElementById('abstraktModal').style.display = 'block';
    document.getElementById('abstraktModal').innerHTML = `<h4>${clickedName}</h4><p>${clickedAbstract}</p>`;
}

function loadItems() {
    dt.ajax.url(`https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/works?${selectedWorkplace}?${selectedType}`).load();
}

</script>
<template>
    <v-container>
        <v-row>
            <v-select v-model="selectedType" :items="['BP', 'DP']" label="Vybrať typ práce"></v-select>
            <v-select  v-model="selectedWorkplace" :items="['642', '548', '549', '550', '816', '817', '818', '356']" label="Vybrať pracovisko"></v-select>
            <v-btn @click="loadItems">Načítať</v-btn>
        </v-row>
        <DataTable
            :ajax="{url:'https://node67.webte.fei.stuba.sk/zadanie2/api/api.php/works?642?BP'}"
            :columns="columns"
            class="table table-hover table-bordered table-striped"
            ref="table"
            :options="{paging: true, searching: true, ordering: true, responsive: true}"
            width="100%"
        />
        <div id="abstraktModal">
            <h4></h4>
            <p></p>
            <button @click="document.getElementById('abstraktModal').style.display = 'none'">Zavrieť</button>
        </div>
    </v-container>
</template>
<style scoped>
#abstraktModal {
    display: none;
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
    text-align: center;
}
</style>