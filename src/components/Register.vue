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
        <v-img src="../assets/car-register.png" class="mt-12"></v-img>
      </v-col>

      <v-col cols="6">
        <h1 style="text-align: center" class="pt-5">Realize seu cadastro</h1>

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field :rules="nameRules" label="Nome" v-model="user.name" required></v-text-field>

          <v-text-field v-model="user.email" :rules="emailRules" label="E-mail" required></v-text-field>

          <v-text-field v-model="user.password" :rules="passwordRules" type='password' label="Senha" required>
          </v-text-field>
          <v-text-field v-model="confirmPassword" :rules="[passwordConfirmationRule]" type='password'
            label="Confirmar senha" required></v-text-field>

          <v-row class="pt-3 pl-3">
            <v-btn :disabled="!valid" color="primary" class="mr-4" @click="validate">
              Cadastrar
            </v-btn>
            <p>Já possui um cadastro? <router-link to="/login"><span class="font-weight-bold">Faça seu login</span>
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
  name: 'Register',
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Nome é obrigatório'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail é obrigatório',
      v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido',
    ],
    passwordRules: [
      v => !!v || 'Senha é obrigatória'
    ],
    confirmPasswordRules: [
      v => !!v || 'Confirmar senha é obrigatória'
    ],
    confirmPassword: '',
    password: '',
    user: {},
    alert: false,
    typeAlert: 'error',
    messageAlert: ''
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        axios.post('https://posdblucas.herokuapp.com/api/users', this.user).then((res) => {
          this.loading = true;
          console.log(res);
          if (res.data.token != undefined) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('typeUser', res.data.user.type);
            this.$router.go()
          }
        }).catch((error) => {
          this.typeAlert = "error";
          if (error.response.data.message.email == "The email has already been taken.") {
            this.messageAlert = "Email já está sendo utilizado";

          } else {
            this.messageAlert = "Erro ao realizar cadastro";
          }
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

  computed: {
    passwordConfirmationRule() {
      return () => !this.confirmPassword ? 'Confirmar senha é obrigatória' : (this.user.password === this.confirmPassword) || 'Senhas devem ser iguais'
    }
  },

  async created() {
    if (localStorage.getItem('token') != null) {
      this.$router.push('/')
    }
  },

}
</script>


