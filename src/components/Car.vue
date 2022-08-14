<template>
    <v-container>
        <v-alert :type="typeAlert" :value="alert" transition="fade-transition">
            {{ messageAlert }}
        </v-alert>

        <v-row>
            <v-col cols="3">
                <v-list>
                    <v-list-item-group>
                        <v-list-item v-for="(item, i) in items" :key="i" :to=item.url
                            :style="[item.isActive ? { 'background-color': '#939393' } : { 'background-color': '#F5F5F5' }]">
                            <router-link :to=item.url v-if="item.url != null">
                                <v-row>
                                    <v-list-item-icon>
                                        <v-icon v-text="item.icon"></v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title v-text="item.text"></v-list-item-title>
                                    </v-list-item-content>
                                </v-row>
                            </router-link>

                            <div v-else>
                                <v-row>
                                    <v-list-item-icon>
                                        <v-icon v-text="item.icon"></v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title v-text="item.text"></v-list-item-title>
                                    </v-list-item-content>
                                </v-row>

                            </div>
                        </v-list-item>

                    </v-list-item-group>
                </v-list>
            </v-col>
            <v-col cols="9">
                <h1 style="text-align: center" class="pt-5">Carros</h1>

                <v-data-table :headers="headers" :items="cars" sort-by="id_car" sort-desc class="elevation-1"
                    :loading="myloadingvariable">
                    <template v-slot:item.created_at="{ item }">
                        {{ formatDate(item.created_at) }}
                    </template>
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                        Novo carro
                                    </v-btn>
                                </template>

                                <v-card>
                                    <v-toolbar color="primary" dark>{{ formTitle }}</v-toolbar>
                                    <v-form ref="form" v-model="valid" lazy-validation>

                                        <v-card-text>

                                            <v-select :items="models" :item-text="'name_model'" :item-value="'id_model'"
                                                v-model="editedItem.id_model" name="id_model" label="Modelo"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" required>
                                            </v-select>

                                            <v-select :items="plataforms" :item-text="'name_plataform'"
                                                :item-value="'id_plataform'" v-model="editedItem.id_plataform"
                                                name="id_plataform" label="Plataforma" :disabled="actionTypeModal == 2"
                                                :rules="fieldRules" required>
                                            </v-select>

                                            <v-text-field v-model="editedItem.url_car" label="Url do carro"
                                                :disabled="actionTypeModal == 2" :rules="urlRules" required>
                                            </v-text-field>

                                            <v-text-field v-model="editedItem.price" label="Preço"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" type="number"
                                                required>
                                            </v-text-field>

                                            <v-text-field v-model="editedItem.year" label="Ano"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" type="number"
                                                required>
                                            </v-text-field>

                                            <v-text-field v-model="editedItem.km" label="Km"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" type="number"
                                                required>
                                            </v-text-field>

                                            <v-select :items="colors" :item-text="'name_color'" :item-value="'id_color'"
                                                v-model="editedItem.id_color" name="id_color" label="Cor"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" required>
                                            </v-select>

                                            <v-select :items="fuels" :item-text="'name_fuel'" :item-value="'id_fuel'"
                                                v-model="editedItem.id_fuel" name="id_fuel" label="Combustível"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" required>
                                            </v-select>

                                            <v-select :items="motors" :item-text="'name_motor'" :item-value="'id_motor'"
                                                v-model="editedItem.id_motor" name="id_motor" label="Motor"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" required>
                                            </v-select>

                                            <v-text-field v-model="editedItem.url_picture" label="Url da foto"
                                                :disabled="actionTypeModal == 2" :rules="urlRules.concat(urlRuleImage)"
                                                required>
                                            </v-text-field>
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="close">
                                                Fechar
                                            </v-btn>
                                            <v-btn :disabled="!valid || actionTypeModal == 2" color="primary"
                                                class="mr-4" @click.native="save">
                                                Salvar
                                            </v-btn>
                                        </v-card-actions>
                                    </v-form>

                                </v-card>

                            </v-dialog>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card>
                                    <v-card-title class="text-h5">Tem certeza que deseja excluir este item?
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">Sim</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon small @click="viewItem(item)" style="padding:10px">
                            mdi-eye
                        </v-icon>
                        <v-icon small class="mr-2" @click="editItem(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-alert :value="true" type="info" v-if="cars.length === 0">
                            Sem dados para exibir no momento, tente recarregar ou adicionar novos dados

                        </v-alert>
                        <v-btn color="primary" @click="initialize">
                            Recarregar
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    name: 'Car',

    data: () => ({
        valid: true,
        items: [
            { text: 'Carros', icon: 'mdi-car', isActive: true, url: null },
            { text: 'Modelos', icon: 'mdi-zip-box', isActive: false, url: "/model" },
            { text: 'Marcas', icon: 'mdi-watermark', isActive: false, url: null },
            { text: 'Usuários', icon: 'mdi-account', isActive: false, url: null },
            { text: 'Opcionais', icon: 'mdi-format-list-bulleted', isActive: false, url: null },
            { text: 'Plataformas', icon: 'mdi-magnify', isActive: false, url: null },
            { text: 'Cores', icon: 'mdi-format-color-fill', isActive: false, url: null },
            { text: 'Combustível', icon: 'mdi-gas-station', isActive: false, url: null },
            { text: 'Motorização', icon: 'mdi-cog-box', isActive: false, url: null }
        ],
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: 'ID',
                align: 'start',
                value: 'id_car',
            },
            { text: 'Modelo', value: 'name_model' },
            { text: 'Plataforma', value: 'name_plataform' },
            { text: 'Ano', value: 'year' },
            { text: 'Color', value: 'name_color' },
            { text: 'Data adição', value: 'created_at' },
            { text: 'Ações', value: 'actions', sortable: false },
        ],
        cars: [],
        editedIndex: -1,
        actionTypeModal: 0,
        editedItem: {},
        info: null,
        configToken: null,
        models: '',
        plataforms: '',
        colors: '',
        fuels: '',
        motors: '',
        fieldRules: [
            v => !!v || 'Campo obrigatório, digite o formato correto do campo'
        ],
        urlRules: [
            v => !!v || 'Campo obrigatório, digite o formato correto do campo',/* eslint-disable-next-line no-useless-escape*/
            v => /https?:[0-9]*\/\/[\w!?/\+\-_~=;\.,*&@#$%\(\)\'\[\]]+/.test(v) || 'Url deve ser válida, incluindo http ou https',
            v => (v || 'aaaa').length <= 191 || 'A url pode ter no máximo 191 caracteres'
        ],
        urlRuleImage: [
            v => /\.(jpeg|jpg|gif|png)$/.test(v) || 'Url deve ser válida e ser uma imagem, incluindo http ou https'
        ],
        alert: false,
        typeAlert: 'success',
        messageAlert: '',
        timer: 0,
        myloadingvariable: true
    }),

    computed: {
        formTitle() {
            if (this.actionTypeModal === 1) {
                return "Editar carro";
            } else if (this.actionTypeModal === 2) {
                return "Ver carro";
            } else {
                return "Novo carro";
            }
        },
        checkFields() {
            return () => (this.editedItem.id_model == undefined || this.editedItem.id_plataform == undefined || this.editedItem.price == undefined || this.editedItem.year == undefined || this.editedItem.km == undefined || this.editedItem.id_color == undefined || this.editedItem.id_fuel == undefined || this.editedItem.url_picture == undefined);
        }
    },


    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },



    async beforeMount() {
        if (localStorage.getItem('typeUser') != 2) {
            this.$router.push('/')
        }
        this.configToken = {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            },
        };
        this.initialize()
    },

    methods: {
        initialize() {
            this.myloadingvariable = true;
            axios
                .get('https://posdblucas.herokuapp.com/api/cars')
                .then(response => {
                    this.cars = response.data;
                }
                )

            axios
                .get('https://posdblucas.herokuapp.com/api/models')
                .then(response => {
                    this.models = response.data;
                }
                )
            axios
                .get('https://posdblucas.herokuapp.com/api/plataforms')
                .then(response => {
                    this.plataforms = response.data;
                }
                )
            axios
                .get('https://posdblucas.herokuapp.com/api/colors')
                .then(response => {
                    this.colors = response.data;
                }
                )
            axios
                .get('https://posdblucas.herokuapp.com/api/motors')
                .then(response => {
                    this.motors = response.data;
                }
                )
            axios
                .get('https://posdblucas.herokuapp.com/api/fuels')
                .then(response => {
                    this.fuels = response.data;
                    this.myloadingvariable = false;
                }
                )
        },

        formatDate(value) {
            return new Date(value).toLocaleString();
        },


        editItem(item) {
            this.actionTypeModal = 1;

            this.editedIndex = this.cars.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        viewItem(item) {
            this.actionTypeModal = 2;
            this.editedIndex = this.cars.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.cars.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.myloadingvariable = true;
            this.typeAlert = '';

            axios.delete(`https://posdblucas.herokuapp.com/api/cars/${this.editedItem.id_car}`, this.configToken, this.editedItem).then(() => {
                this.initialize();
                this.typeAlert = "success";
                this.messageAlert = "Carro deletado com sucesso"
                this.myloadingvariable = false;
                this.showAlert();

            }).catch(() => {
                this.typeAlert = "error";
                this.messageAlert = "Erro ao realizar requisição"
                this.myloadingvariable = false;
                this.showAlert();

            });
            this.closeDelete();
        },

        close() {
            this.resetValidation();
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.actionTypeModal = 0;
        },

        closeDelete() {
            this.dialogDelete = false;
        },

        save() {
            if (this.checkFields()) {
                this.valid = false;
            } else {
                this.valid = true;
                this.myloadingvariable = true;
            }
            this.typeAlert = '';
            this.validate();
            console.log("ok");
            console.log(this.valid);


            if (this.valid == true) {
                delete this.editedItem.created_at;
                delete this.editedItem.updated_at;
                if (this.editedIndex > -1) {
                    axios.patch(`https://posdblucas.herokuapp.com/api/cars/${this.editedItem.id_car}`, this.editedItem, this.configToken).then(() => {
                        this.initialize();
                        this.typeAlert = "success";
                        this.messageAlert = "Carro editado com sucesso"
                        this.myloadingvariable = false;
                        this.showAlert();
                    }).catch(() => {
                        this.typeAlert = "error";
                        this.messageAlert = "Erro ao realizar requisição"
                        this.myloadingvariable = false;
                        this.showAlert();

                    });

                } else {
                    axios
                        .post('https://posdblucas.herokuapp.com/api/cars', this.editedItem, this.configToken).then((res) => {
                            console.log(res);
                            this.initialize();
                            this.typeAlert = "success";
                            this.messageAlert = "Carro adicionado com sucesso"
                            this.myloadingvariable = false;
                            this.showAlert();

                        }).catch(() => {
                            this.typeAlert = "error";
                            this.messageAlert = "Erro ao realizar requisição"
                            this.myloadingvariable = false;
                            this.showAlert();
                        });
                }

                this.close();
            }
        },
        validate() {
            this.$refs.form.validate();
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
    }

}

</script>
