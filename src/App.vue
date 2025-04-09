<script setup>
import { useMainStore } from "@/stores/main";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const links = useRouter()
  .getRoutes()
  .filter(route => route.name)
  .map(route => route.name);

const mainStore = useMainStore();
const { shots, user, discord, loading } = storeToRefs(mainStore);
const minLoadingTime = 1500; // Minimum time for spinner to be visible in milliseconds (2 seconds)
const loadingWithDelay = ref(true); // This will track the visibility of the spinner with the delay

// Watch the loading state to add delay
watch(loading, (newLoading) => {
  if (newLoading) {
    loadingWithDelay.value = true;
  } else {
    setTimeout(() => {
      loadingWithDelay.value = false;
    }, minLoadingTime);
  }
});
</script>

<template>
  <v-app id="inspire">
    <v-app-bar class="px-3" density="compact" flat>
      <v-avatar class="hidden-md-and-up" color="grey-darken-1" size="32"></v-avatar>

      <v-btn class="discord-btn" :prepend-icon="discord ? 'mdi-logout' : 'mdi-discord'"
        :color="discord ? 'red-darken-1' : 'indigo-darken-4'" variant="flat" rounded
        @click="discord ? mainStore.discordLogout() : mainStore.discordLogin()">
        {{ discord ? 'Logout' : 'Login with Discord' }}
      </v-btn>

      <v-spacer></v-spacer>

      <v-tabs align-tabs="center" color="grey-darken-2">
        <v-tab v-for="link in links" :key="link" :text="link" :to="{ name: link }"></v-tab>
      </v-tabs>
      <v-spacer></v-spacer>

      <div v-if="discord" class="d-flex align-center ga-2 pr-2">
        <v-avatar size="32" :image="discord.user_metadata.avatar_url" />
        <span class="font-weight-medium text-truncate" style="max-width: 120px;">
          {{ discord.user_metadata.custom_claims.global_name ?? discord.user_metadata.full_name }}
        </span>
      </div>
    </v-app-bar>

    <div v-if="loadingWithDelay" class="d-flex justify-center align-center" style="width: 100%; height: 100vh;">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div class="d-flex flex-column mt-12 align-center" style="width: 100%; height: 100vh;" v-else>
      <router-view></router-view>
    </div>

  </v-app>
</template>

<style scoped>
.discord-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: background-color 0.3s;
  box-shadow: 0 2px 8px rgba(88, 101, 242, 0.4);
}

.discord-btn:hover {
  filter: brightness(1.1);
}
</style>
