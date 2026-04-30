📚 ClassManager
Um sistema web para gerenciamento de turmas, alunos e desempenho acadêmico, permitindo que professores acompanhem o progresso dos estudantes de forma organizada e intuitiva.

🚀 Visão Geral
O ClassManager é uma aplicação web desenvolvida com Node.js e React que permite ao professor:

Criar e gerenciar turmas
Cadastrar alunos
Definir atividades avaliativas com pesos
Lançar notas
Acompanhar desempenho com médias e totais
Filtrar, ordenar e buscar alunos dinamicamente

✨ Funcionalidades

🔐 Autenticação
Cadastro de usuário
Login com token JWT
Proteção de rotas

📚 Turmas
Criação de turmas
Definição de atividades avaliativas
Configuração de média mínima

👨‍🎓 Alunos
Cadastro de alunos com nome e matrícula
Listagem dinâmica
Edição e exclusão (em evolução)

📝 Notas
Lançamento de notas por atividade
Validação baseada no peso da atividade
Atualização em tempo real

📊 Análise de Desempenho
Cálculo de média (%)
Cálculo de total de pontos
Exibição de situação (Aprovado / Em risco / Sem avaliação)

🔍 Filtros e Ordenação
Busca por nome
Ordenação por nome ou média
Filtro por status

🎨 Interface
Layout moderno com React
Tabela dinâmica com scroll e header fixo
Coluna fixa para melhor visualização
Interface responsiva e interativa

🛠️ Tecnologias Utilizadas

Tecnologia | Função
Node.js | Backend
Express | API REST
MongoDB | Banco de dados
Mongoose | ODM
React | Interface frontend
Bootstrap | Estilização
JWT | Autenticação
dotenv | Variáveis de ambiente

⚙️ Instalação

1. Clone o projeto
   git clone <SEU_REPOSITORIO>

2. Acesse a pasta
   cd <PASTA_DO_PROJETO>

3. Instale as dependências

Backend:
cd backend
npm install

Frontend:
cd frontend
npm install

🔧 Configuração do ambiente (.env)

⚠️ IMPORTANTE:
É necessário criar um arquivo `.env` dentro da pasta **backend**.

Esse arquivo deve conter:

MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta

🧠 Explicação das variáveis

MONGO_URI
Responsável por conectar a aplicação ao banco MongoDB (local ou Atlas)
Utilizado no arquivo server.js

JWT_SECRET
Chave usada para geração e validação de tokens JWT
Utilizada no authMiddleware.js

▶️ Executando o projeto

Backend:
cd backend
npm run dev

Frontend:
cd frontend
npm run dev

Acesse no navegador:
http://localhost:5173

🗄️ Banco de Dados

Você pode utilizar MongoDB local ou MongoDB Atlas.

Local:
Instale o MongoDB
Execute: mongod

Atlas:
Crie um cluster em https://www.mongodb.com/atlas
Copie a string de conexão
Adicione no .env como MONGO_URI

🏗️ Estrutura do Projeto

Backend:
Controllers → lógica da aplicação
Models → estrutura dos dados
Routes → definição das rotas
Middlewares → autenticação e segurança

Frontend:
Componentes React
Gerenciamento de estado
Consumo da API

🔄 Fluxo da aplicação

Usuário faz requisição no frontend
Frontend consome a API
Backend processa a lógica
Banco armazena os dados
Resposta é retornada e exibida na interface

💡 Melhorias Futuras

Edição e exclusão de alunos
Dashboard com gráficos
Ranking da turma
Melhor responsividade mobile

👨‍💻 Autor
Davi Pedrosa

📄 Licença
MIT
