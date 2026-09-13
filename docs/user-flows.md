# DindIn — User Flows

## 1. Objetivo deste documento

Este documento descreve os principais fluxos de uso do DindIn antes da criação dos wireframes.

O objetivo é definir **comportamento e tomada de decisão**, não detalhes técnicos de implementação.

Cada fluxo deve responder:

- o que levou o usuário até ali;
- qual é sua intenção;
- quais informações o DindIn precisa mostrar;
- onde existe uma decisão;
- como o sistema reage;
- como o usuário retorna ao contexto anterior;
- qual é o estado final esperado.

Os wireframes posteriores devem respeitar estes fluxos. Uma tela não deve ser criada apenas porque “parece necessária”; ela deve existir para resolver uma etapa real de um fluxo.

---

## 2. Princípios gerais dos fluxos

### 2.1 O sistema orienta, mas não pune

O DindIn pode alertar, comparar, simular e sugerir. Ele não deve bloquear uma compra apenas porque ela parece financeiramente ruim.

O padrão é:

> **mostrar consequência → oferecer alternativas → deixar o usuário decidir.**

### 2.2 O saldo bancário não é tratado como dinheiro livre

Sempre que uma ação alterar receitas, despesas, orçamento, reservas ou compromissos, o DindIn deve recalcular e apresentar o efeito sobre o **Disponível para gastar**.

### 2.3 Ações rápidas não devem quebrar contexto

Em desktop/tablet, ações simples devem preferencialmente acontecer em drawer, painel lateral, popover ou modal quando isso evitar navegação desnecessária.

No mobile, ações rápidas podem ocupar uma tela própria curta, desde que o usuário consiga concluir e retornar imediatamente ao ponto de origem.

### 2.4 Toda consequência relevante deve ser explicável

Se o DindIn disser que uma compra “não cabe”, o usuário precisa entender o motivo.

Evitar respostas opacas como:

> Compra não recomendada.

Preferir:

> Esta compra ultrapassa seu orçamento de compras em R$ 70 e reduzirá seu dinheiro livre para R$ 42.

### 2.5 Planejamento e registro usam a mesma realidade financeira

Uma despesa registrada deve afetar orçamento, disponível e análise do mês. Uma compra planejada deve ser considerada no planejamento, mas não pode ser tratada como despesa realizada antes de acontecer.

---

# 3. UF-01 — Primeiro acesso e configuração financeira inicial

## Objetivo

Levar o usuário de “não tenho nada configurado” para uma primeira visão financeira útil sem exigir cadastro excessivo.

## Entrada

Primeiro acesso ao produto.

## Fluxo principal

```text
Início
  ↓
Boas-vindas e propósito do DindIn
  ↓
Informar renda mensal principal
  ↓
Informar dia/período de recebimento
  ↓
Cadastrar despesas fixas principais
  ↓
Cadastrar parcelas existentes
  ↓
Definir primeira meta de reserva (opcional guiada)
  ↓
DindIn monta uma primeira fotografia do mês
  ↓
Usuário revisa
  ↓
Ir para Visão geral
```

## Regras de UX

- não exigir que o usuário cadastre toda a vida financeira para começar;
- permitir pular itens e completar depois;
- explicar por que cada informação é pedida;
- mostrar progresso curto, não um formulário interminável;
- permitir edição posterior de tudo que foi informado.

## Resultado

O usuário chega à Home já vendo:

- renda prevista;
- despesas obrigatórias conhecidas;
- parcelas existentes;
- primeiro valor estimado de disponível;
- convite para montar os orçamentos do mês.

---

# 4. UF-02 — Montar o mês / distribuir a renda

## Objetivo

Dar função ao dinheiro antes de ele ser consumido.

## Entradas possíveis

- início de um novo mês;
- recebimento do salário;
- ação “Montar meu mês”;
- alerta de mês ainda não planejado.

## Fluxo principal

```text
Renda prevista/recebida
  ↓
Carregar obrigações conhecidas
  ↓
Carregar parcelas do mês
  ↓
Definir valores para reservas
  ↓
Definir limites de consumo
  ↓
Definir necessidades futuras / fundos acumuláveis
  ↓
Ver valor ainda sem destino
  ↓
Ajustar distribuição
  ↓
Confirmar plano do mês
  ↓
Atualizar Disponível para gastar
```

