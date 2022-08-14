<template>
    <v-footer padless>
        <v-container class="ma-0 pa-0" style="max-width: 100%">
            <v-row justify="center" no-gutters>
                <v-col class=" lighten-2 py-4 text-center white--text" style="background-color: #808080" cols="12">
                    <v-btn depressed color="#808080" font-color="black">
                        <span class="mr-2 black--text font-weight-medium">Página inicial</span>
                    </v-btn>
                    <span font-color="black">
                        <span style="color: black">•</span>
                    </span>
                    <v-btn depressed color="#808080" font-color="black">
                        <span class="mr-2 black--text font-weight-medium">Fale Conosco</span>
                    </v-btn>
                    <span font-color="black">
                        <span style="color: black">•</span>
                    </span>
                    <v-btn depressed color="#808080" font-color="black">
                        <span class="mr-2 black--text font-weight-medium">Termos de uso</span>
                    </v-btn>
                    <span font-color="black">
                        <span style="color: black">•</span>
                    </span>
                    <v-btn depressed color="#808080" font-color="black">
                        <span class="mr-2 black--text font-weight-medium">Termos de privacidade</span>
                    </v-btn>
                    
                    <router-link to="/car" v-if="this.typeUser == 2">
                    <span font-color="black">
                        <span style="color: black">•</span>
                    </span>
                        <v-btn depressed color="#808080" font-color="black">
                            <span class="mr-2 black--text font-weight-medium">Painel admnistrador</span>
                        </v-btn>
                    </router-link>
                    <span font-color="black">
                        <span style="color: black">•</span>
                    </span>
                    <v-btn depressed color="#808080" font-color="black">
                        <span class="mr-2 black--text font-weight-medium">Depoimentos</span>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row justify="center" no-gutters class="pt-4">
                <p class="body-2 align "> Feito por Lucas Donizetti Vieira, Pós PUC Minas - {{ new Date().getFullYear()
                }} -
                    Todos os direitos reservados
                </p>

            </v-row>
        </v-container>
    </v-footer>
</template>

<script>
export default {
    name: 'Footer',

    beforeMount() {
    this.typeUser = localStorage.getItem('typeUser');
  }
}
</script>
