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
                <h1 style="text-align: center" class="pt-5">Modelos</h1>

                <v-data-table :headers="headers" :items="models" sort-by="id_model" sort-desc class="elevation-1"
                    :loading="myloadingvariable">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                        Novo modelo
                                    </v-btn>
                                </template>

                                <v-card>
                                    <v-toolbar color="primary" dark>{{ formTitle }}</v-toolbar>
                                    <v-form ref="form" v-model="valid" lazy-validation>

                                        <v-card-text>

                                            <v-text-field v-model="editedItem.name_model" label="Modelo"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" required>
                                            </v-text-field>

                                            <v-select :items="brands" :item-text="'name_brand'" :item-value="'id_brand'"
                                                v-model="editedItem.id_brand" name="id_brand" label="Marca"
                                                :disabled="actionTypeModal == 2" :rules="fieldRules" required>
                                            </v-select>
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
                        <v-alert :value="true" type="info" v-if="models.length === 0">
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
    name: 'ModelAuto',

    data: () => ({
        valid: true,
        items: [
            { text: 'Carros', icon: 'mdi-car', isActive: false, url: "/car" },
            { text: 'Modelos', icon: 'mdi-zip-box', isActive: true, url: null },
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
                value: 'id_model',
            },
            { text: 'Modelo', value: 'name_model' },
            { text: 'Marca', value: 'name_brand' },
            { text: 'Ações', value: 'actions', sortable: false },
        ],
        models: [],
        editedIndex: -1,
        actionTypeModal: 0,
        editedItem: {},
        info: null,
        configToken: null,
        brands: '',
        fieldRules: [
            v => !!v || 'Campo obrigatório'
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
                return "Editar modelo";
            } else if (this.actionTypeModal === 2) {
                return "Ver modelo";
            } else {
                return "Novo modelo";
            }
        },
        checkFields() {
            return () => (this.editedItem.id_brand == undefined || this.editedItem.name_model == undefined);
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
                .get('https://posdblucas.herokuapp.com/api/models')
                .then(response => {
                    this.models = response.data;
                }
                )

            axios
                .get('https://posdblucas.herokuapp.com/api/brands')
                .then(response => {
                    this.brands = response.data;
                    this.myloadingvariable = false;
                }
                )
        },


        editItem(item) {
            this.actionTypeModal = 1;

            this.editedIndex = this.models.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        viewItem(item) {
            this.actionTypeModal = 2;
            this.editedIndex = this.models.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.models.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.myloadingvariable = true;
            this.typeAlert = '';

            axios.delete(`https://posdblucas.herokuapp.com/api/models/${this.editedItem.id_model}`, this.configToken, this.editedItem).then(() => {
                this.initialize();
                this.typeAlert = "success";
                this.messageAlert = "Modelo deletado com sucesso"
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
            if (this.valid == true) {
                if (this.editedIndex > -1) {
                    axios.patch(`https://posdblucas.herokuapp.com/api/models/${this.editedItem.id_model}`, this.editedItem, this.configToken).then(() => {
                        this.initialize();
                        this.typeAlert = "success";
                        this.messageAlert = "Modelo editado com sucesso"
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
                        .post('https://posdblucas.herokuapp.com/api/models', this.editedItem, this.configToken).then((res) => {
                            console.log(res);
                            this.initialize();
                            this.typeAlert = "success";
                            this.messageAlert = "Modelo adicionado com sucesso"
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
