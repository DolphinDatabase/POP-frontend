<template>
  <SwiperOnBoard :fechar-on-board="fecharOnBoard" :slides="slides" />
</template>

<script setup lang="ts">
import SwiperOnBoard from '@/components/OnBoard/SwiperOnBoard.vue'
// OnBoardSlides
import OnBoardSlidaA from './OnBoardSlidaA.vue';
import OnBoardSlideB from './OnBoardSlideB.vue';
import OnBoardSlideC from './OnBoardSlideC.vue';
import OnBoardSlideD from './OnBoardSlideD.vue';
import OnBoardSlideE from './OnBoardSlideE.vue';

const props = defineProps({
    fecharOnBoard: {
      required: true,
      type: Function
    }
})

const slides:any = [OnBoardSlidaA, OnBoardSlideB, OnBoardSlideC, OnBoardSlideD, OnBoardSlideE]
</script>
