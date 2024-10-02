# Product Management

## Descrição
O **Product Management** é uma aplicação desenvolvida com o objetivo de facilitar o cadastro e a listagem de produtos. Com uma interface intuitiva, os usuários podem cadastrar novos produtos, visualizar uma lista de produtos cadastrados e ordenar os produtos por valor.

## Tecnologias Utilizadas
- **Next.js**: Framework React para desenvolvimento de aplicações web.
- **Tailwind CSS**: Framework de CSS para estilização responsiva e rápida.
- **Shadcn UI**: Biblioteca de componentes UI.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar os dados dos produtos.

## Instalação
Para instalar e configurar o projeto localmente, siga estas etapas:

1. Clone o repositório:
   ```bash
   git clone https://github.com/Gabrielcafens/product-management.git
  ```

2. Navegue até o diretório do projeto:
   ```bash
   cd product-management
  ```

3. Instale as dependências:
   ```bash
   npm install
  ```


## Uso
Para iniciar o servidor de desenvolvimento, use o seguinte comando:
 ```bash
   npm run dev
  ```
Acesse a aplicação em http://localhost:3000.

### Funcionalidades
- **Cadastro de Produtos**: 
  - Formulário com os campos:
    - Nome do produto (campo de texto)
    - Descrição do produto (campo de texto)
    - Valor do produto (campo de valor)
    - Disponível para venda (campo com 2 opções: sim/não)
  
- **Listagem de Produtos**:
  - Colunas da listagem: nome e valor.
  - Ordenação dos produtos do menor para o maior valor.
  - A listagem é atualizada automaticamente após o cadastro de um novo produto.
  - Botão para cadastrar um novo produto diretamente da listagem.

## Demonstração

### Vídeo
Assista ao vídeo para ver a aplicação em ação:
[![Vídeo de Demonstração](link-do-video-thumbnail)](assets/demoproductmanagement.mp4)

### Prints da Aplicação
Aqui estão algumas capturas de tela que mostram as principais funcionalidades da aplicação:

1. **Tela Inicial**
   ![Tela Inicial](assets/pt1.png)
   
2. **Tela de Editar Produto**
   ![Tela de Editar Produto](assets/pt2.png)

3. **Tela de um Produto**
   ![Confirmação de Criar Produto](assets/pt5.png)


## Contribuição
Se você deseja contribuir para este projeto, siga estas etapas:
1. Faça um fork do repositório.
2. Crie uma nova branch (`git checkout -b feature/NovaFuncionalidade`).
3. Faça suas alterações e commit (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o branch (`git push origin feature/NovaFuncionalidade`).
5. Abra uma Pull Request.

## Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).

## Contato
Para perguntas ou feedback, entre em contato comigo em [gabriel.cafe@ufrpe.br].

## 🖋️ Autor

Desenvolvido por **[Gabrielcafens](https://github.com/Gabrielcafens)**.


```                         ___

                          ___
                      .-'   `'.
                     /         \
                     |         ;
                     |         |           ___.--,
            _.._     |0) = (0) |    _.---'`__.-( (_.
     __.--'`_.. '.__.\    '--. \_.-' ,.--'`     `""`
    ( ,.--'`   ',__ /./;   ;, '.__.'`    __
    _`) )  .---.__.' / |   |\   \__..--""  """--.,_
   `---' .'.''-._.-'`_./  /\ '.  \ _.--''````'''--._`-.__.'
         | |  .' _.-' |  |  \  \  '.               `----`
          \ \/ .'     \  \   '. '-._)
           \/ /        \  \    `=.__`'-.
           / /\         `) )    / / `"".`\
     , _.-'.'\ \        / /    ( (     / /
      `--'`   ) )    .-'.'      '.'.  | (
             (/`    ( (`          ) )  '-;    
            
  ( (                ( (                 ( (                
   ) )                ) )                 ) )               
.........           .........         .........           
|       |]         |       |]         |       |]                
\       /           \       /         \       /              
 `-----'             `-----'           `-----'  