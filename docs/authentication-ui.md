# DindIn — UI de Autenticação

> Status: **vertical slice pronta para validação**  
> Data de referência: **2026-09**

## 1. Objetivo

Substituir o harness técnico de autenticação por uma experiência própria do DindIn, sem expor detalhes de infraestrutura para o usuário.

A autenticação pertence à experiência do produto, mas JWT, cookies, JWKS, issuer, audience, endpoints do provider e detalhes de sessão permanecem internos.

```text
DindIn
  ↓
Entrar / Criar conta / Recuperar senha
  ↓
Managed Better Auth
  ↓
sessão / JWT
  ↓
IdentityProvider
  ↓
DindIn API
  ↓
dados do usuário
```

## 2. Rotas

```text
/entrar
/criar-conta
/recuperar-senha
/redefinir-senha
```

As rotas temporárias `/auth/sign-in` e `/auth/debug` deixam de fazer parte da experiência oficial.

O proxy técnico permanece em:

```text
/api/auth/[...path]
```

Ele é infraestrutura e não deve ser apresentado ao usuário.

## 3. Entrar

Métodos:

- Google;
- e-mail + senha.

Comportamento:

1. usuário escolhe Google ou informa e-mail/senha;
2. Web chama o cliente oficial do Managed Better Auth;
3. o provider estabelece a sessão;
4. após sucesso, o usuário retorna ao DindIn;
5. mensagens brutas do provider nunca são renderizadas.

## 4. Criar conta

Campos:

- nome;
- e-mail;
- senha;
- confirmação de senha.

Também é permitido criar/acessar usando Google.

A confirmação de senha é uma validação da UI e não é enviada como dado adicional ao provider.

## 5. Recuperar senha

A recuperação usa o fluxo oficial do Better Auth exposto pelo Managed Better Auth:

```text
requestPasswordReset
→ email de recuperação gerenciado
→ /redefinir-senha?token=...
→ resetPassword
```

Regras:

- nunca escrever senha diretamente no schema `neon_auth`;
- nunca montar ou persistir token de reset como dado de domínio;
- usar mensagem neutra após a solicitação para evitar revelar se um e-mail possui conta;
- token expirado/inválido gera orientação amigável para solicitar novo link;
- enquanto APIs administrativas/alternativas de reset permanecerem Beta, o DindIn continua usando o fluxo oficial gerenciado e suportado pelo provider.

## 6. Mensagens de erro

A UI não imprime `error.message` recebido do provider.

Exemplos de mensagens aceitas:

```text
E-mail ou senha não conferem. Revise os dados ou recupere sua senha.

Não foi possível continuar com o Google agora. Tente novamente ou use seu e-mail e senha.

Não foi possível redefinir a senha. O link pode ter expirado; solicite um novo e tente novamente.
```

Não expor:

- nomes internos de endpoints;
- status de JWKS;
- algoritmo criptográfico;
- issuer/audience;
- stack trace;
- código interno de provider;
- conteúdo do JWT;
- cookie de sessão.

## 7. Segurança

1. Cookies de sessão continuam sob responsabilidade do SDK/provider.
2. JWT não é renderizado nem salvo manualmente no browser.
3. A UI não recebe `userId` como parâmetro de confiança.
4. A API continua resolvendo identidade por `IdentityProvider`.
5. Senhas nunca entram em logs, analytics ou documentação.
6. Erros da infraestrutura são transformados em mensagens de produto.
7. Recuperação de senha usa resposta neutra para reduzir enumeração de usuários.
8. Credenciais OAuth e cookie secret ficam somente no gerenciamento de secrets do ambiente.

## 8. Design

A UI segue a direção oficial do DindIn:

- Bricolage Grotesque para identidade e títulos;
- Manrope para interface;
- roxo como cor principal;
- lilás como apoio;
- amarelo-ouro apenas como acento;
- branco/neutros para preservar clareza;
- baixa densidade cognitiva;
- linguagem acolhedora e direta.

Princípio:

> A infraestrutura pode ser complexa. A experiência do usuário não deve ser.

## 9. Google OAuth no beta

No ambiente de desenvolvimento é aceitável o provider Google compartilhado disponibilizado pelo Managed Better Auth.

Antes do beta público:

- criar credenciais OAuth próprias do DindIn;
- configurar consent screen e identidade visual;
- registrar domínio estável do DindIn;
- cadastrar callbacks oficiais;
- revisar trusted domains;
- remover dependência do provider compartilhado de desenvolvimento;
- validar login e criação de conta em Web e Mobile.

## 10. Critérios de aceite

A vertical slice é aceita quando:

- `/entrar` permite Google e e-mail/senha;
- `/criar-conta` permite Google e nome/e-mail/senha/confirmação;
- `/recuperar-senha` inicia o fluxo oficial de recuperação;
- `/redefinir-senha` conclui o reset usando token válido;
- erros apresentados são amigáveis e não contêm detalhes do provider;
- JWT e cookies não aparecem na UI;
- `/auth/debug` não faz parte da experiência final;
- o proxy `/api/auth/[...path]` continua funcional;
- typecheck passa;
- testes passam;
- build passa;
- login Google é validado manualmente no `dindin-dev`;
- login e cadastro por e-mail são validados no `dindin-dev`;
- recuperação de senha é validada ponta a ponta no `dindin-dev`.

## 11. Próxima etapa

Depois da autenticação validada, a próxima vertical slice deve conectar a identidade autenticada ao perfil financeiro real do DindIn e começar o onboarding inicial sem alterar as fronteiras já estabelecidas:

```text
Web / Mobile
→ Auth
→ IdentityProvider
→ DindinService
→ DindinStore
→ domínio financeiro
```
