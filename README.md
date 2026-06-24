# 👑 Imperatore - Sistema de Gestão para Restaurantes, Bares e Cafés

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-5.5+-orange)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---


## 📋 Sobre o Projeto

**Imperatore** é um sistema completo de gestão para restaurantes, bares e cafés, desenvolvido para organizar todo o fluxo operacional desde a criação do cardápio até a entrega do pedido na mesa.

O sistema conecta quatro áreas principais:
- **Administração** (Admin)
- **Gestão** (Dono e Gerente)
- **Salão** (Atendente)
- **Cozinha**

---

## 📖 Documentação Completa

Acesse a documentação completa do sistema [clicando aqui](./doc/imperatore-documento.pdf).

## 🚀 Acessos do Sistema

### 👑 Administrador do Sistema (Eu, o Matheus Abib)
- Gerenciamento de estabelecimentos
- Gerenciamento de usuários de todos os estabelecimentos
- Visualização completa de logs de ações
- Painel administrativo centralizado

### 📊 Dono / Gerente do Estabelecimento
- **Dashboard:** gráficos de margens, top 10 produtos, alertas de validade
- **Análise de Vendas:** produtos mais vendidos, mais lucrativos, distribuição do faturamento, produtos sem venda
- **Cardápio:** cadastro e gerenciamento de produtos com ficha técnica
- **Ingredientes:** cadastro com fator de conversão e custo unitário
- **Lotes:** controle de estoque por lotes com data de validade
- **Relatórios:** exportação em Excel e PDF de todos os dados
- **Usuários:** gerenciamento de funcionários
- **Logs:** histórico completo de ações

### 🍽️ Atendente do Estabelecimento
- Abertura e gerenciamento de comandas por mesa
- Adição de produtos com quantidade e observações
- Acompanhamento de status dos pedidos
- Fechamento de comandas

### 🍳 Cozinha do Estabelecimento
- Visualização de pedidos em tempo real (atualização a cada 5 segundos)
- Organização por status: Pendentes, Em preparo, Prontos
- Atualização de status (iniciar preparo, marcar como pronto)
- Alertas de pedidos prontos há mais de 5 minutos

---


## 📊 Funcionalidades Detalhadas

### 📦 Cadastro do Cardápio
- Cadastro de **ingredientes** com nome, unidade, custo e fator de conversão
- Cálculo automático do custo por unidade de uso
- Cadastro de **produtos** com nome, preço de venda e categoria
- Ficha técnica: associação de ingredientes com quantidades
- Cálculo automático: custo total, margem de lucro, lucro em reais

### 📦 Controle de Estoque (Lotes)
- Registro de lotes por ingrediente
- Controle de quantidade e data de validade
- Sistema de cores: vermelho (vencido), amarelo (vence hoje), laranja (vence em até 7 dias), verde (OK)
- Baixa automática de estoque no consumo

### 📝 Comandas e Pedidos
- Abertura de comanda por mesa
- Adição de produtos com quantidade e observações
- Status: pendente → em preparo → pronto → entregue
- Fechamento de comanda com exclusão automática após 2 horas

### 📊 Análise de Vendas
- Ranking de produtos mais vendidos
- Ranking de produtos mais lucrativos
- Distribuição do faturamento por produto
- Resumo geral: faturamento total, lucro total, margem geral
- Identificação de produtos sem venda
- Dados históricos com preço registrado no momento da venda

### 📁 Relatórios
- Exportação em **Excel** e **PDF**
- Relatórios: Produtos, Ingredientes, Lotes, Análise de Vendas
- Relatório completo com todos os dados

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas

### Frontend
- **React** - Biblioteca para construção de UI
- **React Router DOM** - Navegação entre páginas
- **Recharts** - Gráficos e visualizações
- **React Icons** - Biblioteca de ícones
- **React Toastify** - Notificações
- **Socket.io Client** - Comunicação em tempo real

### Ferramentas de Relatórios
- **xlsx** - Exportação de arquivos Excel
- **jspdf** - Exportação de arquivos PDF

---

## 👥 Perfis e Permissões

| Perfil | Descrição |
|--------|-----------|
| **Admin** | Visão completa do sistema, gerencia estabelecimentos, usuários e logs de ações |
| **Dono** |    Gestão total do seu estabelecimento (produtos, ingredientes, estoque, usuários, relatórios) |
| **Gerente** | Gestão operacional (produtos, ingredientes, estoque, relatórios, comandas) |
| **Atendente** | Criação de comandas, pedidos e gerenciamento de mesas |
| **Cozinha** | Visualização e atualização de status dos pedidos |

---
