-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 24/06/2026 às 17h29min
-- Versão do Servidor: 5.5.20
-- Versão do PHP: 5.3.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de Dados: `imperatore`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `comandas`
--

CREATE TABLE IF NOT EXISTS `comandas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numero_mesa` int(11) NOT NULL,
  `nome_cliente` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'aberta',
  `total` decimal(10,2) DEFAULT '0.00',
  `estabelecimento_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `estabelecimento_id` (`estabelecimento_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=25 ;

--
-- Extraindo dados da tabela `comandas`
--

INSERT INTO `comandas` (`id`, `numero_mesa`, `nome_cliente`, `status`, `total`, `estabelecimento_id`, `created_at`, `updated_at`) VALUES
(22, 1, NULL, 'aberta', 18.00, 1, '2026-06-23 12:02:43', '2026-06-24 14:10:20'),
(23, 2, 'Júlio', 'aberta', 53.00, 1, '2026-06-24 14:10:15', '2026-06-24 14:10:32'),
(24, 3, 'Matheus', 'aberta', 30.00, 1, '2026-06-24 14:12:06', '2026-06-24 14:12:11');

-- --------------------------------------------------------

--
-- Estrutura da tabela `estabelecimentos`
--

CREATE TABLE IF NOT EXISTS `estabelecimentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `plano` varchar(20) DEFAULT 'gratis',
  `status` varchar(20) DEFAULT 'ativo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endereco` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `cpf_dono` varchar(14) DEFAULT NULL,
  `nome_dono` varchar(100) DEFAULT NULL,
  `data_abertura` date DEFAULT NULL,
  `observacoes` text,
  `cep` varchar(10) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=5 ;

--
-- Extraindo dados da tabela `estabelecimentos`
--

INSERT INTO `estabelecimentos` (`id`, `nome`, `cnpj`, `plano`, `status`, `created_at`, `endereco`, `numero`, `telefone`, `cpf_dono`, `nome_dono`, `data_abertura`, `observacoes`, `cep`, `estado`) VALUES
(1, 'Bar do Joao', '00.000.000/0001-00', 'profissional', 'ativo', '2026-06-12 15:08:14', 'Rua Professor ', NULL, '(11) 11111-1111', '111.111.111-11', 'Veio Feioso 1', '2021-09-20', NULL, '11111-111', 'SP');

-- --------------------------------------------------------

--
-- Estrutura da tabela `ingredientes`
--

CREATE TABLE IF NOT EXISTS `ingredientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `unidade` varchar(20) NOT NULL,
  `custo_medio` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estabelecimento_id` int(11) DEFAULT NULL,
  `fator_conversao` decimal(10,2) NOT NULL DEFAULT '1.00',
  `unidade_uso` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ingredientes_fk_estabelecimento` (`estabelecimento_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=162 ;

--
-- Extraindo dados da tabela `ingredientes`
--

INSERT INTO `ingredientes` (`id`, `nome`, `unidade`, `custo_medio`, `created_at`, `estabelecimento_id`, `fator_conversao`, `unidade_uso`) VALUES
(131, 'Pão de Hambúrguer', 'un', 1.50, '2026-06-22 13:19:38', 1, 1.00, 'un'),
(132, 'Carne Moída', 'kg', 29.00, '2026-06-22 13:19:38', 1, 10.00, 'porção'),
(133, 'Queijo Mussarela', 'kg', 22.00, '2026-06-22 13:19:38', 1, 8.00, 'fatia'),
(134, 'Alface', 'un', 2.00, '2026-06-22 13:19:38', 1, 1.00, 'folha'),
(135, 'Tomate', 'kg', 6.00, '2026-06-22 13:19:38', 1, 5.00, 'rodela'),
(136, 'Cebola', 'kg', 4.00, '2026-06-22 13:19:38', 1, 10.00, 'rodela'),
(137, 'Picles', 'un', 0.50, '2026-06-22 13:19:38', 1, 1.00, 'un'),
(138, 'Maionese', 'kg', 8.00, '2026-06-22 13:19:38', 1, 20.00, 'g'),
(139, 'Ketchup', 'kg', 7.00, '2026-06-22 13:19:38', 1, 20.00, 'g'),
(140, 'Mostarda', 'kg', 7.00, '2026-06-22 13:19:38', 1, 20.00, 'g'),
(141, 'Bacon', 'kg', 25.00, '2026-06-22 13:19:38', 1, 8.00, 'fatia'),
(142, 'Ovo', 'un', 1.00, '2026-06-22 13:19:38', 1, 1.00, 'un'),
(143, 'Massa de Lasanha', 'kg', 12.00, '2026-06-22 13:19:38', 1, 1.00, 'kg'),
(144, 'Molho de Tomate', 'kg', 8.00, '2026-06-22 13:19:38', 1, 1.00, 'kg'),
(145, 'Carne Moida', 'kg', 29.00, '2026-06-22 13:19:38', 1, 10.00, 'porção'),
(146, 'Queijo Parmesão', 'kg', 30.00, '2026-06-22 13:19:38', 1, 10.00, 'g'),
(147, 'Presunto', 'kg', 18.00, '2026-06-22 13:19:38', 1, 8.00, 'fatia'),
(148, 'Pão Francês', 'pct', 8.00, '2026-06-22 13:19:38', 1, 10.00, 'un'),
(149, 'Manteiga', 'kg', 12.00, '2026-06-22 13:19:38', 1, 20.00, 'g'),
(150, 'Refrigerante', 'l', 3.00, '2026-06-22 13:19:38', 1, 1.00, 'l'),
(151, 'Suco', 'l', 4.00, '2026-06-22 13:19:38', 1, 1.00, 'l'),
(152, 'Água', 'un', 4.50, '2026-06-22 13:19:38', 1, 1.00, 'un'),
(153, 'Cerveja', 'l', 5.00, '2026-06-22 13:19:38', 1, 1.00, 'l'),
(154, 'Batata Frita', 'kg', 10.00, '2026-06-22 13:19:38', 1, 8.00, 'porção'),
(155, 'Frango', 'kg', 15.00, '2026-06-22 13:19:38', 1, 8.00, 'porção'),
(156, 'Arroz', 'kg', 5.00, '2026-06-22 13:19:38', 1, 1.00, 'kg'),
(157, 'Feijão', 'kg', 6.00, '2026-06-22 13:19:38', 1, 1.00, 'kg'),
(158, 'Farofa', 'kg', 4.00, '2026-06-22 13:19:38', 1, 1.00, 'kg'),
(159, 'Vinagrete', 'kg', 5.00, '2026-06-22 13:19:38', 1, 1.00, 'kg'),
(160, 'Molho Barbecue', 'kg', 10.00, '2026-06-22 13:19:38', 1, 20.00, 'g'),
(161, 'Guaraná', 'un', 6.00, '2026-06-22 14:04:10', 1, 200.00, 'ml');

