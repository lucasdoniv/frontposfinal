<template>
  <v-app-bar app color="white">
    <div class="d-flex align-center">
      <router-link to="/">
        <v-img alt="logo" class="shrink mr-2" contain src="../assets/icone.png" transition="scale-transition"
          width="100" />
      </router-link>
    </div>

    <v-spacer></v-spacer>

    <v-btn depressed color="white" font-color="black">
      <span class="mr-2 black--text">DEPOIMENTOS</span>
    </v-btn>

    <v-btn depressed color="white" font-color="black">
      <span class="mr-2 black--text">FALE CONOSCO</span>
    </v-btn>
    <v-btn depressed color="white" font-color="black">
      <span class="mr-2 black--text">SOBRE NÓS</span>
    </v-btn>

    <router-link to="/login" v-if="this.token == null">
      <v-btn depressed color="#CFCACA" font-color="black">
        <span class="mr-2 black--text">Login</span>
      </v-btn>
    </router-link>
    <v-btn depressed color="#CFCACA" font-color="black" @click="logout" v-else>
      <span class="mr-2 black--text">Logout</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Header',

  data: () => ({
    token: null
  }),

  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('typeUser');
      this.$router.go();
    }
  },


  beforeMount() {
    this.token = localStorage.getItem('token');
  },
}
</script>
