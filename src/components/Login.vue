<template>
  <v-container>
    <v-alert :type="typeAlert" :value="alert" transition="fade-transition">
      {{ messageAlert }}
    </v-alert>
    <v-row no-gutters justify="center" v-if="this.loading === true">
      <v-progress-circular indeterminate color="primary" :size="70" :width="7" class="mt-8 mb-8">
      </v-progress-circular>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-img src="../assets/car-login.png" class="mt-12"></v-img>
      </v-col>

      <v-col cols="6">
        <h1 style="text-align: center" class="pt-5">Acesse sua conta</h1>

        <v-form ref="form" v-model="valid" lazy-validation>

          <v-text-field v-model="user.email" :rules="emailRules" label="E-mail" required></v-text-field>

          <v-text-field v-model="user.password" :rules="passwordRules" type='password' label="Senha" required>
          </v-text-field>

          <v-row class="pt-3 pl-3">
            <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">
              Entrar
            </v-btn>
            <p>Não tem uma conta? <router-link to="/register"><span class="font-weight-bold">Crie a sua</span>
              </router-link>
            </p>
          </v-row>


        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: 'Login',
  data: () => ({
    valid: true,
    user: {},
    emailRules: [
      v => !!v || 'E-mail é obrigatório',
      v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
    ],
    passwordRules: [
      v => !!v || 'Senha é obrigatória'
    ],
    select: null,
    alert: false,
    typeAlert: 'error',
    messageAlert: '',
    loading: false,
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        axios.post('https://posdblucas.herokuapp.com/api/login', this.user).then((res) => {
          this.loading = true;
          console.log(res);
          if (res.data.token != undefined) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('typeUser', res.data.user.type);
            this.$router.go()
          }
        }).catch((error) => {
          console.log(error.response.data.message);
          this.typeAlert = "error";
          this.messageAlert = error.response.data.message;
          this.showAlert();
        });

      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    showAlert() {
      this.alert = true;
      if (this.timer != 0) {
        window.clearTimeout(this.timer);

      }

      this.timer = window.setTimeout(() => {
        this.alert = false;
      }, 6000);
    },
  },

  async created() {
    if (localStorage.getItem('token') != null) {
      this.$router.push('/')
    }
  },
}
</script>
