# AcademicShare

# Plataforma de Partilha de Materiais Académicos

## GitHub


## Autoria
- Tomás Felicíssimo nº31375
- Inês Delgado nº31414
- Diana Matos nº31399

## 1. Introdução
O **AcademicShare** é uma plataforma colaborativa desenvolvida para facilitar a partilha de materiais de estudo entre estudantes. O principal objetivo do Academic Share é garantir que todos os estudantes têm acesso aos conteúdos das aulas, mesmo quando não estão presentes, promovendo colaboração e solidariedade entre colegas.

---

## 2. Tecnologias Utilizadas
- **Framework Front-end**: React.js (Vite).
- **Back-end**: Node.js com Express.
- **Comunicação em Tempo Real**: Socket.io (para Chat de Aula).
- **Gestão de Dados**: MongoDB com Mongoose.
- **Autenticação**: JWT (JSON Web Tokens) e bcryptjs para encriptação de palavras-passe.
- **Gestão de Ficheiros**: Multer para upload de materiais.

---

## 3. Funcionalidades

A estrutura de dados foi modelada em **MongoDB** utilizando o **Mongoose**, focando-se nas seguintes entidades:
- **User**: Gestão de utilizadores, perfis e autenticação.
- **Disciplina**: Organização das áreas de estudo.
- **Aula**: Subdivisão das disciplinas para melhor organização.
- **Material**: Armazenamento de PDFs (via upload físico) e links externos.
- **ChatMessage**: Histórico de conversas em tempo real.

### Fluxo Inicial e Segurança
- **Autenticação**: Registo e login de utilizadores com validação JWT.
- **Perfil de Utilizador**: Visualização de dados pessoais e alteração de palavra-passe com verificação de segurança.
- **Proteção de Rotas**: O acesso ao dashboard e aos materiais requer um token válido.

### Gestão de Disciplinas e Aulas
- **Dashboard Dinâmico**: Visualização de todas as disciplinas com sistema de **pesquisa em tempo real** por nome.
- **CRUD de Disciplinas**: Possibilidade de criar, editar e eliminar disciplinas (apenas pelo criador ou admin).
- **Organização por Aulas**: Cada disciplina contém a sua lista de aulas agendadas.

### Partilha de Materiais
- **Upload de Ficheiros**: Suporte para submissão de ficheiros PDF utilizando o middleware Multer.
- **Links Externos**: Possibilidade de partilhar links úteis (Ex: Google Drive, vídeos, sites).
- **Download Direto**: Funcionalidade de download via Blob para garantir a transferência de ficheiros entre diferentes domínios (CORS).
- **Eliminação de Materiais**: Gestão de ficheiros submetidos, permitindo a remoção tanto da base de dados como do armazenamento físico.

### Comunicação (Chat)
- **Chat de Aula**: Sistema de chat em tempo real por aula, permitindo a discussão de dúvidas específicas sobre os materiais partilhados.

---

## 4. Configuração e Execução

1. **Clonar o Repositório**:

   ```bash
   git clone
   cd nome-do-projeto
   ```

2. **Instalação das bibliotecas**:

    ```bash
    # No diretório backend
    cd backend
    npm install

    # No diretório frontend
    cd ../frontend
    npm install
    ```

3. **Criação do ficheiro .env**:

    ```bash
    # No diretório backend
    MONGO_URI=mongodb+srv://<teu_utilizador>:<tua_password>@cluster.mongodb.net/academicshare
    JWT_SECRET=uma_chave_secreta_muito_segura
    PORT=5000

    # No diretório backend
    VITE_API_URL=http://localhost:5000/api
    VITE_BACKEND_URL=http://localhost:5000
    ```

4. **Iniciar o projeto**:

    ```bash
    #Terminal 1(Backend)
    cd backend
    # Certifica-te de que a pasta 'uploads' existe na raiz do backend
    npm run dev

    #Terminal 2(Frontend)
    cd frontend
    npm run dev
   ```

## 5. Manual de Utilização

### 5.1. Autenticação e Perfil
* **Registo/Login**: Ao aceder à aplicação, o utilizador deve autenticar-se. Se não tiver conta, pode registar-se fornecendo nome, email e palavra-passe.
* **Gestão de Perfil**: No ícone de utilizador no cabeçalho, é possível aceder às configurações para visualizar dados pessoais ou alterar a palavra-passe atual.

### 5.2. Dashboard e Disciplinas
* **Visualizar Disciplinas**: O Dashboard exibe cartões com todas as disciplinas criadas. Cada cartão mostra o título, descrição e quem a criou.
* **Pesquisa**: Utiliza a barra de pesquisa central para filtrar disciplinas instantaneamente por nome.
* **Criar Disciplina**: Clique no botão "+ Nova Disciplina" para abrir o modal de criação.

### 5.3. Gestão de Materiais na Aula
Ao selecionar uma disciplina e entrar numa aula específica, terá acesso ao painel de materiais:
* **Adicionar Material**: Clique em "+ Adicionar material" no topo da página.
    * **Ficheiro**: Selecione um PDF do seu computador para upload.
    * **Link**: Introduza uma URL externa (ex: slides, vídeos).
* **Interagir com Materiais**:
    * **Abrir**: Abre o PDF ou o link num novo separador.
    * **Download**: Descarrega o ficheiro PDF diretamente para o seu dispositivo através do botão "Download".
* **Sistema de Arquivo (Aulas e Materiais)**: O autor pode arquivar disciplinas, aulas ou materiais específicos. Uma vez arquivados, os elementos aparecem com tom acinzentado para o autor, indicando que o conteúdo está arquivado, até que o autor decida reativá-los, enquanto que para os outros utilizadores desaparece e só volta a aparecer quando o autor decidir desarquivar.

### 5.4. Chat em Tempo Real
* **Alternar entre Abas**: Utilize as abas "Materiais" e "Chat" para mudar o conteúdo da página.
* **Conversar**: No separador de Chat, pode enviar mensagens em tempo real para todos os colegas que estiverem a visualizar a mesma aula, facilitando o esclarecimento de dúvidas sobre os materiais partilhados.