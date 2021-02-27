<template>
  <div class="md:w-1/4 rounded-2xl text-white text-xl px-4 py-2 md:py-6 md:px-4 md:mr-4 mb-4 shadow">
    <i :class="[icon]" class="w-1/5"></i>
    <div class="text-xs text-gray-300">{{ text }}</div>
    <div class="font-bold">
      {{ cases }}
      <span
          v-if="differ && differ > 0"
          class="text-2xl"
          :class="[invertDiffColor ? 'text-red-200':'text-green-200']"
      >
        -{{ absoluteDifference }}
      </span>
      <span
          v-else-if="differ"
          class="text-2xl"
          :class="[invertDiffColor ? 'text-green-200':'text-red-200']"
      >
        +{{ absoluteDifference }}
      </span>
    </div>
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

  @Prop({ type: Number })
  protected differ!: number;

  @Prop({ type: Boolean })
  protected invertDiffColor!: boolean;

  get absoluteDifference() {
    return Math.abs(this.differ);
  }
}
</script>
