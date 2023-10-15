import { ElNotification } from "element-plus";

export const MensagemSucesso = (
  mensagem = "Informações salvas com sucesso!"
) => {
  ElNotification({
    title: "Sucesso",
    message: mensagem,
    type: "success",
    duration: 2500,
  });
};

export const MensagemErro = (
  mensagem = "Erro ao salvar informações!"
) => {
  ElNotification({
    title: 'Erro',
    message: mensagem,
    type: 'error',
  })
}