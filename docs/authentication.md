# DindIn — Autenticação e Identidade

> Status: **fronteira de autenticação implementada; Managed Better Auth ainda não provisionado**  
> Data de referência: **2026-09**

## 1. Objetivo

A autenticação do DindIn deve poder evoluir sem contaminar as regras financeiras, os casos de uso ou a camada de persistência.

A aplicação trabalha somente com uma identidade já validada:

```text
request
→ IdentityProvider
→ userId confiável
→ DindinService
→ domínio / persistência
```

O domínio financeiro nunca valida tokens, cookies ou headers HTTP.

---

## 2. Porta de identidade

A abstração canônica está em:

```text
apps/api/src/ports/identity-provider.ts
```

Contrato:

```text
IdentityProvider.resolve(request)
→ { userId }
→ null quando não autenticado
```

A API recebe um `IdentityProvider` por composição e não conhece o mecanismo concreto de login.

---

## 3. Adapter do piloto

Arquivo:

```text
apps/api/src/adapters/pilot-header-identity-provider.ts
```

Durante o piloto pessoal existe o adapter:

```text
x-dindin-user-id: <UUID>
```

Ele valida somente a forma do UUID e devolve esse valor como identidade.

> **Este mecanismo não é autenticação segura.**

Ele existe exclusivamente para desenvolvimento e piloto pessoal. Possuir um UUID é suficiente para impersonar um usuário, portanto o adapter não pode ser habilitado em beta ou produção pública.

---

## 4. Adapter Managed Better Auth / JWT

Arquivo:

```text
apps/api/src/adapters/neon-jwt-identity-provider.ts
```

O adapter real foi preparado para tokens emitidos pelo **Managed Better Auth do Neon**, que atualmente é baseado em Better Auth.

Fluxo previsto:

```text
Web / Mobile
→ autentica no Managed Better Auth
→ obtém sessão
→ quando a API separada precisar de token, obtém JWT
→ Authorization: Bearer <token>
→ DindIn API
→ NeonJwtIdentityProvider
→ JWKS
→ assinatura + issuer + audience
→ userId confiável
```

O adapter verifica:

- presença de `Authorization: Bearer`;
- assinatura por chave pública publicada no JWKS;
- algoritmo EdDSA;
- issuer esperado;
- audience esperada;
- `sub`/identificador do usuário como UUID válido.

A implementação usa `jose` e `createRemoteJWKSet`, permitindo cache/rotação de chaves sem acoplar as rotas ao provedor.

---

## 5. Composition root

O `composition.ts` pode montar dois cenários.

### Piloto pessoal

```text
DATABASE_URL
→ DrizzleDindinStore
→ PilotHeaderIdentityProvider
→ createApiApp
```

### Ambiente autenticado

```text
DATABASE_URL
+ NEON_AUTH_BASE_URL
(+ JWKS URL quando fornecida pela plataforma)
→ DrizzleDindinStore
→ NeonJwtIdentityProvider
→ createApiApp
```

O comportamento financeiro e os casos de uso permanecem os mesmos.

---

## 6. OpenAPI

As rotas protegidas documentam dois esquemas como alternativas OR:

```text
NeonAuthBearer
OU
PilotUserId
```

`NeonAuthBearer`:

```text
HTTP Bearer / JWT
```

`PilotUserId`:

```text
apiKey header x-dindin-user-id
```

A presença do esquema do piloto no OpenAPI durante o desenvolvimento não significa que ele será habilitado em produção.

---

## 7. Regras de segurança

1. A API nunca deve aceitar `userId` vindo do corpo da requisição como identidade.
2. Ownership é derivado exclusivamente do `IdentityProvider`.
3. Tokens, cookies e connection strings não devem aparecer em logs, analytics ou respostas de erro.
4. O adapter do piloto deve ser removido/desabilitado no composition root de beta/produção.
5. O JWT deve ser validado criptograficamente; decodificar sem validar não é autenticação.
6. `issuer` e `audience` precisam corresponder ao ambiente esperado.
7. Chaves públicas devem vir do JWKS do ambiente/branch correto.
8. Erro de token inválido deve retornar `401`, sem revelar detalhes criptográficos ao cliente.
9. O app não deve persistir JWT de acesso como dado financeiro ou de domínio.
10. RLS pode ser adicionada como defesa adicional, mas não substitui autorização na aplicação.

---

## 8. Sessão Web versus JWT

Para o Web, a preferência é usar a sessão/cookie seguro fornecido pelo Managed Better Auth quando o desenho de implantação permitir.

JWT é especialmente útil para:

- API em domínio/origem separado;
- aplicativo mobile;
- serviços que não compartilham o cookie do navegador.

A decisão de usar JWT na API não significa substituir o gerenciamento de sessão do Web por tokens persistidos manualmente.

---

## 9. Estado atual

Já implementado:

- `IdentityProvider` como porta;
- `PilotHeaderIdentityProvider`;
- `NeonJwtIdentityProvider`;
- injeção da identidade em `createApiApp`;
- composition root para piloto e para JWT;
- OpenAPI com Bearer JWT + fallback de piloto;
- teste HTTP provando que as rotas não dependem do header do piloto;
- `jose` como biblioteca de verificação JWT.

Ainda não executado:

- provisionamento do Managed Better Auth no `DindIn-dev`;
- criação de usuário real de teste;
- login real;
- emissão de JWT real;
- teste contra JWKS real;
- configuração de OAuth;
- configuração de domínio confiável;
- política final de sessão para Web;
- fluxo de autenticação do Expo/React Native.

---

## 10. Próxima validação

A próxima etapa de autenticação, após aprovação explícita, é:

```text
provisionar Managed Better Auth no DindIn-dev
→ consultar configuração gerada
→ criar usuário técnico de desenvolvimento
→ obter/validar fluxo de sessão/token
→ testar NeonJwtIdentityProvider com JWT real
→ remover dependência do header técnico no primeiro deploy autenticado
```

Como o Managed Better Auth é um recurso externo e cria estruturas/serviços de autenticação no ambiente Neon, seu provisionamento deve ser uma ação explícita e separada da simples alteração de código.
