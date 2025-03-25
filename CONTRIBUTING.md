# Guia de Contribuição

Obrigado por considerar contribuir com o Dashboard Financeiro! Este documento fornece as diretrizes para contribuir com o projeto.

## Código de Conduta

Este projeto e todos os participantes estão sob o [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, espera-se que você mantenha este código.

## Como posso contribuir?

### Reportando Bugs

Antes de criar um relatório de bug, verifique se o problema já não foi reportado procurando na seção de Issues do GitHub.

Ao criar um relatório de bug, inclua o máximo de detalhes possível:

- Use um título claro e descritivo
- Descreva os passos exatos para reproduzir o problema
- Descreva o comportamento que você observou e qual era o comportamento esperado
- Inclua screenshots se possível
- Mencione sua versão do navegador e sistema operacional

### Sugerindo Melhorias

Se você tem uma ideia para melhorar o projeto:

- Use um título claro e descritivo
- Forneça uma descrição detalhada da melhoria sugerida
- Explique por que esta melhoria seria útil
- Inclua mockups/protótipos se possível

### Pull Requests

- Preencha o template de pull request
- Não inclua números de issues no título do PR
- Inclua screenshots e GIFs animados em seu PR quando possível
- Siga as convenções de código do projeto
- Documente novo código baseado no padrão do projeto
- Termine todas as frases em commits com um ponto
- Teste suas mudanças

## Estilo de Código

- Use 2 espaços para indentação
- Use aspas simples para strings
- Termine todas as frases com ponto e vírgula
- Evite código duplicado
- Mantenha funções pequenas e focadas
- Use nomes descritivos para variáveis e funções

## Processo de Desenvolvimento

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Configuração do Ambiente de Desenvolvimento

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/dashboard-financeiro.git
```

2. Instale as dependências

```bash
cd dashboard-financeiro
npm install
```

3. Crie um arquivo `.env.local` baseado no `.env.example`

```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes
- `npm run preview` - Visualiza a versão de produção localmente

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/      # Contextos da aplicação
├── pages/         # Páginas do aplicativo
├── types/         # Definições de tipos TypeScript
├── utils/         # Funções utilitárias
├── constants/     # Constantes e configurações
├── App.tsx        # Componente principal
└── main.tsx       # Ponto de entrada
```

## Recursos Adicionais

- [Documentação do React](https://reactjs.org/docs/getting-started.html)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs/)
- [Documentação do Material-UI](https://mui.com/getting-started/installation/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do Chart.js](https://www.chartjs.org/docs/latest/)

## Dúvidas?

Se você tiver alguma dúvida, não hesite em perguntar na seção de Issues do GitHub.
