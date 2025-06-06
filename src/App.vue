<template>
  <v-app>
    <v-main> 
      <v-toolbar density="compact">
        <router-link to="/"><v-btn icon="mdi-home" color="grey"></v-btn></router-link>
        <v-toolbar-title text="Highlight Tool"></v-toolbar-title>
      </v-toolbar>
      <router-view />
    </v-main>
  </v-app>
</template>