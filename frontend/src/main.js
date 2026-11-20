import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import BaseSelect from './components/BaseSelect.vue';
import { useTicketStore } from './stores/ticketStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Globally register modern BaseSelect component
app.component('BaseSelect', BaseSelect);

// Auto-sync ticketStore changes to localStorage
const ticketStore = useTicketStore();
ticketStore.$subscribe(() => {
  ticketStore.persistState();
}, { detached: true });

app.mount('#app');
