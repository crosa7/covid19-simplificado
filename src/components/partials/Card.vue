<template>
  <div class="md:w-1/4 rounded-2xl text-white text-xl px-4 py-2 md:py-6 md:px-4 md:mr-4 mb-4 shadow">
    <i :class="[icon]" class="w-1/5"></i>
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
