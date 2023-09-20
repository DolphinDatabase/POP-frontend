<script setup lang="ts"></script>

<template>
  <div class="nav">
    <img class="arrow" @click="$router.push('/')" src="../../assets/arrow.svg" alt="" />
    <img src="../../assets/logos/light_logo.svg" alt="" />
  </div>
  <div class="terms-page">
    <div>
      <h2>Política de privacidade</h2>
      <p>
        Esta Política de Privacidade descreve como pop ("Site") coleta, utiliza e protege as
        informações pessoais dos usuários. Ao utilizar o Site, você concorda com os termos desta
        Política de Privacidade.
      </p>
      <h3>1. Informações Coletadas</h3>
      <h5>
        1.1 Informações de Registro: Ao criar uma conta no Site, você fornece informações como seu
        nome, endereço de e-mail e senha.
      </h5>
      <h5>
        1.2 Informações de Uso: Quando você acessa o Site, informações sobre suas interações,
        incluindo páginas visitadas, consultas de pesquisa e outras atividades podem ser coletadas
        automaticamente.
      </h5>
      <h5>
        1.3 Conteúdo do Usuário: Qualquer informação, dados, textos, imagens ou outros conteúdos que
        você envia, compartilha ou publica no Site são considerados Conteúdo do Usuário e podem ser
        coletados e armazenados.
      </h5>
      <h3>2. Uso das Informações</h3>
      <h5>
        2.1 Melhoria do Serviço: As informações coletadas podem ser usadas para melhorar e
        personalizar a experiência do usuário, bem como para desenvolver e aprimorar os serviços do
        Site.
      </h5>
      <h5>
        2.2 Comunicação: Podemos usar seu endereço de e-mail para enviar informações sobre sua
        conta, notificações de serviço e atualizações relacionadas ao Site. Você pode optar por não
        receber comunicações promocionais.
      </h5>
      <h5>
        2.3 Pesquisas e Análises: Podemos utilizar as informações coletadas para realizar pesquisas
        e análises, incluindo análises demográficas e de uso do Site.
      </h5>
      <h5>
        2.4 Cumprimento Legal: Reservamo-nos o direito de divulgar informações quando exigido por
        lei ou quando acreditarmos, de boa fé, que a divulgação é necessária para proteger nossos
        direitos legais ou cumprir processos legais.
      </h5>
      <h3>3. Compartilhamento de Informações</h3>
      <h5>
        3.1 Terceiros: Não compartilhamos suas informações pessoais com terceiros, exceto quando
        necessário para prestar os serviços do Site ou quando autorizado por você.
      </h5>
      <h5>
        3.2 Provedores de Serviços: Podemos utilizar prestadores de serviços terceirizados para
        ajudar a operar o Site e fornecer serviços relacionados. Esses prestadores de serviços têm
        acesso limitado às suas informações pessoais e estão contratualmente obrigados a mantê-las
        confidenciais.
      </h5>
      <h3>4. Cookies e Tecnologias Semelhantes</h3>
      <h5>
        4.1 O Site pode utilizar cookies e outras tecnologias de rastreamento para coletar
        informações sobre sua interação com o Site. Você pode gerenciar suas preferências de cookies
        nas configurações do seu navegador.
      </h5>
      <h3>5. Segurança</h3>
      <h5>
        5.1 Empregamos medidas de segurança razoáveis para proteger suas informações pessoais contra
        acesso não autorizado, alteração, divulgação ou destruição.
      </h5>
      <h3>6. Menores de Idade</h3>
      <h5>
        6.1 O Site não se destina a menores de idade e não coletamos intencionalmente informações de
        menores. Se tomarmos conhecimento de que informações pessoais de um menor foram coletadas,
        tomaremos medidas para excluí-las.
      </h5>
      <h3>7. Alterações na Política de Privacidade</h3>
      <h5>
        7.1 Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. As
        alterações entrarão em vigor quando forem publicadas no Site. Recomendamos que você reveja
        regularmente esta Política de Privacidade para se manter informado sobre as práticas de
        privacidade do Site.
      </h5>
      <h3>8. Contato</h3>
      <h5>
        8.1 Se você tiver alguma dúvida ou preocupação sobre esta Política de Privacidade ou o uso
        de suas informações pessoais, entre em contato conosco através dos meios de contato
        fornecidos no Site.
      </h5>
      <p>Esta Política de Privacidade foi atualizada em 12/09/2023.</p>
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
  cursor: pointer;
}

button {
  appearance: none;
}
</style>
