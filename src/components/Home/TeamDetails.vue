<script setup lang="ts">
import beatriz from '@/assets/team/beatriz.jpg'
import pedro from '@/assets/team/pedro.jpg'
import hamilton from '@/assets/team/hamilton.jpeg'
import victor from '@/assets/team/victor.jpg'
import marcos from '@/assets/team/marcos.jpeg'
</script>

<template>
  <div class="all-content">
    <h2>Quem nós somos?</h2>
    <h6>Com muito apreço garantindo uma colheita mais sustentável e produtiva à você</h6>
    <div class="avatars">
      <div>
        <el-avatar :size="70" :src="beatriz" />
        <h4>Beatriz Santos</h4>
        <p>Product Owner</p>
      </div>
      <div>
        <el-avatar
          :size="70"
          :src="victor"
        />
        <h4>Victor Cavichioli</h4>
        <p>Scrum Master</p>
      </div>
      <div>
        <el-avatar :size="70" :src="pedro" />
        <h4>Pedro Motta</h4>
        <p>Developer</p>
      </div>
      <div>
        <el-avatar
          :size="70"
          :src="hamilton"
        />
        <h4>Hamilton Zanini</h4>
        <p>Developer</p>
      </div>
      <div>
        <el-avatar
          :size="70"
          :src="marcos"
        />
        <h4>Marcos Calixto</h4>
        <p>Developer</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.all-content {
  display: grid;
  background-color: #5bb042;
  color: #ffffff;
  padding: 70px;
}

h2 {
  margin: 0;
  text-align: center;
}

h6 {
  text-align: center;
  margin-bottom: 40px;
  font-weight: 200;
}

.avatars {
  display: grid;
  grid-template-columns: repeat(5, 3fr);
  justify-items: center;
}

.avatars div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

p {
  margin: 0;
}
</style>
