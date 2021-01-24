<template>
  <div class="flex justify-between rounded-4xl bg-white p-8 w-4/5 h-auto">
    <div class="md:w-2/3">
      <div class="text-xl mb-4">
        <h4 class="font-bold text-black">Bem-vindo!</h4>
        <h4 class="text-gray-600">Verifica aqui os dados atualizados da pandemia</h4>
      </div>
      <div class="flex flex-wrap">
        <card
            class="bg-orange-400"
            icon="fa fa-user-plus"
            text="Novos casos"
            :cases="numberWithCommas(globalState.confirmados_novos)"
        ></card>
        <card
            class="bg-purple-400"
            icon="fa fa-bullseye"
            text="Casos ativos"
            :cases="numberWithCommas(globalState.ativos)"
        ></card>
        <card
            class="bg-blue-400"
            icon="fa fa-globe"
            text="Casos totais"
            :cases="numberWithCommas(globalState.confirmados)">

        </card>
        <card
            class="bg-green-400"
            icon="fa fa-check-circle"
            text="Recuperados totais"
            :cases="numberWithCommas(globalState.recuperados)">

        </card>
        <card
            class="bg-pink-400"
            icon="fa fa-user-times"
            text="Óbitos totais"
            :cases="numberWithCommas(globalState.obitos)">

        </card>
        <div class="md:w-3/4 rounded-2xl bg-yellow-500 text-white py-4 px-2 mr-2 shadow mt-10">
          <div class="text-xs text-gray-200">Concelho afetado</div>
          <div class="text-2xl font-bold mb-4">{{ getCapitalizedCounty(countyState.concelho) }}</div>
          <div class="flex">
            <div class="text-xl font-bold w-1/4">Risco:</div>
            <div class="text-xl font-bold">{{ countyState.incidencia_risco }}</div>
          </div>
          <div class="flex">
            <span class="text-xl font-bold w-1/4">Confirmados:</span>
            <span class="text-xl font-bold">{{ numberWithCommas(countyState.confirmados_14) }}</span>
          </div>
          <div class="flex">
            <span class="text-xl font-bold w-1/4">População:</span>
            <span class="text-xl font-bold">{{ numberWithCommas(countyState.population) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="md:w-1/3 rounded-4xl border border-gray-300 py-8 px-8 shadow">
      <div class="flex mb-6">
        <input
            class="w-full outline-none"
            v-model="searchQuery"
            @input="searchByCounty(searchQuery)"
            type="text"
            placeholder="Concelho"
        >
        <i class="fa fa-search py-4"></i>
      </div>
      <div class="overflow-auto max-h-64">
        <div
            v-for="countyData in lastUpdatedCountyDataSubSet"
            class="flex justify-between text-xl p-4 cursor-pointer hover:bg-yellow-500 border border-white rounded-2xl"
            @click="getStateByCounty(countyData.concelho)"
        >
          <div>
            <h4 class="text-gray-600">{{ getCapitalizedCounty(countyData.concelho) }}</h4>
          </div>
          <div>
            <h4 class="font-bold">{{ countyData.confirmados_14 }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import axios from 'axios';
import Card from '@/components/partials/Card.vue';

@Component(
    {
      components: {
        Card,
      },
    },
)
export default class HomePage extends Vue {

  protected searchQuery: string = '';

  protected countyList: string[] = [];

  protected countyState: any = {};

  protected selectedCounty: string = '';

  protected globalState: any = {};

  protected lastUpdatedCountyData: any = [];

  protected lastUpdatedCountyDataSubSet: any = [];

  protected async getCountyList(): Promise<any> {
    const response = await axios.get('https://covid19-api.vost.pt/Requests/get_county_list/');
    this.countyList = response.data;
  }

  protected async getLastUpdateCountyDataSet(): Promise<any> {
    const response = await axios.get('https://covid19-api.vost.pt/Requests/get_last_update_counties');
    this.lastUpdatedCountyData = response.data;
    this.lastUpdatedCountyDataSubSet = response.data;
  }

  protected async getStateByCounty(county: string): Promise<any> {
    this.countyState = this.lastUpdatedCountyData.filter(
        (countyData: { concelho: string }) => countyData.concelho.toLowerCase() === county.toLowerCase(),
    )[0];
  }

  protected async getGlobalState(): Promise<any> {
    const response = await axios.get('https://covid19-api.vost.pt/Requests/get_last_update');
    this.globalState = response.data;
  }

  protected searchByCounty(query: string): any {
    const regex = new RegExp(`${query}[a-zA-Z]*`, 'g');
    this.lastUpdatedCountyDataSubSet = this.lastUpdatedCountyData.filter(
        (countyData: { concelho: string }) => countyData.concelho.toLowerCase().match(regex),
    );
  }

  protected numberWithCommas(value: number) {
    // TODO fix undefined
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  protected getCapitalizedCounty(county: string): string {
    const lowerCasedCounty = county.toLowerCase() || '';
    return lowerCasedCounty.charAt(0).toUpperCase() + lowerCasedCounty.slice(1);
  }

  protected async mounted(): Promise<any> {
    this.getGlobalState();
    await this.getLastUpdateCountyDataSet();
    this.countyState = this.lastUpdatedCountyData[0];
  }
}
</script>
