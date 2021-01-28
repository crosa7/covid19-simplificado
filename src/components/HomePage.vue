<template>
  <div class="flex flex-col md:flex-row justify-between rounded-4xl bg-white py-2 px-2 md:p-12 md:w-4/5 h-auto max-w-7xl">
    <div class="md:w-2/3">
      <div class="text-xl mb-4">
        <h4 class="font-bold text-black text-2xl">Bem-vindo!</h4>
        <h4 class="text-gray-600">Verifica aqui os dados relativos à pandemia</h4>
        <h6 class="text-gray-600 text-xs">Última atualização: {{ globalState.data }}</h6>
      </div>
      <div class="flex flex-col md:flex-row flex-wrap">
        <card
            class="bg-orange-400"
            icon="fa fa-user-plus"
            text="Novos casos"
            :cases="numberWithCommas(globalState.confirmados_novos)"
            :differ="getDifferenceString(previousGlobalState.confirmados_novos, globalState.confirmados_novos)"
        ></card>
        <card
            class="bg-purple-400"
            icon="fa fa-bullseye"
            text="Casos ativos"
            :cases="numberWithCommas(globalState.ativos)"
            :differ="getDifferenceString(previousGlobalState.ativos, globalState.ativos)">
        </card>
        <card
            class="bg-blue-400"
            icon="fa fa-globe"
            text="Casos totais"
            :cases="numberWithCommas(globalState.confirmados)"
        >
        </card>
        <card
            class="bg-green-400"
            icon="fa fa-check-circle"
            text="Recuperados totais"
            :cases="numberWithCommas(globalState.recuperados)"
            :differ="getDifferenceString(previousGlobalState.recuperados, globalState.recuperados)"
            invert-diff-color
        >
        </card>
        <card
            class="bg-pink-400"
            icon="fa fa-user-times"
            text="Óbitos totais"
            :cases="numberWithCommas(globalState.obitos)"
            :differ="getDifferenceString(previousGlobalState.obitos, globalState.obitos)">
        </card>
        <card
            class="bg-yellow-600"
            icon="fa fa-bed"
            text="Internados"
            :cases="numberWithCommas(globalState.internados)"
            :differ="getDifferenceString(previousGlobalState.internados, globalState.internados)">
        </card>
        <card
            class="bg-orange-500"
            icon="fas fa-procedures"
            text="Internados UCI"
            :cases="numberWithCommas(globalState.internados_uci)"
            :differ="getDifferenceString(previousGlobalState.internados_uci, globalState.internados_uci)">
        </card>
        <div class="md:w-3/4 rounded-2xl bg-yellow-500 text-white py-6 px-4 mr-2 shadow mt-10">
          <div class="text-xs text-gray-200">Última atualização: {{ selectedCountyState.data }}</div>
          <div class="text-2xl font-bold mb-4">{{ getCapitalizedCounty(selectedCountyState.concelho) }}</div>
          <div class="flex flex-col md:flex-row mb-4 md:mb-0">
            <div class="text-xl font-bold w-1/4">Risco:</div>
            <div class="text-xl font-bold">{{ selectedCountyState.incidencia_risco }}</div>
          </div>
          <div class="flex flex-col md:flex-row mb-4 md:mb-0">
            <span class="text-xl font-bold w-1/4">Confirmados:</span>
            <span class="text-xl font-bold">{{ numberWithCommas(selectedCountyState.confirmados_14) }}</span>
          </div>
          <div class="flex flex-col md:flex-row">
            <span class="text-xl font-bold w-1/4">População:</span>
            <span class="text-xl font-bold">{{ numberWithCommas(selectedCountyState.population) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="md:w-1/3 rounded-lg md:rounded-4xl border border-gray-300 px-4 mt-4 md:mt-0 md:py-8 md:px-8">
      <div class="flex md:mb-6">
        <input
            class="w-full outline-none"
            v-model="searchQuery"
            @input="searchByCounty(searchQuery)"
            type="text"
            placeholder="Concelho"
        >
        <i class="fa fa-search py-4"></i>
      </div>
      <div class="overflow-auto md:max-h-64">
        <div
            v-if="searchQuery"
            v-for="countyData in lastUpdatedCountyDataSubSet"
            class="flex justify-between text-xl p-4 cursor-pointer hover:bg-yellow-500 border border-white rounded-2xl"
            :class="{'bg-yellow-500': selectedCountyState.concelho === countyData.concelho}"
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
import moment from 'moment';

@Component(
    {
      components: {
        Card,
      },
    },
)
export default class HomePage extends Vue {

  protected searchQuery: string = '';

  protected selectedCountyState: any = {};

  protected globalState: any = {};

  protected previousGlobalState: any = {};

  protected lastUpdatedCountyData: any = [];

  protected lastUpdatedCountyDataSubSet: any = [];

  protected async getLastUpdateCountyDataSet(): Promise<any> {
    const response = await axios.get('https://covid19-api.vost.pt/Requests/get_last_update_counties');
    this.lastUpdatedCountyData = response.data;
    this.lastUpdatedCountyDataSubSet = response.data;
  }

  protected async getGlobalState(): Promise<any> {
    const response = await axios.get('https://covid19-api.vost.pt/Requests/get_last_update');
    this.globalState = response.data;
  }

  protected async getPreviousGlobalState(): Promise<any> {
    let yesterday = moment().subtract(1, 'days').format('DD-MM-Y');
    if (this.globalState.data === yesterday) {
      yesterday = moment().subtract(2, 'days').format('DD-MM-Y');
    }
    const response = await axios.get(`https://covid19-api.vost.pt/Requests/get_entry/${yesterday}`);

    const responseData = response.data;
    this.previousGlobalState = {
      confirmados_novos: Object.values(responseData.confirmados_novos)[0],
      ativos: Object.values(responseData.ativos)[0],
      confirmados: Object.values(responseData.confirmados)[0],
      recuperados: Object.values(responseData.recuperados)[0],
      obitos: Object.values(responseData.obitos)[0],
      internados: Object.values(responseData.internados)[0],
      internados_uci: Object.values(responseData.internados_uci)[0],
    };
  }

  protected getDifferenceString(oldValue: number, newValue: number): number {
    return oldValue - newValue;
  }

  protected async getStateByCounty(county: string): Promise<any> {
    this.selectedCountyState = this.lastUpdatedCountyData.filter(
        (countyData: { concelho: string }) => countyData.concelho.toLowerCase() === county.toLowerCase(),
    )[0];
  }

  protected searchByCounty(query: string): any {
    const regex = new RegExp(`${query.toLowerCase()}[a-zA-Z]*`, 'g');
    this.lastUpdatedCountyDataSubSet = this.lastUpdatedCountyData.filter(
        (countyData: { concelho: string }) => countyData.concelho.toLowerCase().match(regex),
    );
  }

  protected numberWithCommas(value: number) {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  protected getCapitalizedCounty(county: string): string {
    const lowerCasedCounty = county?.toLowerCase() || '';
    return lowerCasedCounty.charAt(0).toUpperCase() + lowerCasedCounty.slice(1);
  }

  protected async mounted(): Promise<any> {
    await this.getGlobalState();
    await this.getPreviousGlobalState();
    await this.getLastUpdateCountyDataSet();
    this.selectedCountyState = this.lastUpdatedCountyData[0];
  }
}
</script>
