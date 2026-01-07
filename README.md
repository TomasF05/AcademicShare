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