## Tela deve responder

- Quanto entrou ou deve entrar?
- Quanto já está comprometido?
- Quanto está protegido?
- Quanto foi separado para consumo?
- Quanto ainda está sem destino?

## Comportamento recomendado

O DindIn pode incentivar que o valor “sem destino” chegue a zero, mas deve explicar:

> Dar destino ao dinheiro não significa gastar tudo. Uma parte pode ter como destino continuar guardada.

## Exceção — orçamento incompatível com a renda

Se o usuário distribuir mais dinheiro do que possui:

```text
Planejamento > renda
  ↓
Mostrar diferença
  ↓
Indicar quais blocos podem ser ajustados
  ↓
Usuário reduz valores ou aceita plano deficitário conscientemente
```

Não bloquear silenciosamente.

---

# 5. UF-03 — Registrar despesa rapidamente

## Objetivo

Permitir que o usuário registre uma despesa em poucos segundos, especialmente no celular.

## Entrada mobile

Botão central `+` → `Despesa`.

## Entrada desktop/tablet

Ação `+ Despesa` no cabeçalho ou em contexto de Movimentações.

## Fluxo principal

```text
+ Despesa
  ↓
Informar valor
  ↓
Selecionar/confirmar categoria
  ↓
Descrição curta
  ↓
Forma de pagamento
  ↓
Salvar
  ↓
Atualizar orçamento relacionado
  ↓
Atualizar Disponível para gastar
  ↓
Feedback curto
```

## Campos essenciais

- valor;
- categoria;
- descrição;
- forma de pagamento.

Data deve assumir “agora/hoje” por padrão e poder ser alterada.

## Campos avançados

Devem ficar em `Mais opções` quando aplicável:

- data diferente;
- observação;
- vínculo com compra planejada;
- parcelamento;
- recorrência futura.

## Exceção — categoria próxima do limite

Após salvar:

> Você usou 84% do orçamento de Compras pessoais.

Não interromper o registro antes de a despesa ser salva.

## Exceção — categoria ultrapassada

Após salvar, abrir ação de replanejamento opcional:

> Compras pessoais ficou R$ 70 acima do planejado.
>
> Ajustar orçamento agora / Ver depois

---

# 6. UF-04 — Registrar receita

## Objetivo

Registrar entradas sem misturar automaticamente “receita” com “dinheiro livre”.

## Fluxo principal

```text
+ Receita
  ↓
Valor
  ↓
Origem/descrição
  ↓
Data
  ↓
Tipo: recorrente ou pontual
  ↓
Salvar
  ↓
DindIn identifica novo dinheiro sem destino
  ↓
Sugerir distribuir agora ou manter temporariamente livre
```

## Caso salário

Se a receita corresponder ao salário previsto:

> Marcar salário de setembro como recebido?

Evitar duplicidade entre previsão e recebimento real.

## Receita extra

Exemplo:

> Entraram R$ 300 extras. O que você quer fazer com esse dinheiro?

Ações sugeridas:

- reserva;
- objetivo;
- orçamento do mês;
- deixar disponível.

---

# 7. UF-05 — Criar ou editar orçamento

## Objetivo

Permitir que o usuário decida antecipadamente quanto quer gastar ou reservar em determinada finalidade.

## Fluxo principal

```text
Orçamentos
  ↓
Novo orçamento
  ↓
Escolher finalidade/categoria
  ↓
Definir valor mensal
  ↓
Definir tipo
    ├─ Limite de consumo
    ├─ Obrigação
    └─ Reserva/fundo
  ↓
Acumula saldo não usado?
  ↓
Salvar
  ↓
Recalcular distribuição do mês
```

## Tipos

### Limite de consumo

Exemplos:

- mercado;
- lazer;
- compras pessoais.

### Obrigação

Exemplos:

- moradia;
- estudos.

### Reserva/fundo acumulável

Exemplos:

- roupas;
- manutenção;
- presentes;
- necessidades futuras.

## Edição

Ao alterar um orçamento que já possui gastos:

