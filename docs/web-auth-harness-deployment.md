# DindIn — Deploy do Auth Dev Harness

> Status: **harness Web implantado na Vercel e domínio autorizado no Managed Better Auth**  
> Data de referência: **2026-09**

## Objetivo

Este deploy existe apenas para validar o fluxo real de autenticação antes da UI definitiva do DindIn.

```text
Vercel / Next.js
→ Entrar com Google
→ Managed Better Auth
→ sessão
→ JWT
→ futura chamada autenticada à DindIn API
```

## Projeto Vercel

Foi criado um projeto isolado de desenvolvimento chamado:

```text
dindin-dev
```

O deploy usa Next.js e o package `apps/web` como referência funcional do harness.

O primeiro build falhou porque as variáveis enviadas diretamente no payload de deploy não ficaram disponíveis durante o build do Next.js. O segundo build foi ajustado e terminou com estado `READY`.

## Segredos

Nenhum cookie secret, token, connection string ou credencial OAuth foi versionado no GitHub.

Durante esta validação temporária, a configuração de Auth foi enviada diretamente ao ambiente de deployment da Vercel, fora do repositório.

Antes de um deploy persistente ou beta, esses valores deverão ser migrados para o gerenciamento oficial de Environment Variables da Vercel.

## Trusted domain

A origem do preview ativo foi adicionada à allowlist de `trusted domains` do Managed Better Auth da branch principal do `DindIn-dev`.

Isso permite que o `callbackURL` do Google OAuth retorne ao harness após o handshake do Managed Better Auth.

Como previews da Vercel usam hosts específicos por deployment, novos previews podem exigir nova autorização ou uma estratégia de domínio estável/wildcard antes de uso contínuo.

## Proteção da Vercel

O preview está protegido pela camada de autenticação da Vercel.

Para a validação manual foi gerado um link temporário de compartilhamento que concede acesso ao preview sem publicar permanentemente o ambiente. Esse link é temporário e não deve ser versionado.

## O que já está validado

- projeto `dindin-dev` criado na Vercel;
- build Next.js concluído com sucesso;
- rota `/api/auth/[...path]` compilada;
- página `/auth/sign-in` compilada;
- página `/auth/debug` compilada;
- domínio do preview incluído nos trusted domains do Neon Auth;
- nenhum segredo registrado no repositório.

## Próxima validação manual

```text
abrir link temporário do preview
→ clicar em Entrar com Google
→ autenticar com a conta de desenvolvimento
→ retornar para /auth/debug
→ confirmar sessão = ativa
→ confirmar JWT = emitido
```

Depois dessa confirmação, a próxima etapa técnica é implantar a API de desenvolvimento e usar o JWT real para chamar `GET /v1/me`, validando `NeonJwtIdentityProvider`, JWKS e ownership ponta a ponta.
