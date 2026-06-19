Istruções gerais para configurar e rodar o projeto:
- Rodar o comando de instalação dos pacotes do Node.js (caso seja necessário);
- Criar um banco de dados MySQL chamado lista_contatos e em seguida criar uma tabela com o nome contatos (código de criação abaixo):
    create table contatos (
        id int auto_increment primary key,
        nome varchar(100) not null,
        telefone varchar(20) not null
    );

- Criar um arquivo .env para guardar as credenciais do MySQL local (código de criação abaixo):
    PORT=3000
    DB_HOST=localhost
    DB_USER=seu_usuario
    DB_PASSWORD=sua_senha
    DB_NAME=lista_contatos

- Após essas preparações o projeto estará pronto para rodar, basta executar o comando "node index.js" no terminal.
  
