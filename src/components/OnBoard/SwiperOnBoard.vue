<template>
  <div class="s-swiper-on-board">
    <swiper
      id="swiper"
      :auto-height="true"
      :pagination="true"
      :modules="modules"
      class="mySwiper"
      @slide-change="onSlideChange"
    >
      <h6 class="fechar-on-board" @click="fecharOnBoard">Pular</h6>
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <component :is="{ ...slide }" :fechar-on-board="fecharOnBoard" />
      </swiper-slide>
      <el-icon size="50" class="botao-next" :class="esconderBotao" @click="proximoSlide">
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.8533 11.3033C21.7661 11.0782 21.6352 10.8726 21.4683 10.6983L12.3017 1.5316C12.1307 1.36066 11.9278 1.22507 11.7045 1.13256C11.4811 1.04005 11.2417 0.992432 11 0.992432C10.5118 0.992432 10.0436 1.18638 9.69833 1.5316C9.5274 1.70254 9.3918 1.90547 9.29929 2.12881C9.20678 2.35215 9.15917 2.59152 9.15917 2.83327C9.15917 3.32149 9.35311 3.78971 9.69833 4.13493L15.7483 10.1666H1.83333C1.3471 10.1666 0.880788 10.3598 0.536971 10.7036C0.193155 11.0474 0 11.5137 0 11.9999C0 12.4862 0.193155 12.9525 0.536971 13.2963C0.880788 13.6401 1.3471 13.8333 1.83333 13.8333H15.7483L9.69833 19.8649C9.5265 20.0354 9.39011 20.2381 9.29703 20.4615C9.20396 20.6849 9.15604 20.9246 9.15604 21.1666C9.15604 21.4086 9.20396 21.6482 9.29703 21.8717C9.39011 22.0951 9.5265 22.2978 9.69833 22.4683C9.86876 22.6401 10.0715 22.7765 10.2949 22.8696C10.5184 22.9626 10.758 23.0106 11 23.0106C11.242 23.0106 11.4816 22.9626 11.7051 22.8696C11.9285 22.7765 12.1312 22.6401 12.3017 22.4683L21.4683 13.3016C21.6352 13.1272 21.7661 12.9216 21.8533 12.6966C22.0367 12.2503 22.0367 11.7496 21.8533 11.3033Z"
            fill="#00B8AD"
          />
        </svg>
      </el-icon>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'


export default defineComponent({
  name: 'SSwiperOnBoard',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    /**
     * Função para fechar o on-board
     * @type function
     */
    fecharOnBoard: {
      required: true,
      type: Function as PropType<() => void>
    },
    /**
     * Componentes que serão renderizados no on-board
     * @type Array de componentes
     */
    slides: {
      type: [Array, Object],
      required: true
    }
  },
  setup() {
    return {
      modules: [Pagination]
    }
  },
  data() {
    return {
      activeIndex: 0
    }
  },
  computed: {
    esconderBotao() {
      return this.activeIndex == this.slides?.length - 1 ? 'botao-hide' : ''
    }
  },
  methods: {
    proximoSlide() {
      const swiper = document.querySelector<any>('#swiper')?.swiper
      swiper?.slideNext()
    },
    onSlideChange(swiper: any) {
      this.activeIndex = swiper.activeIndex
    }
  }
})
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  min-height: 100vh;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fechar-on-board {
  color: #60BB45;
  z-index: 10;
  position: absolute;
  right: 0px;
  top: 0px;
  padding: 20px;
  margin-bottom: 0;
}

.botao-next {
  color: #60BB45;
  z-index: 10;
  position: absolute;
  right: 25px;
  top: 92vh;
}

.fechar-on-board:hover,
.botao-next:hover {
  color: #60BB45;
  cursor: pointer;
}

.botao-next svg {
  font-size: 24px;
}

.botao-hide {
  display: none;
}
</style>

<style>
.s-swiper-on-board .swiper-horizontal > .swiper-pagination-bullets {
  position: absolute;
  top: 62px;
  bottom: auto;
}

.s-swiper-on-board .swiper-pagination-bullet-active {
  background: #60BB45;
}
</style>
