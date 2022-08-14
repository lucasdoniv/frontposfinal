<template>
    <v-container class="white lighten-5">
        <v-row no-gutters style="border-style: solid; border-color:grey;margin: 13px; padding: 13px;">
            <v-col cols="8">
                <h1>Encontre seu carro sem precisar procurar em vários lugares </h1>
                <h3>Todos os carros anunciados em todas as plataformas presentes na cidade de Araras estão aqui</h3>
                <v-col cols="10">
                    <v-autocomplete solo :items="models" :item-text="'name_model'" :item-value="'id_model'"
                        label="Busque por modelo" placeholder="Busque por modelo" prepend-inner-icon="mdi-magnify"
                        class="pt-6" @change="makeApiRequestCars" clearable></v-autocomplete>
                </v-col>


            </v-col>
            <v-col cols="4">
                <v-img src="../assets/carros.png" class="mt-12"></v-img>
            </v-col>
        </v-row>

        <v-row no-gutters justify="center" v-if="this.loading === true">
            <v-progress-circular indeterminate color="primary" :size="70" :width="7" class="mt-8 mb-8">
            </v-progress-circular>
        </v-row>

        <v-alert type="info" transition="fade-transition" v-if="this.showNoResults === true && this.loading === false">
            Sem resultados encontrados para esse modelo
        </v-alert>

        <v-row no-gutters>


            <v-card class="mx-auto" max-width="280" outlined v-for="car in cars" :key="car.item" style="margin: 16px;">
                <v-img height="250" :src="car.url_picture">
                </v-img>
                <v-row no-gutters>
                    <v-card-title>{{ car.name_model }} </v-card-title>
                    <v-icon medium color="black darken-2" @click="changeFav(car.id_car, car.id_favorite)"
                        v-if="token != null">
                        {{ car.id_favorite ? "mdi-cards-heart" : "mdi-cards-heart-outline" }}
                    </v-icon>
                </v-row>
                <v-card-text>
                    <div class="text-subtitle-2 mb-2">
                        {{ car.name_plataform }}
                    </div>

                    <div class="text-subtitle-1 font-weight-bold black--text mb-2">
                        {{ car.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }}
                    </div>

                    <v-row no-gutters>
                        <span class="mr-2">{{ car.year }}</span><span class="mr-2">{{ car.name_fuel }}</span><span
                            class="mr-2">{{ car.name_color }}</span>
                        <span class="mr-2">Km {{ car.km.toLocaleString('pt-br') }}</span>
                    </v-row>

                </v-card-text>


            </v-card>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    name: 'Index',

    data: () => ({
        carSearching: ["Sandero", "Corsa", "Fiesta", "Cruze"],
        cars: [],
        models: [],
        token: null,
        configToken: null,
        modelFiltered: null,
        loading: true,
        showNoResults: false
    }),

    async beforeMount() {
        this.token = localStorage.getItem('token');
        if (localStorage.getItem('token') != null) {
            this.configToken = {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            };
        }
        this.initialize();
    },
    methods: {
        initialize() {
            this.loading = true;
            this.modelFiltered = null;
            axios
                .get('https://posdblucas.herokuapp.com/api/cars', this.configToken)
                .then(response => {
                    this.cars = response.data;
                    this.loading = false;
                    if (this.cars.length === 0) {
                        this.showNoResults = true;
                    } else {
                        this.showNoResults = false;
                    }
                }
                )
            axios
                .get('https://posdblucas.herokuapp.com/api/models')
                .then(response => {
                    this.models = response.data;
                }
                )

        },
        makeApiRequestCars(value) {
            this.modelFiltered = value;
            this.loading = true;
            if (value != null) {
                axios
                    .get(`https://posdblucas.herokuapp.com/api/cars?id_model=${value}`, this.configToken)
                    .then(response => {
                        this.cars = response.data;
                        console.log(this.cars);
                        this.loading = false;
                        if (this.cars.length === 0) {
                            this.showNoResults = true;
                        } else {
                            this.showNoResults = false;
                        }
                    }
                    )
            } else {
                axios
                    .get('https://posdblucas.herokuapp.com/api/cars', this.configToken)
                    .then(response => {
                        this.cars = response.data;
                        this.loading = false;
                        if (this.cars.length === 0) {
                            this.showNoResults = true;
                        } else {
                            this.showNoResults = false;
                        }
                    }
                    )
            }

        },
        changeFav(id_car, id_favorite) {
            this.loading = true;
            if (id_favorite) {
                axios.post(`https://posdblucas.herokuapp.com/api/deleteFavorite`, { id_favorite: id_favorite }, this.configToken).then(() => {
                    if (this.modelFiltered != null) {
                        this.makeApiRequestCars(this.modelFiltered);
                    } else {
                        this.initialize();
                    }
                });
            } else {
                axios.post(`https://posdblucas.herokuapp.com/api/favorite`, { id_car: id_car }, this.configToken).then(() => {
                    if (this.modelFiltered != null) {
                        this.makeApiRequestCars(this.modelFiltered);
                    } else {
                        this.initialize();
                    }
                });
            }
        }
    }


}

</script>