-- --------------------------------------------------------

--
-- Estrutura da tabela `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `estabelecimento_id` int(11) DEFAULT NULL,
  `modulo` varchar(50) NOT NULL,
  `acao` varchar(100) NOT NULL,
  `descricao` text NOT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=159 ;

--
-- Extraindo dados da tabela `logs`
--

INSERT INTO `logs` (`id`, `usuario_id`, `estabelecimento_id`, `modulo`, `acao`, `descricao`, `ip`, `created_at`) VALUES
(82, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Água Mineral à comanda 17 (Mesa 1)', '::1', '2026-06-22 13:40:46'),
(83, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Bife à Milanesa à comanda 17 (Mesa 1)', '::1', '2026-06-22 13:40:47'),
(84, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Farofa à comanda 17 (Mesa 1)', '::1', '2026-06-22 13:40:49'),
(85, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Bife à Milanesa à comanda 18 (Mesa 2)', '::1', '2026-06-22 13:40:59'),
(86, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Batata Frita à comanda 18 (Mesa 2)', '::1', '2026-06-22 13:41:00'),
(87, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 2x Cerveja à comanda 18 (Mesa 2)', '::1', '2026-06-22 13:50:29'),
(88, 9, 1, 'Comandas', 'Fechou', 'Fechou comanda da Mesa 2 - Total: R$ 77.00', '::1', '2026-06-22 13:50:31'),
(89, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 14x X-Bacon à comanda 17 (Mesa 1)', '::1', '2026-06-22 13:51:04'),
(90, 9, 1, 'Comandas', 'Fechou', 'Fechou comanda da Mesa 1 - Total: R$ 443.00', '::1', '2026-06-22 13:51:08'),
(91, 11, 1, 'Produtos', 'Editou', 'Editou produto "X-Bacon" (ID: 97)', '::1', '2026-06-22 13:54:11'),
(92, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x X-Bacon à comanda 19 (Mesa 3)', '::1', '2026-06-22 14:00:23'),
(93, 9, 1, 'Comandas', 'Removeu Item', 'Removeu item da comanda 19', '::1', '2026-06-22 14:00:43'),
(94, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x X-Bacon à comanda 19 (Mesa 3)', '::1', '2026-06-22 14:00:58'),
(95, 9, 1, 'Comandas', 'Fechou', 'Fechou comanda da Mesa 3 - Total: R$ 48.00', '::1', '2026-06-22 14:01:03'),
(96, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Água Mineral à comanda 20 (Mesa 4)', '::1', '2026-06-22 14:02:09'),
(97, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 3x Água Mineral à comanda 20 (Mesa 4)', '::1', '2026-06-22 14:02:17'),
(98, 11, 1, 'Ingredientes', 'Criou', 'Criou ingrediente "Guaraná" (un)', '::1', '2026-06-22 14:04:10'),
(99, 11, 1, 'Produtos', 'Adicionou Ingrediente', 'Adicionou 1x Água ao produto "Água Mineral"', '::1', '2026-06-22 14:07:38'),
(100, 11, 1, 'Produtos', 'Removeu Ingrediente', 'Removeu ingrediente ID 152 do produto "Água Mineral"', '::1', '2026-06-22 14:07:53'),
(101, 11, 1, 'Produtos', 'Adicionou Ingrediente', 'Adicionou 1x Água ao produto "Água Mineral"', '::1', '2026-06-22 14:08:57'),
(102, 11, 1, 'Ingredientes', 'Editou', 'Editou ingrediente "Água" (ID: 152)', '::1', '2026-06-22 14:10:11'),
(103, 11, 1, 'Produtos', 'Removeu Ingrediente', 'Removeu ingrediente ID 152 do produto "Água Mineral"', '::1', '2026-06-22 14:10:21'),
(104, 11, 1, 'Produtos', 'Adicionou Ingrediente', 'Adicionou 1x Água ao produto "Água Mineral"', '::1', '2026-06-22 14:10:31'),
(105, 11, 1, 'Produtos', 'Editou', 'Editou produto "Água Mineral" (ID: 114)', '::1', '2026-06-22 14:11:12'),
(106, 11, 1, 'Produtos', 'Editou', 'Editou produto "Água Mineral" (ID: 114)', '::1', '2026-06-22 14:12:07'),
(107, 11, 1, 'Ingredientes', 'Editou', 'Editou ingrediente "Água" (ID: 152)', '::1', '2026-06-22 14:12:41'),
(108, 11, 1, 'Lotes', 'Registrou', 'Registrou lote de 2x Água (Validade: 2026-09-20)', '::1', '2026-06-22 14:13:17'),
(109, 11, 1, 'Lotes', 'Deletou', 'Deletou lote ID: 50 (2.00x Água)', '::1', '2026-06-22 14:17:33'),
(110, 11, 1, 'Lotes', 'Registrou', 'Registrou lote de 12x Água (Validade: 2028-10-20)', '::1', '2026-06-22 14:20:35'),
(111, 11, 1, 'Lotes', 'Deletou', 'Deletou lote ID: 51 (12.00x Água)', '::1', '2026-06-22 14:26:34'),
(112, 9, 1, 'Auth', 'Login', 'Usuário luciasilva@gmail.com fez login', '::1', '2026-06-22 14:34:21'),
(113, 14, 1, 'Auth', 'Login', 'Usuário cozinha@email.com fez login', '::1', '2026-06-22 14:35:52'),
(114, 14, 1, 'Pedidos', 'Mudou Status', 'Pedido 53 - Água Mineral (3.00x) - Status: preparo (Mesa 4)', '::1', '2026-06-22 14:35:55'),
(115, 14, 1, 'Pedidos', 'Mudou Status', 'Pedido 53 - Água Mineral (3.00x) - Status: pronto (Mesa 4)', '::1', '2026-06-22 14:35:56'),
(116, 15, NULL, 'Auth', 'Login', 'Usuário admin@imperatore.com fez login', '::1', '2026-06-22 14:36:22'),
(117, 11, 1, 'Auth', 'Login', 'Usuário hanna@gmail.com fez login', '::1', '2026-06-22 14:36:56'),
(118, 14, 1, 'Auth', 'Login', 'Usuário cozinha@email.com fez login', '::1', '2026-06-22 15:07:29'),
(119, 9, 1, 'Auth', 'Login', 'Usuário luciasilva@gmail.com fez login', '::1', '2026-06-22 15:07:48'),
(120, 11, 1, 'Auth', 'Login', 'Usuário hanna@gmail.com fez login', '::1', '2026-06-22 15:09:25'),
(121, 11, 1, 'Ingredientes', 'Editou', 'Editou ingrediente "Água" (ID: 152)', '::1', '2026-06-23 11:37:16'),
(122, 9, 1, 'Auth', 'Login', 'Usuário luciasilva@gmail.com fez login', '::1', '2026-06-23 11:58:54'),
(123, 9, 1, 'Comandas', 'Criou', 'Criou comanda da Mesa 1', '::1', '2026-06-23 12:02:43'),
(124, 9, 1, 'Auth', 'Login', 'Usuário luciasilva@gmail.com fez login', '::1', '2026-06-23 12:22:31'),
(125, 15, NULL, 'Auth', 'Login', 'Usuário admin@imperatore.com fez login', '::1', '2026-06-23 12:25:03'),
(126, 14, 1, 'Auth', 'Login', 'Usuário cozinha@email.com fez login', '::1', '2026-06-23 12:27:48'),
(127, 11, 1, 'Auth', 'Login', 'Usuário hanna@gmail.com fez login', '::1', '2026-06-23 12:28:07'),
(128, 11, 1, 'Notificacoes', 'Marcou Todas Lidas', 'Marcou todas as notificações como lidas', '::1', '2026-06-23 12:53:19'),
(129, 9, 1, 'Comandas', 'Fechou', 'Fechou comanda da Mesa 4 - Total: R$ 20.00', '::1', '2026-06-23 12:59:59'),
(130, 9, 1, 'Comandas', 'Fechou', 'Fechou comanda da Mesa 5 - Total: R$ 0.00', '::1', '2026-06-23 13:00:04'),
(131, 15, NULL, 'Auth', 'Login', 'Usuário admin@imperatore.com fez login', '::1', '2026-06-23 15:47:14'),
(132, 15, NULL, 'Auth', 'Login', 'Usuário admin@imperatore.com fez login', '::1', '2026-06-23 15:51:08'),
(133, 11, 1, 'Auth', 'Login', 'Usuário hanna@gmail.com fez login', '::1', '2026-06-23 15:51:17'),
(134, 11, 1, 'Auth', 'Login', 'Usuário hanna@gmail.com fez login', '::1', '2026-06-24 12:51:08'),
(135, 11, 1, 'Produtos', 'Editou', 'Editou produto "X-Tudo" (ID: 99)', '::1', '2026-06-24 12:57:51'),
(136, 11, 1, 'Produtos', 'Editou', 'Editou produto "X-Tudo" (ID: 99)', '::1', '2026-06-24 12:58:29'),
(137, 11, 1, 'Lotes', 'Registrou', 'Registrou lote de 5x Cerveja (Validade: 2026-09-20)', '::1', '2026-06-24 13:27:03'),
(138, 11, 1, 'Lotes', 'Deletou', 'Deletou lote ID: 52 (5.00x Cerveja)', '::1', '2026-06-24 13:27:45'),
(139, 11, 1, 'Lotes', 'Registrou', 'Registrou lote de 3x Cerveja (Validade: 2026-09-20)', '::1', '2026-06-24 13:28:41'),
(140, 11, 1, 'Lotes', 'Deletou', 'Deletou lote ID: 53 (3.00x Cerveja)', '::1', '2026-06-24 13:29:28'),
(141, 15, NULL, 'Auth', 'Login', 'Usuário admin@imperatore.com fez login', '::1', '2026-06-24 13:43:24'),
(142, 9, 1, 'Auth', 'Login', 'Usuário luciasilva@gmail.com fez login', '::1', '2026-06-24 14:10:04'),
(143, 9, 1, 'Comandas', 'Criou', 'Criou comanda da Mesa 2 para Júlio', '::1', '2026-06-24 14:10:15'),
(144, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Água Mineral à comanda 22 (Mesa 1)', '::1', '2026-06-24 14:10:19'),
(145, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Feijão à comanda 22 (Mesa 1)', '::1', '2026-06-24 14:10:20'),
(146, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Bife à Milanesa à comanda 23 (Mesa 2)', '::1', '2026-06-24 14:10:22'),
(147, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Coca-Cola à comanda 23 (Mesa 2)', '::1', '2026-06-24 14:10:24'),
(148, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Guaraná à comanda 23 (Mesa 2)', '::1', '2026-06-24 14:10:32'),
(149, 9, 1, 'Comandas', 'Criou', 'Criou comanda da Mesa 3 para Matheus', '::1', '2026-06-24 14:12:06'),
(150, 9, 1, 'Comandas', 'Adicionou Item', 'Adicionou 1x Macarrão à comanda 24 (Mesa 3)', '::1', '2026-06-24 14:12:11'),
(151, 14, 1, 'Auth', 'Login', 'Usuário cozinha@email.com fez login', '::1', '2026-06-24 14:31:57'),
(152, 14, 1, 'Pedidos', 'Mudou Status', 'Pedido 59 - Macarrão (1.00x) - Status: preparo (Mesa 3)', '::1', '2026-06-24 14:32:00'),
(153, 14, 1, 'Pedidos', 'Mudou Status', 'Pedido 58 - Guaraná (1.00x) - Status: preparo (Mesa 2)', '::1', '2026-06-24 14:32:02'),
(154, 14, 1, 'Pedidos', 'Mudou Status', 'Pedido 59 - Macarrão (1.00x) - Status: pronto (Mesa 3)', '::1', '2026-06-24 14:32:04'),
(155, 14, 1, 'Pedidos', 'Mudou Status', 'Pedido 58 - Guaraná (1.00x) - Status: pronto (Mesa 2)', '::1', '2026-06-24 14:32:06'),
(156, 14, 1, 'Pedidos', 'Mudou Status', 'Pedido 57 - Coca-Cola (1.00x) - Status: preparo (Mesa 2)', '::1', '2026-06-24 14:32:07'),
(157, 14, 1, 'Notificacoes', 'Criou', 'Criou notificação: Pedido da Mesa 2 - Guaraná está pronto a mais de 5 minutos!', '::1', '2026-06-24 14:44:15'),
(158, 11, 1, 'Auth', 'Login', 'Usuário hanna@gmail.com fez login', '::1', '2026-06-24 14:46:07');

-- --------------------------------------------------------

--
-- Estrutura da tabela `lotes`
--

CREATE TABLE IF NOT EXISTS `lotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ingrediente_id` int(11) NOT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  `data_validade` date NOT NULL,
  `lote` varchar(100) DEFAULT NULL,
  `estabelecimento_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_compra` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ingrediente_id` (`ingrediente_id`),
  KEY `estabelecimento_id` (`estabelecimento_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=54 ;

--
-- Extraindo dados da tabela `lotes`
--

INSERT INTO `lotes` (`id`, `ingrediente_id`, `quantidade`, `data_validade`, `lote`, `estabelecimento_id`, `created_at`, `data_compra`) VALUES
(20, 131, 50.00, '2026-07-20', 'LOTE001', 1, '2026-06-22 13:21:29', '2026-06-22'),
(21, 132, 10.00, '2026-07-15', 'LOTE002', 1, '2026-06-22 13:21:29', '2026-06-22'),
(22, 133, 15.00, '2026-07-10', 'LOTE003', 1, '2026-06-22 13:21:29', '2026-06-22'),
(23, 134, 30.00, '2026-07-05', 'LOTE004', 1, '2026-06-22 13:21:29', '2026-06-22'),
(24, 135, 20.00, '2026-07-08', 'LOTE005', 1, '2026-06-22 13:21:29', '2026-06-22'),
(25, 136, 25.00, '2026-07-12', 'LOTE006', 1, '2026-06-22 13:21:29', '2026-06-22'),
(26, 137, 100.00, '2026-08-01', 'LOTE007', 1, '2026-06-22 13:21:29', '2026-06-22'),
(27, 138, 5.00, '2026-07-20', 'LOTE008', 1, '2026-06-22 13:21:29', '2026-06-22'),
(28, 139, 5.00, '2026-07-20', 'LOTE009', 1, '2026-06-22 13:21:29', '2026-06-22'),
(29, 140, 5.00, '2026-07-20', 'LOTE010', 1, '2026-06-22 13:21:29', '2026-06-22'),
(30, 141, 8.00, '2026-07-15', 'LOTE011', 1, '2026-06-22 13:21:29', '2026-06-22'),
(31, 142, 50.00, '2026-07-25', 'LOTE012', 1, '2026-06-22 13:21:29', '2026-06-22'),
(32, 143, 10.00, '2026-07-30', 'LOTE013', 1, '2026-06-22 13:21:29', '2026-06-22'),
(33, 144, 15.00, '2026-07-20', 'LOTE014', 1, '2026-06-22 13:21:29', '2026-06-22'),
(34, 145, 10.00, '2026-07-15', 'LOTE015', 1, '2026-06-22 13:21:29', '2026-06-22'),
(35, 146, 8.00, '2026-07-20', 'LOTE016', 1, '2026-06-22 13:21:29', '2026-06-22'),
(36, 147, 12.00, '2026-07-10', 'LOTE017', 1, '2026-06-22 13:21:29', '2026-06-22'),
(37, 148, 20.00, '2026-07-05', 'LOTE018', 1, '2026-06-22 13:21:29', '2026-06-22'),
(38, 149, 5.00, '2026-07-20', 'LOTE019', 1, '2026-06-22 13:21:29', '2026-06-22'),
(39, 150, 10.00, '2026-07-20', 'LOTE020', 1, '2026-06-22 13:21:29', '2026-06-22'),
(40, 151, 8.00, '2026-07-15', 'LOTE021', 1, '2026-06-22 13:21:29', '2026-06-22'),
(41, 152, 20.00, '2026-07-25', 'LOTE022', 1, '2026-06-22 13:21:29', '2026-06-22'),
(42, 153, 15.00, '2026-07-10', 'LOTE023', 1, '2026-06-22 13:21:29', '2026-06-22'),
(43, 154, 10.00, '2026-07-15', 'LOTE024', 1, '2026-06-22 13:21:29', '2026-06-22'),
(44, 155, 8.00, '2026-07-20', 'LOTE025', 1, '2026-06-22 13:21:29', '2026-06-22'),
(45, 156, 20.00, '2026-07-30', 'LOTE026', 1, '2026-06-22 13:21:29', '2026-06-22'),
(46, 157, 15.00, '2026-07-20', 'LOTE027', 1, '2026-06-22 13:21:29', '2026-06-22'),
(47, 158, 10.00, '2026-07-25', 'LOTE028', 1, '2026-06-22 13:21:29', '2026-06-22'),
(48, 159, 8.00, '2026-07-15', 'LOTE029', 1, '2026-06-22 13:21:29', '2026-06-22'),
(49, 160, 5.00, '2026-07-20', 'LOTE030', 1, '2026-06-22 13:21:29', '2026-06-22');

-- --------------------------------------------------------

--
-- Estrutura da tabela `movimentos_estoque`
--

CREATE TABLE IF NOT EXISTS `movimentos_estoque` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lote_id` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  `motivo` varchar(100) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lote_id` (`lote_id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=55 ;

--
-- Extraindo dados da tabela `movimentos_estoque`
--

INSERT INTO `movimentos_estoque` (`id`, `lote_id`, `tipo`, `quantidade`, `motivo`, `usuario_id`, `created_at`) VALUES
(20, 20, 'entrada', 50.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(21, 21, 'entrada', 10.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(22, 22, 'entrada', 15.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(23, 23, 'entrada', 30.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(24, 24, 'entrada', 20.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(25, 25, 'entrada', 25.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(26, 26, 'entrada', 100.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(27, 27, 'entrada', 5.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(28, 28, 'entrada', 5.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(29, 29, 'entrada', 5.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(30, 30, 'entrada', 8.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(31, 31, 'entrada', 50.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(32, 32, 'entrada', 10.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(33, 33, 'entrada', 15.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(34, 34, 'entrada', 10.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(35, 35, 'entrada', 8.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(36, 36, 'entrada', 12.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(37, 37, 'entrada', 20.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(38, 38, 'entrada', 5.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(39, 39, 'entrada', 10.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(40, 40, 'entrada', 8.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(41, 41, 'entrada', 20.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(42, 42, 'entrada', 15.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(43, 43, 'entrada', 10.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(44, 44, 'entrada', 8.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(45, 45, 'entrada', 20.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(46, 46, 'entrada', 15.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(47, 47, 'entrada', 10.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(48, 48, 'entrada', 8.00, 'Registro inicial', 11, '2026-06-22 13:21:29'),
(49, 49, 'entrada', 5.00, 'Registro inicial', 11, '2026-06-22 13:21:29');

-- --------------------------------------------------------

--
-- Estrutura da tabela `notificacoes`
--

CREATE TABLE IF NOT EXISTS `notificacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estabelecimento_id` int(11) NOT NULL,
  `mensagem` varchar(255) NOT NULL,
  `pedido_id` int(11) DEFAULT NULL,
  `lida` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `estabelecimento_id` (`estabelecimento_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=107 ;

--
-- Extraindo dados da tabela `notificacoes`
--

INSERT INTO `notificacoes` (`id`, `estabelecimento_id`, `mensagem`, `pedido_id`, `lida`, `created_at`) VALUES
(68, 1, 'Comanda da Mesa 1 aberta para João Silva', NULL, 1, '2026-06-22 13:21:29'),
(69, 1, 'Comanda da Mesa 2 aberta para Maria Santos', NULL, 1, '2026-06-22 13:21:29'),
(70, 1, 'Comanda da Mesa 3 aberta para Pedro Oliveira', NULL, 1, '2026-06-22 13:21:29'),
(71, 1, 'Pedido de X-Burger (2x) adicionado à Mesa 1', 1, 1, '2026-06-22 13:21:29'),
(72, 1, 'Pedido de Lasanha (1x) adicionado à Mesa 1', 2, 1, '2026-06-22 13:21:29'),
(73, 1, 'Pedido de X-Bacon (1x) adicionado à Mesa 2', 3, 1, '2026-06-22 13:21:29'),
(74, 1, 'Pedido de Água Mineral (1x) adicionado à Mesa 1', NULL, 1, '2026-06-22 13:40:46'),
(75, 1, 'Pedido de Bife à Milanesa (1x) adicionado à Mesa 1', NULL, 1, '2026-06-22 13:40:47'),
(76, 1, 'Pedido de Farofa (1x) adicionado à Mesa 1', NULL, 1, '2026-06-22 13:40:49'),
(77, 1, 'Pedido de Bife à Milanesa (1x) adicionado à Mesa 2', NULL, 1, '2026-06-22 13:40:59'),
(78, 1, 'Pedido de Batata Frita (1x) adicionado à Mesa 2', NULL, 1, '2026-06-22 13:41:00'),
(79, 1, 'Pedido de Cerveja (2x) adicionado à Mesa 2', NULL, 1, '2026-06-22 13:50:29'),
(80, 1, 'Comanda da Mesa 2 foi fechada - Total: R$ 77.00', NULL, 1, '2026-06-22 13:50:31'),
(81, 1, 'Pedido de X-Bacon (14x) adicionado à Mesa 1', NULL, 1, '2026-06-22 13:51:04'),
(82, 1, 'Comanda da Mesa 1 foi fechada - Total: R$ 443.00', NULL, 1, '2026-06-22 13:51:08'),
(83, 1, 'Pedido de X-Bacon (1x) adicionado à Mesa 3', NULL, 1, '2026-06-22 14:00:23'),
(84, 1, 'Pedido de X-Bacon (1x) adicionado à Mesa 3', NULL, 1, '2026-06-22 14:00:58'),
(85, 1, 'Comanda da Mesa 3 foi fechada - Total: R$ 48.00', NULL, 1, '2026-06-22 14:01:03'),
(86, 1, 'Pedido de Água Mineral (1x) adicionado à Mesa 4', NULL, 1, '2026-06-22 14:02:09'),
(87, 1, 'Pedido de Água Mineral (3x) adicionado à Mesa 4', NULL, 1, '2026-06-22 14:02:17'),
(88, 1, 'Pedido de Água Mineral (3.00x) entrou em preparo - Mesa 4', 53, 1, '2026-06-22 14:35:55'),
(89, 1, 'Pedido de Água Mineral (3.00x) está pronto - Mesa 4', 53, 1, '2026-06-22 14:35:56'),
(90, 1, 'Comanda da Mesa 1 foi aberta', NULL, 1, '2026-06-23 12:02:43'),
(91, 1, 'Comanda da Mesa 4 foi fechada - Total: R$ 20.00', NULL, 0, '2026-06-23 12:59:59'),
(92, 1, 'Comanda da Mesa 5 foi fechada - Total: R$ 0.00', NULL, 0, '2026-06-23 13:00:04'),
(93, 1, 'Comanda da Mesa 2 foi aberta para Júlio', NULL, 0, '2026-06-24 14:10:15'),
(94, 1, 'Pedido de Água Mineral (1x) adicionado à Mesa 1', NULL, 0, '2026-06-24 14:10:19'),
(95, 1, 'Pedido de Feijão (1x) adicionado à Mesa 1', NULL, 0, '2026-06-24 14:10:20'),
(96, 1, 'Pedido de Bife à Milanesa (1x) adicionado à Mesa 2', NULL, 0, '2026-06-24 14:10:22'),
(97, 1, 'Pedido de Coca-Cola (1x) adicionado à Mesa 2', NULL, 0, '2026-06-24 14:10:24'),
(98, 1, 'Pedido de Guaraná (1x) adicionado à Mesa 2', NULL, 0, '2026-06-24 14:10:32'),
(99, 1, 'Comanda da Mesa 3 foi aberta para Matheus', NULL, 0, '2026-06-24 14:12:06'),
(100, 1, 'Pedido de Macarrão (1x) adicionado à Mesa 3', NULL, 0, '2026-06-24 14:12:11'),
(101, 1, 'Pedido de Macarrão (1.00x) entrou em preparo - Mesa 3', 59, 0, '2026-06-24 14:32:00'),
(102, 1, 'Pedido de Guaraná (1.00x) entrou em preparo - Mesa 2', 58, 0, '2026-06-24 14:32:02'),
(103, 1, 'Pedido de Macarrão (1.00x) está pronto - Mesa 3', 59, 0, '2026-06-24 14:32:04'),
(104, 1, 'Pedido de Guaraná (1.00x) está pronto - Mesa 2', 58, 0, '2026-06-24 14:32:06'),
(105, 1, 'Pedido de Coca-Cola (1.00x) entrou em preparo - Mesa 2', 57, 0, '2026-06-24 14:32:07'),
(106, 1, 'Pedido da Mesa 2 - Guaraná está pronto a mais de 5 minutos!', 58, 0, '2026-06-24 14:44:15');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedidos`
--

CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comanda_id` int(11) NOT NULL,
  `produto_id` int(11) NOT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `status` varchar(20) DEFAULT 'pendente',
  `observacao` text,
  `criado_por` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `comanda_id` (`comanda_id`),
  KEY `criado_por` (`criado_por`),
  KEY `pedidos_ibfk_2` (`produto_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=60 ;

--
-- Extraindo dados da tabela `pedidos`
--

INSERT INTO `pedidos` (`id`, `comanda_id`, `produto_id`, `quantidade`, `preco_unitario`, `status`, `observacao`, `criado_por`, `created_at`, `updated_at`) VALUES
(33, 1, 96, 2.00, 25.00, 'pendente', 'Sem cebola', 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(34, 1, 101, 1.00, 35.00, 'pendente', NULL, 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(35, 2, 97, 1.00, 28.00, 'pendente', 'Bem passado', 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(36, 2, 106, 1.00, 15.00, 'pendente', NULL, 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(37, 3, 99, 1.00, 35.00, 'pendente', 'Tudo', 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(38, 3, 111, 2.00, 8.00, 'pendente', NULL, 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(39, 4, 103, 1.00, 32.00, 'pendente', NULL, 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(40, 4, 115, 2.00, 12.00, 'pendente', NULL, 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(41, 5, 104, 1.00, 38.00, 'pendente', NULL, 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(42, 5, 112, 1.00, 7.00, 'pendente', NULL, 11, '2026-06-22 13:21:29', '2026-06-22 13:21:29'),
(43, 17, 114, 1.00, 5.00, 'pendente', NULL, 9, '2026-06-22 13:40:46', '0000-00-00 00:00:00'),
(44, 17, 104, 1.00, 38.00, 'pendente', NULL, 9, '2026-06-22 13:40:47', '0000-00-00 00:00:00'),
(45, 17, 109, 1.00, 8.00, 'pendente', NULL, 9, '2026-06-22 13:40:49', '0000-00-00 00:00:00'),
(46, 18, 104, 1.00, 38.00, 'pendente', NULL, 9, '2026-06-22 13:40:59', '0000-00-00 00:00:00'),
(47, 18, 106, 1.00, 15.00, 'pendente', NULL, 9, '2026-06-22 13:41:00', '0000-00-00 00:00:00'),
(48, 18, 115, 2.00, 12.00, 'pendente', NULL, 9, '2026-06-22 13:50:29', '0000-00-00 00:00:00'),
(49, 17, 97, 14.00, 28.00, 'pendente', NULL, 9, '2026-06-22 13:51:04', '0000-00-00 00:00:00'),
(51, 19, 97, 1.00, 48.00, 'pendente', NULL, 9, '2026-06-22 14:00:58', '0000-00-00 00:00:00'),
(52, 20, 114, 1.00, 5.00, 'pendente', NULL, 9, '2026-06-22 14:02:09', '0000-00-00 00:00:00'),
(53, 20, 114, 3.00, 5.00, 'pronto', NULL, 9, '2026-06-22 14:02:17', '2026-06-22 14:35:56'),
(54, 22, 114, 1.00, 8.00, 'pendente', NULL, 9, '2026-06-24 14:10:19', '0000-00-00 00:00:00'),
(55, 22, 108, 1.00, 10.00, 'pendente', NULL, 9, '2026-06-24 14:10:20', '0000-00-00 00:00:00'),
(56, 23, 104, 1.00, 38.00, 'pendente', NULL, 9, '2026-06-24 14:10:22', '0000-00-00 00:00:00'),
(57, 23, 111, 1.00, 8.00, 'preparo', NULL, 9, '2026-06-24 14:10:24', '2026-06-24 14:32:07'),
(58, 23, 112, 1.00, 7.00, 'pronto', 'Com gelo e Laranja', 9, '2026-06-24 14:10:32', '2026-06-24 14:32:06'),
(59, 24, 102, 1.00, 30.00, 'pronto', NULL, 9, '2026-06-24 14:12:11', '2026-06-24 14:32:04');

-- --------------------------------------------------------

--
-- Estrutura da tabela `preco_historico`
--

CREATE TABLE IF NOT EXISTS `preco_historico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produto_id` int(11) NOT NULL,
  `preco_antigo` decimal(10,2) NOT NULL,
  `preco_novo` decimal(10,2) NOT NULL,
  `alterado_por` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `produto_id` (`produto_id`),
  KEY `alterado_por` (`alterado_por`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `preco_venda` decimal(10,2) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estabelecimento_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `produtos_fk_estabelecimento` (`estabelecimento_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=116 ;

--
-- Extraindo dados da tabela `produtos`
--

INSERT INTO `produtos` (`id`, `nome`, `preco_venda`, `categoria`, `created_at`, `estabelecimento_id`) VALUES
(96, 'X-Burger', 25.00, 'Lanche', '2026-06-22 13:19:44', 1),
(97, 'X-Bacon', 48.00, 'Lanche', '2026-06-22 13:19:44', 1),
(98, 'X-Egg', 27.00, 'Lanche', '2026-06-22 13:19:44', 1),
(99, 'X-Tudo', 40.00, 'Lanche', '2026-06-22 13:19:44', 1),
(100, 'Hambúrguer Simples', 18.00, 'Lanche', '2026-06-22 13:19:44', 1),
(101, 'Lasanha', 35.00, 'Pratos', '2026-06-22 13:19:44', 1),
(102, 'Macarrão', 30.00, 'Pratos', '2026-06-22 13:19:44', 1),
(103, 'Frango Grelhado', 32.00, 'Pratos', '2026-06-22 13:19:44', 1),
(104, 'Bife à Milanesa', 38.00, 'Pratos', '2026-06-22 13:19:44', 1),
(105, 'Omelete', 25.00, 'Pratos', '2026-06-22 13:19:44', 1),
(106, 'Batata Frita', 15.00, 'Acompanhamentos', '2026-06-22 13:19:44', 1),
(107, 'Arroz', 10.00, 'Acompanhamentos', '2026-06-22 13:19:44', 1),
(108, 'Feijão', 10.00, 'Acompanhamentos', '2026-06-22 13:19:44', 1),
(109, 'Farofa', 8.00, 'Acompanhamentos', '2026-06-22 13:19:44', 1),
(110, 'Vinagrete', 5.00, 'Acompanhamentos', '2026-06-22 13:19:44', 1),
(111, 'Coca-Cola', 8.00, 'Bebidas', '2026-06-22 13:19:44', 1),
(112, 'Guaraná', 7.00, 'Bebidas', '2026-06-22 13:19:44', 1),
(113, 'Suco Natural', 10.00, 'Bebidas', '2026-06-22 13:19:44', 1),
(114, 'Água Mineral', 8.00, 'Bebidas', '2026-06-22 13:19:44', 1),
(115, 'Cerveja', 12.00, 'Bebidas', '2026-06-22 13:19:44', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto_ingredientes`
--

CREATE TABLE IF NOT EXISTS `produto_ingredientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produto_id` int(11) NOT NULL,
  `ingrediente_id` int(11) NOT NULL,
  `quantidade` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `produto_id` (`produto_id`),
  KEY `ingrediente_id` (`ingrediente_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=2203 ;

--
-- Extraindo dados da tabela `produto_ingredientes`
--

INSERT INTO `produto_ingredientes` (`id`, `produto_id`, `ingrediente_id`, `quantidade`) VALUES
(2145, 96, 131, 1.00),
(2146, 96, 132, 1.50),
(2147, 96, 133, 2.00),
(2148, 96, 134, 2.00),
(2149, 96, 135, 3.00),
(2150, 96, 138, 10.00),
(2151, 97, 131, 1.00),
(2152, 97, 132, 1.50),
(2153, 97, 133, 2.00),
(2154, 97, 134, 2.00),
(2155, 97, 135, 3.00),
(2156, 97, 141, 3.00),
(2157, 97, 140, 10.00),
(2158, 98, 131, 1.00),
(2159, 98, 132, 1.50),
(2160, 98, 133, 2.00),
(2161, 98, 134, 2.00),
(2162, 98, 135, 3.00),
(2163, 98, 142, 1.00),
(2164, 98, 139, 10.00),
(2165, 99, 131, 1.00),
(2166, 99, 132, 1.50),
(2167, 99, 133, 2.00),
(2168, 99, 134, 2.00),
(2169, 99, 135, 3.00),
(2170, 99, 141, 3.00),
(2171, 99, 142, 1.00),
(2172, 99, 136, 5.00),
(2173, 99, 137, 3.00),
(2174, 99, 138, 15.00),
(2175, 100, 131, 1.00),
(2176, 100, 132, 1.50),
(2177, 100, 133, 1.00),
(2178, 101, 143, 0.50),
(2179, 101, 144, 0.80),
(2180, 101, 145, 1.00),
(2181, 101, 146, 0.50),
(2182, 101, 133, 0.50),
(2183, 102, 144, 0.80),
(2184, 102, 145, 1.00),
(2185, 102, 146, 0.50),
(2186, 103, 155, 0.50),
(2187, 103, 156, 0.50),
(2188, 103, 157, 0.50),
(2189, 104, 145, 0.50),
(2190, 104, 142, 2.00),
(2191, 104, 148, 0.50),
(2192, 104, 146, 0.50),
(2193, 105, 142, 3.00),
(2194, 105, 133, 1.00),
(2195, 105, 147, 0.50),
(2196, 105, 136, 0.50),
(2197, 106, 154, 0.50),
(2198, 109, 158, 0.50),
(2199, 110, 159, 0.50),
(2202, 114, 152, 1.00);

-- --------------------------------------------------------

--
-- Estrutura da tabela `status_pedido`
--

CREATE TABLE IF NOT EXISTS `status_pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `observacao` varchar(255) DEFAULT NULL,
  `criado_por` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `criado_por` (`criado_por`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=93 ;

--
-- Extraindo dados da tabela `status_pedido`
--

INSERT INTO `status_pedido` (`id`, `pedido_id`, `status`, `observacao`, `criado_por`, `created_at`) VALUES
(69, 43, 'pendente', NULL, 9, '2026-06-22 13:40:46'),
(70, 44, 'pendente', NULL, 9, '2026-06-22 13:40:47'),
(71, 45, 'pendente', NULL, 9, '2026-06-22 13:40:49'),
(72, 46, 'pendente', NULL, 9, '2026-06-22 13:40:59'),
(73, 47, 'pendente', NULL, 9, '2026-06-22 13:41:00'),
(74, 48, 'pendente', NULL, 9, '2026-06-22 13:50:29'),
(75, 49, 'pendente', NULL, 9, '2026-06-22 13:51:04'),
(77, 51, 'pendente', NULL, 9, '2026-06-22 14:00:58'),
(78, 52, 'pendente', NULL, 9, '2026-06-22 14:02:09'),
(79, 53, 'pendente', NULL, 9, '2026-06-22 14:02:17'),
(80, 53, 'preparo', NULL, 14, '2026-06-22 14:35:55'),
(81, 53, 'pronto', NULL, 14, '2026-06-22 14:35:56'),
(82, 54, 'pendente', NULL, 9, '2026-06-24 14:10:19'),
(83, 55, 'pendente', NULL, 9, '2026-06-24 14:10:20'),
(84, 56, 'pendente', NULL, 9, '2026-06-24 14:10:22'),
(85, 57, 'pendente', NULL, 9, '2026-06-24 14:10:24'),
(86, 58, 'pendente', NULL, 9, '2026-06-24 14:10:32'),
(87, 59, 'pendente', NULL, 9, '2026-06-24 14:12:11'),
(88, 59, 'preparo', NULL, 14, '2026-06-24 14:32:00'),
(89, 58, 'preparo', NULL, 14, '2026-06-24 14:32:02'),
(90, 59, 'pronto', NULL, 14, '2026-06-24 14:32:04'),
(91, 58, 'pronto', NULL, 14, '2026-06-24 14:32:06'),
(92, 57, 'preparo', NULL, 14, '2026-06-24 14:32:07');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `perfil` enum('atendente','cozinha','gerente','dono','admin') DEFAULT 'atendente',
  `estabelecimento_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `estabelecimento_id` (`estabelecimento_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 AUTO_INCREMENT=21 ;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `created_at`, `perfil`, `estabelecimento_id`) VALUES
(9, 'Lucia Meneguel', 'luciasilva@gmail.com', '$2b$10$WY6rmicQEC7N.wd50V8VgOqNWhY2d5S6JYz6AMc71yJE6dx4dPIty', '2026-06-12 15:23:42', 'atendente', 1),
(10, 'Matheus Abib', 'matheus@gmail.com', '$2b$10$lK.QwuQF7z4nXivu9xLZF.pvkUsbQLK7q/rwNwgoABcohUnoTdm9m', '2026-06-12 15:24:01', 'gerente', 1),
(11, 'Hanna', 'hanna@gmail.com', '$2b$10$aJYFfpaf4pLdAotjeqgCr.P333DVI9O9HILrbp9oNwU7AGWZTz8mu', '2026-06-12 15:24:18', 'dono', 1),
(14, 'Lucio', 'cozinha@email.com', '$2b$10$cAGgi2HjGVGBSaa97NGAze/6pgpr8SIRLrNtLbHgLgeUBD5.IVmU6', '2026-06-15 13:37:45', 'cozinha', 1),
(15, 'Administrador', 'admin@imperatore.com', '$2b$10$xvovD1j0vPKoc4fIHFqR.OCeG/JIigbneNwKiW1xZdGhyGDMDT3Gi', '2026-06-18 15:07:49', 'admin', NULL),
(17, 'Luiz', 'luiz@gmail.com', '$2b$10$fP.J5GVW13/X0yoXoj0z3./uiduLD0SfnMkquHnfFsk.Qs.gbwRH2', '2026-06-18 15:31:01', 'dono', 1);

--
-- Restrições para as tabelas dumpadas
--

--
-- Restrições para a tabela `comandas`
--
ALTER TABLE `comandas`
  ADD CONSTRAINT `comandas_ibfk_1` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`);

--
-- Restrições para a tabela `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD CONSTRAINT `ingredientes_fk_estabelecimento` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`),
  ADD CONSTRAINT `ingredientes_ibfk_5` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`);

--
-- Restrições para a tabela `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Restrições para a tabela `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `lotes_ibfk_1` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lotes_ibfk_2` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`);

--
-- Restrições para a tabela `movimentos_estoque`
--
ALTER TABLE `movimentos_estoque`
  ADD CONSTRAINT `movimentos_estoque_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `movimentos_estoque_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Restrições para a tabela `notificacoes`
--
ALTER TABLE `notificacoes`
  ADD CONSTRAINT `notificacoes_ibfk_1` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`);

--
-- Restrições para a tabela `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`);

--
-- Restrições para a tabela `preco_historico`
--
ALTER TABLE `preco_historico`
  ADD CONSTRAINT `preco_historico_ibfk_1` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `preco_historico_ibfk_2` FOREIGN KEY (`alterado_por`) REFERENCES `usuarios` (`id`);

--
-- Restrições para a tabela `produtos`
--
ALTER TABLE `produtos`
  ADD CONSTRAINT `produtos_fk_estabelecimento` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`),
  ADD CONSTRAINT `produtos_ibfk_9` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`);

--
-- Restrições para a tabela `produto_ingredientes`
--
ALTER TABLE `produto_ingredientes`
  ADD CONSTRAINT `produto_ingredientes_ibfk_1` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produto_ingredientes_ibfk_2` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id`) ON DELETE CASCADE;

--
-- Restrições para a tabela `status_pedido`
--
ALTER TABLE `status_pedido`
  ADD CONSTRAINT `status_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `status_pedido_ibfk_2` FOREIGN KEY (`criado_por`) REFERENCES `usuarios` (`id`);

--
-- Restrições para a tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`estabelecimento_id`) REFERENCES `estabelecimentos` (`id`);

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `excluir_comandas_fechadas` ON SCHEDULE EVERY 1 HOUR STARTS '2026-06-15 10:47:04' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM comandas 
WHERE status = 'fechada' 
AND updated_at < DATE_SUB(NOW(), INTERVAL 2 HOUR)$$

DELIMITER ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
