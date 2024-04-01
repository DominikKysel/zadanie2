/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '@/router'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-plugins/api/processing().mjs'

DataTable.use(DataTablesCore)

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .component('DataTable', DataTable)
}
