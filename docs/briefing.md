# DindIn — Briefing do Produto

## 1. Visão geral

**DindIn** é um aplicativo de reeducação financeira voltado a pessoas que têm dificuldade em controlar gastos, planejar o mês e construir uma relação mentalmente mais saudável com o próprio dinheiro.

O produto nasce a partir de um caso real usado como piloto: uma pessoa com renda mensal recorrente, despesas fixas, parcelas e compras variáveis que frequentemente sente que “está faltando alguma coisa” e acaba comprando antes de planejar.

O DindIn não deve ser tratado apenas como um app de controle financeiro. Seu propósito é atuar **antes da compra**, ajudando o usuário a dar função ao dinheiro, perceber consequências e tomar decisões conscientes.

> O app não pergunta apenas “quanto você gastou?”. Ele ajuda o usuário a decidir “eu deveria gastar isso agora?”.

---

## 2. Problema

O problema central não é simplesmente gastar demais.

O usuário pode até conhecer sua renda e algumas contas principais, mas ainda assim:

- enxerga o saldo bancário como dinheiro disponível;
- esquece necessidades não mensais no planejamento;
- sente que sempre existe algum item necessário que ficou de fora;
- compra por impulso ou sensação de urgência;
- parcela compras porque a parcela parece pequena;
- substitui parcelas que terminam por novas parcelas;
- guarda dinheiro apenas “se sobrar” no fim do mês;
- registra o passado, mas não planeja o futuro;
- tem dificuldade em perceber quanto da renda futura já está comprometida.

O resultado é a sensação recorrente de que o dinheiro desaparece, mesmo quando a renda não é totalmente consumida pelas despesas essenciais.

---

## 3. Público-alvo inicial

Pessoas que:

- recebem renda mensal previsível;
- possuem despesas fixas e parcelamentos;
- têm dificuldade para manter um orçamento;
- já tentaram planilhas ou apps financeiros, mas abandonaram;
- compram itens porque sentem que “estava faltando” algo;
- desejam aprender a controlar melhor o dinheiro;
- querem construir reserva financeira;
- precisam de orientação simples, sem linguagem contábil complexa.

### Persona piloto

O primeiro caso de validação do produto será o próprio caso que originou o DindIn.

#### Renda

- Salário mensal: **R$ 2.994,00**

#### Parcelas atuais

- Geladeira: **R$ 190,00 — parcela 10/10**
- CNH: **R$ 270,00 — parcela 3/7**

#### Despesas fixas mensais

- Moradia: **R$ 500,00**
- Estudos: **R$ 308,00 + R$ 184,00 = R$ 492,00**

#### Gastos variáveis observados

- Shopee: **R$ 890,00**
- Mercado Livre: **R$ 70,00**
- Cartão Caixa: **R$ 70,00**

Esse cenário será usado como massa de validação de UX e comportamento, e não como regra fixa do produto.

---

## 4. Proposta de valor

O DindIn ajuda o usuário a transformar dinheiro em decisões conscientes.

Em vez de mostrar apenas saldo, extrato e gráficos, o app deve responder perguntas como:

- Quanto eu realmente posso gastar?
- Quanto do meu dinheiro já tem destino?
- Quanto estou guardando para o futuro?
- Esta compra cabe no meu orçamento?
- Se eu parcelar, por quantos meses minha renda ficará comprometida?
- O que acontece quando uma parcela termina?
- Quais necessidades aparecem todo mês e deveriam estar no meu planejamento?
- Estou melhor ou pior que no mês passado?

---

## 5. Princípios do produto

### 5.1 O saldo bancário não é o saldo disponível

O valor principal do app deve ser o **dinheiro realmente disponível para gastar**, depois de descontar compromissos, reservas e valores planejados.

### 5.2 Todo dinheiro deve ter uma função

Ao receber a renda, o usuário deve distribuir o dinheiro entre:

- obrigações;
- orçamento de consumo;
- reservas;
- necessidades futuras;
- objetivos;
- dinheiro livre.

A meta ideal é reduzir o valor “sem destino” a zero, sem significar que todo dinheiro será gasto.

### 5.3 O app não deve proibir compras

O DindIn deve apresentar consequências e estimular decisões conscientes.

Exemplo:

> Esta compra ultrapassa seu orçamento de compras em R$ 70. Deseja reduzir outro orçamento, planejar para o próximo mês ou seguir mesmo assim?

### 5.4 Parcela que termina vira patrimônio, não nova parcela

Quando uma parcela acabar, o sistema deve destacar o valor mensal liberado e sugerir sua redistribuição para reserva, objetivo ou outra finalidade planejada.

### 5.5 Planejar antes de registrar

O produto deve atuar antes e depois da compra.

Registrar gastos continua importante, mas o diferencial está em ajudar o usuário **antes de gastar**.

### 5.6 Linguagem humana

Evitar termos contábeis desnecessários.

Preferir:

- Entrou
- Saiu
- Está reservado
- Você pode gastar
- Você comprometeu
- Você está guardando
- Restam X meses

---

## 6. Estrutura conceitual do dinheiro

O DindIn deve trabalhar com quatro grandes blocos mentais.

### 6.1 Vida obrigatória

Despesas que precisam ser pagas.

Exemplos:

- moradia;
- estudos;
- internet;
- energia;
- parcelas existentes;
- transporte essencial.

### 6.2 Eu do futuro

Valores protegidos para construção financeira.

Exemplos:

- reserva de emergência;
- objetivos;
- investimentos futuros.

### 6.3 Necessidades futuras

Gastos que não acontecem todo mês, mas inevitavelmente aparecem.