> Você já gastou R$ 210 nesta categoria. O novo limite será R$ 180.
>
> A categoria ficará R$ 30 acima do planejado.

O usuário pode confirmar conscientemente.

---

# 8. UF-06 — Orçamento estourou / replanejar

## Objetivo

Transformar um estouro de orçamento em decisão consciente, não apenas em um indicador vermelho.

## Gatilho

Despesa registrada faz uma categoria exceder o limite.

## Fluxo

```text
Orçamento excedido
  ↓
Mostrar valor excedido
  ↓
Mostrar impacto no Disponível
  ↓
Oferecer alternativas
    ├─ Tirar de outro orçamento
    ├─ Reduzir dinheiro livre
    ├─ Reduzir aporte de objetivo não protegido
    ├─ Planejar compensação no restante do mês
    └─ Manter como está
  ↓
Confirmar escolha
  ↓
Atualizar planejamento
```

## Regra importante

Reserva protegida não deve aparecer como primeira opção para cobrir consumo.

Se o usuário quiser usar dinheiro protegido, o DindIn precisa tornar essa consequência explícita.

---

# 9. UF-07 — Quero comprar

## Objetivo

Criar uma pausa entre desejo e compra e transformar impulso em decisão analisada.

## Entradas

- ação principal `Quero comprar`;
- item vindo de `Coisas que estão faltando`;
- item vindo de um objetivo;
- contexto de um orçamento.

## Fluxo principal

```text
Quero comprar
  ↓
Informar item
  ↓
Informar valor
  ↓
Necessidade ou desejo?
  ↓
Quando gostaria de comprar?
  ↓
Forma de pagamento
    ├─ À vista
    └─ Parcelado
  ↓
Analisar compra
  ↓
DindIn mostra impacto
  ↓
Escolha
    ├─ Comprar agora
    ├─ Planejar para outro mês
    ├─ Transformar em objetivo
    └─ Salvar para decidir depois
```

## Resultado da análise deve mostrar

- orçamento relacionado;
- dinheiro disponível antes e depois;
- impacto sobre reservas, se houver;
- se exige replanejamento;
- no parcelado, impacto mensal e duração;
- comparação com opção de esperar.

## Linguagem

Evitar:

> Compra ruim.

Preferir:

> Se você comprar hoje, seu dinheiro livre cai de R$ 512 para R$ 232. Seu orçamento de compras ficará R$ 40 acima do planejado.

---

# 10. UF-08 — Adiar compra e transformar em objetivo

## Objetivo

Dar uma alternativa real ao “não comprar agora”.

## Origem

Resultado do fluxo `Quero comprar`.

## Fluxo

```text
Planejar compra
  ↓
Escolher data desejada
  ↓
DindIn calcula valor mensal sugerido
  ↓
Usuário aceita ou ajusta contribuição
  ↓
Criar objetivo
  ↓
Reservar valor mensal no planejamento futuro
  ↓
Acompanhar progresso
```

## Exemplo

> Tênis — R$ 350
>
> Guardando R$ 175 por mês, você pode comprar em aproximadamente 2 meses sem criar uma nova parcela.

## Resultado

Desejo deixa de ser “negado” e passa a ser **planejado**.

---

# 11. UF-09 — Compra parcelada / compromisso futuro

## Objetivo

Evitar que o usuário enxergue uma compra parcelada apenas pelo valor pequeno da parcela.

## Fluxo

```text
Compra parcelada
  ↓
Valor total
  ↓
Quantidade de parcelas
  ↓
Valor por parcela
  ↓
DindIn projeta impacto mensal futuro
  ↓
Mostrar mês final do compromisso
  ↓
Confirmar decisão
  ↓
Criar compromisso futuro
```

## Antes da confirmação

Mostrar algo como:

> R$ 600 em 10x de R$ 60
>
> Você comprometerá R$ 60 da sua renda pelos próximos 10 meses.
>
> Total comprometido: R$ 600.

## Regra

O parcelamento deve aparecer automaticamente na visão de compromissos futuros.

---

# 12. UF-10 — Parcela encerrada e dinheiro liberado

## Objetivo

Impedir que o fim de uma parcela seja interpretado automaticamente como espaço para outra dívida.

## Gatilho

