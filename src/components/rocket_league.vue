<script setup>
import { storeToRefs } from "pinia";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();
const { user, shots, opponents } = storeToRefs(mainStore);

</script>

<template>
  <v-progress-linear :model-value="((user?.hitted?.length ?? 0) / shots.length) * 100" color="green" height="24"
    striped>{{ user?.hitted?.length }} / {{ shots.length }}</v-progress-linear>

  <v-card variant="text" class="mx-auto">
    <v-btn-toggle v-model="user.hitted" color="success" multiple class="btn-grid">
      <template v-for="shot in shots" :key="shot">
        <v-btn :value="shot" class="shot-btn" active-class="selected" rounded @click="mainStore.addShot()">
          {{ shot }}
        </v-btn>
      </template>
    </v-btn-toggle>
  </v-card>

  <v-card variant="text" class="mx-auto">
    <v-data-table hide-default-header hide-default-footer :items="opponents" :headers="[{
      title: 'Player',
      value: 'username'
    }, {
      title: 'Shots', key: 'hitted', value: item => `${item.hitted.length} / ${shots.length}`
    }]"></v-data-table>
  </v-card>
</template>

<style scoped>
.btn-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  height: auto;
  padding: 16px;
}

.shot-btn {
  min-width: 56px;
  height: 56px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 12px !important;
  padding: 8px;
  text-transform: uppercase;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.shot-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.shot-btn.selected {
  background-color: #4caf50 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.shot-btn:focus {
  box-shadow: 0 0 0 2px #81c784 !important;
}

.shot-btn:active {
  transform: scale(0.98);
}
</style>
