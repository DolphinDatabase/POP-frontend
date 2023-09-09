<script setup lang="ts">
import NavBar from '@/components/Home/NavBar.vue'
import PrincipalHome from '@/components/Home/PrincipalHome.vue'
import { ref } from 'vue'
import SolutionsCarousel from '@/components/Home/SolutionsCarousel.vue'
import TeamDetails from '@/components/Home/TeamDetails.vue'

const options = ref(['Início', 'Solução', 'Sobre'])
const chooseOpt = ref()
</script>

<template>
  <div class="container">
    <div class="navigation">
      <nav-bar />
      <div class="radio-container">
        <div>
          <el-radio-group v-model="chooseOpt">
            <el-radio v-for="(option, index) in options" :key="index" :label="option" border>
              {{ option }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="home-container">
      <principal-home />
    </div>
    <div class="carousel">
      <solutions-carousel />
    </div>
    <div class="team">
      <team-details />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  background-color: #ffffff;
}

.radio-container {
  display: flex;
  justify-content: center;
  height: 54px;
}

.carousel {
}
</style>

<style>
.el-radio.is-bordered.is-checked {
  border-color: #53b137 !important;
  border-radius: 50px !important;
  font-weight: 700;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #53b137 !important;
}

.el-radio.is-bordered {
  border-color: #282a2c !important;
  border-radius: 50px !important;
  color: #282a2c !important;
  width: 105px;
  display: flex;
  justify-content: center;
}

.el-radio__inner {
  display: none !important;
}
</style>
