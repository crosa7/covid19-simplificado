<template>
  <div class="md:w-1/4 rounded-2xl text-white text-xl py-4 px-2 mr-2 mb-2 shadow">
    <i :class="[icon]"></i>
    <div class="text-xs text-gray-300">{{ text }}</div>
    <div class="font-bold">{{ cases }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Card extends Vue {
  @Prop({ type: String, default: '' })
  protected icon!: string;

  @Prop({ type: String, default: '' })
  protected text!: string;

  @Prop({ type: String, default: '' })
  protected cases!: string;
}
</script>