Última parcela de um compromisso foi paga.

## Fluxo

```text
Última parcela concluída
  ↓
Momento comportamental expressivo
  ↓
Mostrar valor mensal liberado
  ↓
Perguntar o destino do valor
    ├─ Reserva
    ├─ Objetivo
    ├─ Necessidade futura
    ├─ Outro orçamento
    └─ Deixar livre
  ↓
Aplicar a partir do próximo planejamento
```

## Exemplo de copy

> **Mais espaço no seu mês. ✦**
>
> A geladeira terminou e liberou R$ 190 por mês.
>
> Para onde você quer mandar esse dinheiro agora?

## Regra de produto

> **Parcela que termina vira patrimônio, não nova parcela.**

O app deve incentivar essa mudança sem bloquear o usuário.

---

# 13. UF-11 — “Coisas que estão faltando”

## Objetivo

Capturar rapidamente necessidades percebidas antes que virem compras impulsivas.

## Fluxo rápido

```text
Adicionar item
  ↓
Nome
  ↓
Valor estimado (opcional)
  ↓
Quando acredita precisar
  ↓
Salvar
```

## Depois

O item pode:

- ir para `Quero comprar`;
- virar objetivo;
- ser descartado;
- permanecer aguardando;
- contribuir para identificação de padrão.

## Padrão recorrente

Se o sistema identificar várias compras/itens similares ao longo dos meses:

> Nos últimos 3 meses, itens para casa consumiram em média R$ 180/mês.
>
> Quer criar um orçamento para isso?

O objetivo é ensinar que certos “imprevistos” são previsíveis em nível de categoria.

---

# 14. UF-12 — Aporte em reserva ou objetivo

## Objetivo

Fazer o ato de guardar dinheiro parecer uma movimentação intencional e visível.

## Fluxo

```text
Objetivo/Reserva
  ↓
Adicionar valor
  ↓
Escolher origem
  ↓
Ver impacto no disponível
  ↓
Confirmar
  ↓
Atualizar progresso
```

## Regra

Mover dinheiro para reserva não deve aparecer como “despesa de consumo”.

O DindIn precisa diferenciar:

- dinheiro gasto;
- dinheiro reservado;
- dinheiro transferido entre finalidades.

---

# 15. UF-13 — Análise do mês no desktop/tablet

## Objetivo

Permitir entender rapidamente o que aconteceu e agir sem perder contexto.

## Fluxo

```text
Visão geral
  ↓
Identificar card/gráfico de interesse
  ↓
Selecionar categoria, período ou KPI
  ↓
Abrir detalhe contextual
  ↓
Inspecionar movimentações / orçamento / tendência
  ↓
Executar ação opcional
    ├─ editar orçamento
    ├─ corrigir movimentação
    ├─ replanejar
    └─ abrir módulo completo
  ↓
Fechar detalhe
  ↓
Retornar ao dashboard no mesmo estado
```

## Regra de interface

No desktop, detalhes curtos devem preferir drawer/painel lateral para preservar a visão do dashboard.

Uma página completa deve ser usada quando a tarefa exige:

- comparação ampla;
- edição complexa;
- histórico extenso;
- múltiplas operações.

---

# 16. UF-14 — Fechamento mensal

## Objetivo

Transformar o fim do mês em momento de aprendizado, não apenas relatório.

## Fluxo

```text
Fim do período
  ↓
Resumo do mês
  ↓
O que entrou
  ↓
O que saiu
  ↓
Quanto foi reservado
  ↓
Orçamentos dentro/fora do planejado
  ↓
Compras não planejadas
  ↓
Parcelas encerradas/iniciadas
  ↓
Saldo de fundos acumuláveis
  ↓
2 ou 3 aprendizados claros
  ↓
Preparar próximo mês
```

## Exemplos de insight

> Compras pessoais ficaram R$ 160 acima do planejado por dois meses seguidos.

> Você guardou R$ 500 antes de começar a gastar. Este foi seu melhor resultado até agora.

> O orçamento de roupas não foi usado e acumulará R$ 120 para o próximo mês.

## Evitar

- excesso de gráficos;
- score sem explicação;
- linguagem de culpa;
- dezenas de recomendações simultâneas.