Exemplos:

- roupas;
- calçados;
- itens para casa;
- manutenção;
- saúde;
- eletrônicos;
- presentes.

Esses valores podem acumular entre meses.

### 6.4 Eu de hoje

Dinheiro destinado a consumo discricionário.

Exemplos:

- lazer;
- delivery;
- compras pessoais;
- Shopee;
- entretenimento.

---

## 7. Orçamentos

Orçamentos são um dos pilares do produto.

O usuário deve conseguir definir quanto pretende permitir para cada finalidade antes de gastar.

### 7.1 Tipos de orçamento

#### Obrigações

Valores normalmente derivados de despesas recorrentes.

#### Limites de consumo

Exemplos:

- mercado;
- lazer;
- delivery;
- compras pessoais.

#### Reservas

Exemplos:

- emergência;
- roupas;
- manutenção;
- viagem;
- compra planejada.

### 7.2 Orçamentos acumuláveis

Alguns orçamentos devem permitir carregar o saldo não utilizado para o mês seguinte.

Exemplo:

- Compras pessoais: R$ 200/mês
- Gasto realizado: R$ 50
- Saldo carregado: R$ 150
- Próximo mês: R$ 350 disponíveis

Isso é especialmente útil para compras menos frequentes.

### 7.3 Excesso de orçamento

Ao registrar ou simular uma compra que ultrapasse o orçamento, o app deve sugerir caminhos:

- retirar valor de outro orçamento;
- reduzir uma meta;
- planejar para outro mês;
- seguir mesmo assim.

O sistema informa; o usuário decide.

---

## 8. “Quero comprar”

Uma funcionalidade central do DindIn será **Quero comprar**.

Seu objetivo é criar uma pausa entre desejo e compra.

O usuário informa:

- item;
- valor;
- necessidade ou desejo;
- prazo em que acredita precisar;
- forma de pagamento.

O app analisa:

- orçamento disponível;
- impacto sobre dinheiro livre;
- impacto sobre reservas;
- impacto de parcelamento;
- possibilidade de adiar;
- melhor mês para realizar a compra.

O sistema pode sugerir:

- comprar agora;
- planejar para outro mês;
- adicionar à lista de desejos;
- guardar um valor mensal até alcançar o preço.

---

## 9. Parcelamentos e renda futura

Parcelamento deve ser apresentado como **compromisso de renda futura**, nunca apenas como parcela pequena.

Exemplo:

> Compra de R$ 600 em 10x de R$ 60.
>
> Você está comprometendo R$ 60 da sua renda pelos próximos 10 meses.
>
> Valor total comprometido: R$ 600.

O DindIn deve mostrar uma visão futura dos compromissos mensais e destacar quando parcelas terminarem.

---

## 10. “Coisas que estão faltando”

O usuário deve poder registrar rapidamente itens que sente precisar comprar.

Exemplos:

- tênis;
- cabo USB;
- panela;
- camiseta;
- item de estudo.

O objetivo não é apenas criar uma wishlist.

O sistema deve identificar padrões ao longo do tempo e ajudar o usuário a perceber que determinados “imprevistos” são recorrentes e deveriam virar orçamento.

Exemplo:

> Nos últimos três meses você gastou em média R$ 210/mês com itens para casa e uso pessoal. Deseja criar um orçamento mensal para isso?

---

## 11. Reserva financeira

A primeira meta sugerida para usuários sem reserva deve ser simples e alcançável.

Exemplo do piloto:

1. primeira meta: R$ 3.000;
2. segunda meta: R$ 6.000;
3. evolução posterior para múltiplos meses de despesas essenciais.

O produto não deve transformar investimento em prioridade antes de o usuário estruturar orçamento e reserva básica.

---

## 12. Experiência por dispositivo

### Mobile

Tarefa mental principal:

> Registrar → consultar → decidir uma compra.

Prioridades:

- registrar despesa rapidamente;
- registrar receita rapidamente;
- consultar disponível;
- consultar orçamento restante;
- usar “Quero comprar”.

### Desktop e tablet

Tarefa mental principal:

> Observar → entender → planejar → corrigir.

Prioridades:

- dashboard;
- análise do mês;
- comparação entre períodos;
- orçamentos;
- planejamento;
- compromissos futuros;
- parcelas;
- objetivos.

> Mobile não é dashboard reduzido. Desktop não é formulário ampliado.

---

## 13. Escopo conceitual inicial

O produto deve contemplar, em sua primeira definição funcional:

- renda mensal;
- despesas fixas;
- despesas variáveis;
- receitas;
- parcelas;
- dinheiro disponível;
- orçamento por finalidade;
- orçamento acumulável;
- reserva financeira;
- objetivos;
- lista “Quero comprar”;
- lista “Coisas que estão faltando”;
- simulador de compra;
- compromissos futuros;
- fechamento mensal.

---

## 14. Fora desta etapa documental

Ainda não serão definidos nesta fase:

- stack tecnológica;
- banco de dados;
- APIs;
- Open Finance;
- integração bancária;
- autenticação;
- arquitetura;
- backlog de desenvolvimento;
- monetização.

Esses tópicos serão tratados após a validação do briefing e da direção de UI/UX.

---

## 15. Critério de sucesso do produto

O DindIn será bem-sucedido se conseguir mudar a pergunta mental do usuário de:

> “Tenho dinheiro na conta?”

para:

> “Esse dinheiro está disponível para esta compra?”

E, com o tempo, de:

> “Vou guardar o que sobrar.”

para:

> “Vou decidir primeiro quanto guardar e depois quanto posso gastar.”
