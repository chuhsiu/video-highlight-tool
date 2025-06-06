<template>
     <Suspense>
      <template #default>
        <Editor-Loader />
      </template>
      <template #fallback>
        <v-container>
            <v-row>
                <v-col>
                    <div class="border pa-4">
                        <h3>Transcript</h3>
                        <v-skeleton-loader
                            type="list-item-three-line"
                        ></v-skeleton-loader>
                        <v-skeleton-loader
                            type="list-item-three-line"
                        ></v-skeleton-loader>
                        <v-skeleton-loader
                            type="list-item-three-line"
                        ></v-skeleton-loader>
                    </div>
                </v-col>
                <v-col>
                    <div class="border pa-4">
                        <h3>Preview</h3>
                        <v-skeleton-loader
                            type="image"
                            class="ma-4">
                        </v-skeleton-loader>
                    </div>
                </v-col>
            </v-row>
        </v-container>
      </template>
      <template #error="{ error }">
        <v-alert type="error" color="error" icon="mdi-alert-circle">
          發生錯誤：{{ error.message }}
        </v-alert>
      </template>
    </Suspense>
</template>