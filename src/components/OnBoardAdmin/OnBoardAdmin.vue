<template>
  <SwiperOnBoard :fechar-on-board="props.fecharOnBoard" :slides="slides" />
</template>

<script setup lang="ts">
import SwiperOnBoard from '@/components/OnBoard/SwiperOnBoard.vue'
// OnBoardSlides
import OnBoardSlideA from './OnBoardSlideA.vue'
import OnBoardSlideB from './OnBoardSlideB.vue'
import OnBoardSlideC from './OnBoardSlideC.vue'
import OnBoardSlideD from './OnBoardSlideD.vue'
import OnBoardSlideE from './OnBoardSlideE.vue'

const props = defineProps({
  fecharOnBoard: {
    required: true,
    type: Function
  }
})

const slides: any = [OnBoardSlideA, OnBoardSlideB, OnBoardSlideC, OnBoardSlideD, OnBoardSlideE]
</script>
