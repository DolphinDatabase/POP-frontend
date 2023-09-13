<script setup lang="ts"></script>

<template>
  <div class="nav">
    <img class="arrow" @click="$router.push('/')" src="../../assets/arrow.svg" alt="" />
    <img src="../../assets/logos/light_logo.svg" alt="" />
  </div>
  <div class="terms-page">
    <div>
      <h2>Termos de uso</h2>
      <p>
        Estes Termos de Uso ("Termos") regem o uso do site pop ("Site") e todos os serviços
        relacionados a ele. Ao acessar ou usar o Site, você concorda com estes Termos e se
        compromete a cumpri-los integralmente. Se você não concordar com qualquer parte destes
        Termos, não deve usar o Site.
      </p>
      <h3>1. Cadastro e Conta</h3>
      <h5>
        1.1 Para acessar recursos adicionais do Site, como mapeamentos e previsões de colheitas,
        você deve criar uma conta. Ao se registrar, você concorda em fornecer informações precisas,
        atualizadas e completas, incluindo seu nome, endereço de e-mail e senha.
      </h5>
      <h5>
        1.2 Você é responsável por manter suas informações de conta seguras e confidenciais. Você
        concorda em não compartilhar sua senha com terceiros e notificar imediatamente o Site caso
        suspeite de uso não autorizado de sua conta.
      </h5>
      <h5>1.3 Você é o único responsável por todas as atividades realizadas em sua conta.</h5>
      <h3>2. Uso Aceitável</h3>
      <h5>
        2.1 Você concorda em usar o Site apenas para fins legais e de acordo com estes Termos.
      </h5>
      <h5>2.2 Você concorda em não:</h5>
      <h6>
        a) Usar o Site de maneira que possa interromper, danificar ou desativar o Site ou prejudicar
        o acesso de outros usuários ao mesmo.
      </h6>
      <h6>b) Realizar qualquer atividade que viole leis aplicáveis ou regulamentos.</h6>
      <h6>c) Usar o Site para coletar ou armazenar informações pessoais de outros usuários.</h6>
      <h6>
        d) Usar qualquer técnica de mineração de dados, robôs, spiders ou qualquer outro meio
        automatizado para acessar o Site.
      </h6>
      <h3>3. Conteúdo do Usuário</h3>
      <h5>
        3.1 O Site pode permitir que você envie, compartilhe ou publique informações, dados, textos,
        imagens ou outros conteúdos ("Conteúdo do Usuário").
      </h5>
      <h5>
        3.2 Ao enviar Conteúdo do Usuário, você concede ao Site uma licença mundial, não exclusiva,
        livre de royalties, para usar, reproduzir, distribuir, exibir e modificar o Conteúdo do
        Usuário, de acordo com nossa Política de Privacidade.
      </h5>
      <h5>
        3.3 Você é o único responsável por seu Conteúdo do Usuário e declara que possui todos os
        direitos necessários para enviá-lo.
      </h5>
      <h3>4. Exclusão de Conta</h3>
      <h5>
        4.1 Você pode excluir sua conta a qualquer momento, seguindo as instruções fornecidas no
        Site.
      </h5>
      <h5>
        4.2 O Site se reserva o direito de encerrar sua conta ou restringir seu acesso ao Site, a
        seu critério, sem aviso prévio, se violar estes Termos.
      </h5>
      <h3>5. Privacidade</h3>
      <h5>
        5.1 A coleta e o uso de informações pessoais estão sujeitos à nossa Política de Privacidade,
        que você deve ler e compreender.
      </h5>
      <h3>6. Alterações nos Termos</h3>
      <h5>
        6.1 O Site se reserva o direito de modificar estes Termos a qualquer momento. As alterações
        entrarão em vigor imediatamente após a publicação no Site. É sua responsabilidade revisar
        periodicamente estes Termos para se manter informado sobre quaisquer alterações.
      </h5>
      <h3>7. Contato</h3>
      <h5>
        7.1 Se você tiver alguma dúvida ou preocupação sobre estes Termos de Uso, entre em contato
        conosco através dos meios de contato fornecidos no Site.
      </h5>
      <p>Estes Termos de Uso foram atualizados em 12/09/2023.</p>
    </div>
  </div>
</template>

<style scoped>
.nav {
  padding: 36px 40px;
  display: grid;
  grid-template-columns: 3fr 4fr;
  align-items: center;
  background-color: #151718;
}

.terms-page {
  padding: 4px 240px;
  text-align: justify;
}

.arrow {
    width: 20px;
    cursor: pointer
}

button {
  appearance: none;
}
</style>