---

# 17. UF-15 — Virada de mês

## Objetivo

Começar o novo período aproveitando o planejamento anterior sem obrigar o usuário a refazer tudo.

## Fluxo

```text
Novo mês
  ↓
Copiar despesas recorrentes
  ↓
Trazer parcelas ainda ativas
  ↓
Carregar fundos acumuláveis
  ↓
Trazer objetivos e reservas
  ↓
Revisar renda prevista
  ↓
Mostrar mudanças relevantes
  ↓
Usuário revisa e confirma
  ↓
Novo mês ativo
```

## Exemplos de mudanças destacadas

- parcela encerrada;
- parcela nova;
- orçamento que aumentou muito no mês anterior;
- receita recorrente alterada;
- fundo acumulado disponível.

---

# 18. Relações entre fluxos

```text
Primeiro acesso
      ↓
Montar o mês
      ↓
Visão geral
 ┌────┼──────────┬─────────────┐
 ↓    ↓          ↓             ↓
Gasto Receita Orçamentos   Quero comprar
 ↓                ↓             ↓
Impacto        Replanejar   Comprar agora
 ↓                ↑        /      |       \
Análise mensal ───┘   Parcelar  Adiar   Objetivo
                           ↓       ↓        ↓
                    Compromissos   └── Planejamento
                           ↓
                    Parcela termina
                           ↓
                    Redistribuir valor
                           ↓
                     Próximo mês
```

---

# 19. Estados que os wireframes precisam contemplar

Cada fluxo posterior deve considerar pelo menos os estados aplicáveis:

- vazio;
- primeiro uso;
- carregando;
- sucesso;
- erro recuperável;
- sem orçamento configurado;
- dentro do orçamento;
- próximo do limite;
- acima do limite;
- dinheiro sem destino;
- planejamento deficitário;
- compra que cabe;
- compra que exige ajuste;
- compra que invade valor protegido;
- parcela finalizada;
- objetivo concluído;
- mês encerrado.

---

# 20. Regras para os wireframes

Os próximos wireframes devem obedecer estas regras:

1. **uma tarefa principal clara por tela ou painel**;
2. o `Disponível para gastar` deve manter protagonismo nos contextos em que influencia uma decisão;
3. registrar despesa no mobile deve ser extremamente rápido;
4. o usuário nunca deve precisar navegar por várias telas apenas para corrigir um valor simples;
5. alertas financeiros devem indicar causa e consequência;
6. decisões irreversíveis ou que usam dinheiro protegido precisam de confirmação explícita;
7. ações de comportamento, como parcela encerrada, podem usar a linguagem visual expressiva da marca;
8. telas analíticas devem manter baixa densidade cromática mesmo com a identidade roxa/amarela;
9. nenhum fluxo deve depender de o usuário entender linguagem contábil;
10. o usuário deve sempre saber **o que mudou no dinheiro dele após uma ação**.

---

# 21. Fluxos prioritários para os primeiros wireframes

A ordem recomendada é:

1. **Visão geral — desktop/tablet**;
2. **Montar meu mês — desktop/tablet**;
3. **Orçamentos — desktop/tablet**;
4. **Registrar despesa — mobile**;
5. **Home — mobile**;
6. **Quero comprar — mobile**;
7. **Resultado da análise de compra**;
8. **Compromissos/parcelas — desktop/tablet**;
9. **Fechamento mensal**;
10. **Parcela encerrada / redistribuir valor**.

Essa sequência valida primeiro a proposta central do DindIn: **dar função ao dinheiro, registrar com pouco esforço e ajudar o usuário a decidir antes de gastar**.

---

## 22. Critério de conclusão desta etapa

A etapa de User Flows estará validada quando for possível responder, sem desenhar interface final:

- como o usuário começa;
- como organiza o mês;
- como registra o que aconteceu;
- como define limites;
- como reage quando passa do limite;
- como avalia uma compra antes de fazê-la;
- como o parcelamento afeta o futuro;
- como o dinheiro liberado volta a ser planejado;
- como aprende com o fechamento do mês;
- como inicia o próximo mês sem recomeçar do zero.

A partir daqui, o próximo artefato de design é **Wireframes Low-Fidelity**.