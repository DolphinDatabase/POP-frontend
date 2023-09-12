<script setup lang="ts"></script>

<template>
  <div>
    <h2>O que nós oferecemos?</h2>
    <el-carousel indicator-position="outside">
      <el-carousel-item>
        <img src="../../assets/carousel/plant.png" alt="" />
        <div class="text-content">
          <h3>Análises detalhadas 🌾</h3>
          <h4>
            Nossa tecnologia avançada de análise de imagens fornece insights detalhados sobre o
            estado de suas plantações, permitindo que você tome medidas proativas para melhorar o
            rendimento.
          </h4>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/carousel/field.png" alt="" />
        <div class="text-content">
          <h3>Produtividade Aumentada 🚀</h3>
          <h4>
            Identifique problemas de saúde das plantas, pragas e doenças antes que se espalhem,
            garantindo uma colheita mais saudável e lucrativa.
          </h4>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/carousel/access.png" alt="" />
        <div class="text-content">
          <h3>Acesso em Tempo Real 🖥️</h3>
          <h4>
            Monitore suas terras de qualquer lugar, a qualquer hora, através da nossa plataforma
            intuitiva e amigável.
          </h4>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../../assets/carousel/soil.png" alt="" />
        <div class="text-content">
          <h3>Tomada de Decisão Inteligente 💡</h3>
          <h4>
            Baseie suas decisões em dados confiáveis e torne-se um agricultor mais eficiente e
            bem-sucedido.
          </h4>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  color: #5bb042;
  font-weight: 800;
}

.text-content {
  width: 400px;
}

.text-content h4 {
  font-weight: 200;
}
.el-carousel__item {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.el-carousel__item img {
  padding: 24px 32px;
  width: 300px;
}
</style>
