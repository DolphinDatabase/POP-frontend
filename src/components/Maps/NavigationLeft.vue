<script setup lang="ts">
const search = ''
import { Search } from '@element-plus/icons-vue'
</script>
<template>
  <div class="navigation-left">
    <div class="search">
      <el-input
        id="search"
        v-model="search"
        class="w-50 m-2"
        placeholder="Pesquisar"
        :suffix-icon="Search"
      />
    </div>
    <div class="navigation-left-text">
      <h4>Filtros por gleba</h4>
      <p>Selecione um filtro e monitore o status dos Glebas</p>
    </div>
    <div class="map-filter">
      <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="../../assets/carousel/plant.png" alt="" class="image" />
          <div style="padding: 14px">
            <span>Status do solo</span>
          </div>
        </el-card>
      </div>
      <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="../../assets/carousel/plant.png" alt="" class="image" />
          <div style="padding: 14px">
            <span>Irrigação do solo</span>
          </div>
        </el-card>
      </div>
      <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="../../assets/carousel/plant.png" alt="" class="image" />
          <div style="padding: 14px">
            <span>Cultivo (soja)</span>
          </div>
        </el-card>
      </div>
      <div>
        <el-card :body-style="{ padding: '0px' }" shadow="never">
          <img src="../../assets/carousel/plant.png" alt="" class="image" />
          <div style="padding: 14px">
            <span>Ciclo da colheita</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<style scoped>
.navigation-left-text {
  padding: 16px;
}
.navigation-left-text p {
  font-size: 12px;
  color: #9fa2a5;
}
.navigation-left-text h4 {
  margin-bottom: 0;
  font-weight: 500;
}

.navigation-left {
  height: 96vh;
}

.search {
  padding: 16px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2);
}
</style>
<style>
.search .el-input__wrapper {
  border-radius: 50px;
}
.map-filter .el-card {
  cursor: pointer;
  width: 120px;
}
</style>
