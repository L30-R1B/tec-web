import mysql.connector
from mysql.connector import errorcode

# --- CONFIGURAções DE CONEXÃO COM O BANCO DE DADOS ---
# ATENÇÃO: Verifique se estes dados de conexão estão corretos para o seu ambiente.
DB_CONFIG = {
    'host': '100.124.95.109',
    'user': 'root',
    'password': 'babilonia-lil2kmnY'
}
DB_NAME = 'bingo_db'

# --- DEFINIÇÃO DAS TABELAS ---
TABLES = {}

# Tabela de Usuários com o novo campo 'is_admin'
TABLES['USUARIO'] = (
    "CREATE TABLE `USUARIO` ("
    "  `id_usuario` INT NOT NULL AUTO_INCREMENT,"
    "  `nome` VARCHAR(255) NOT NULL,"
    "  `email` VARCHAR(255) NOT NULL UNIQUE,"
    "  `senha` VARCHAR(255) NOT NULL,"
    "  `creditos` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,"
    "  `is_admin` BOOLEAN NOT NULL DEFAULT FALSE,"  # <-- CAMPO ADICIONADO
    "  PRIMARY KEY (`id_usuario`)"
    ") ENGINE=InnoDB"
)

# Tabela de Salas de Jogo
TABLES['SALA'] = (
    "CREATE TABLE `SALA` ("
    "  `id_sala` INT NOT NULL AUTO_INCREMENT,"
    "  `nome` VARCHAR(100) NOT NULL,"
    "  `descricao` TEXT,"
    "  PRIMARY KEY (`id_sala`)"
    ") ENGINE=InnoDB"
)

# Tabela de Jogos com o novo campo 'preco_cartela'
TABLES['JOGO'] = (
    "CREATE TABLE `JOGO` ("
    "  `id_jogo` INT NOT NULL AUTO_INCREMENT,"
    "  `data_hora` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  `id_sala` INT NOT NULL,"
    "  `id_usuario_vencedor` INT NULL,"
    "  `preco_cartela` DECIMAL(10, 2) NOT NULL DEFAULT 1.00,"
    "  PRIMARY KEY (`id_jogo`),"
    "  FOREIGN KEY (`id_sala`) REFERENCES `SALA`(`id_sala`),"
    "  FOREIGN KEY (`id_usuario_vencedor`) REFERENCES `USUARIO`(`id_usuario`)"
    "    ON DELETE SET NULL"
    ") ENGINE=InnoDB"
)

# Tabela de Prêmios
TABLES['PREMIOS'] = (
    "CREATE TABLE `PREMIOS` ("
    "  `id_premio` INT NOT NULL AUTO_INCREMENT,"
    "  `descricao` VARCHAR(255) NOT NULL,"
    "  `valor` DECIMAL(10, 2) NOT NULL,"
    "  `id_usuario` INT NOT NULL,"
    "  `id_jogo` INT NOT NULL,"
    "  PRIMARY KEY (`id_premio`),"
    "  FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO`(`id_usuario`),"
    "  FOREIGN KEY (`id_jogo`) REFERENCES `JOGO`(`id_jogo`)"
    "    ON DELETE CASCADE"
    ") ENGINE=InnoDB"
)

# Tabela de Cartelas
TABLES['CARTELA'] = (
    "CREATE TABLE `CARTELA` ("
    "  `id_cartela` INT NOT NULL AUTO_INCREMENT,"
    "  `id_usuario` INT NOT NULL,"
    "  `id_jogo` INT NOT NULL,"
    "  PRIMARY KEY (`id_cartela`),"
    "  FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO`(`id_usuario`),"
    "  FOREIGN KEY (`id_jogo`) REFERENCES `JOGO`(`id_jogo`)"
    "    ON DELETE CASCADE"
    ") ENGINE=InnoDB"
)

# Tabela dos Números de cada Cartela
TABLES['NUMEROS_CARTELA'] = (
    "CREATE TABLE `NUMEROS_CARTELA` ("
    "  `id_numero_cartela` INT NOT NULL AUTO_INCREMENT,"
    "  `numero` INT NOT NULL,"
    "  `id_cartela` INT NOT NULL,"
    "  PRIMARY KEY (`id_numero_cartela`),"
    "  FOREIGN KEY (`id_cartela`) REFERENCES `CARTELA`(`id_cartela`)"
    "    ON DELETE CASCADE,"
    "  UNIQUE KEY `idx_cartela_numero` (`id_cartela`, `numero`)"
    ") ENGINE=InnoDB"
)

# Tabela dos Números Sorteados em um Jogo
TABLES['NUMEROS_SORTEADOS'] = (
    "CREATE TABLE `NUMEROS_SORTEADOS` ("
    "  `id_numero_sorteado` INT NOT NULL AUTO_INCREMENT,"
    "  `numero` INT NOT NULL,"
    "  `ordem_sorteio` INT NOT NULL,"
    "  `id_jogo` INT NOT NULL,"
    "  PRIMARY KEY (`id_numero_sorteado`),"
    "  FOREIGN KEY (`id_jogo`) REFERENCES `JOGO`(`id_jogo`)"
    "    ON DELETE CASCADE,"
    "  UNIQUE KEY `idx_jogo_numero` (`id_jogo`, `numero`),"
    "  UNIQUE KEY `idx_jogo_ordem` (`id_jogo`, `ordem_sorteio`)"
    ") ENGINE=InnoDB"
)

def recriar_banco_de_dados(cursor):
    """Apaga o banco de dados se ele existir e o cria novamente."""
    try:
        cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME}")
        print(f"Banco de dados '{DB_NAME}' apagado (se existia).")
        cursor.execute(f"CREATE DATABASE {DB_NAME} DEFAULT CHARACTER SET 'utf8'")
        print(f"Banco de dados '{DB_NAME}' criado com sucesso.")
    except mysql.connector.Error as err:
        print(f"Falha ao recriar o banco de dados: {err}")
        exit(1)

def main():
    """Função principal para conectar e criar as tabelas."""
    cnx = None
    cursor = None
    try:
        # Conecta ao servidor MySQL
        cnx = mysql.connector.connect(**DB_CONFIG)
        cursor = cnx.cursor()
        print("Conectado ao servidor MySQL.")

        # Apaga (se existir) e cria o banco de dados
        recriar_banco_de_dados(cursor)
        
        # Seleciona o banco de dados para uso
        cursor.execute(f"USE {DB_NAME}")
        print(f"Usando o banco de dados '{DB_NAME}'.")

        # Ordem de criação das tabelas para respeitar as chaves estrangeiras
        ordem_criacao = ['SALA', 'USUARIO', 'JOGO', 'PREMIOS', 'CARTELA', 'NUMEROS_CARTELA', 'NUMEROS_SORTEADOS']

        # Cria as tabelas
        for table_name in ordem_criacao:
            table_description = TABLES[table_name]
            try:
                print(f"Criando tabela '{table_name}'... ", end='')
                cursor.execute(table_description)
                print("OK")
            except mysql.connector.Error as err:
                # O erro de "tabela já existe" não deve ocorrer devido ao DROP DATABASE
                print(f"ERRO: {err.msg}")
        
        print("\nScript de inicialização concluído. O banco de dados está pronto!")

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Acesso negado. Verifique seu nome de usuário ou senha.")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print(f"O banco de dados '{DB_NAME}' não existe.")
        else:
            print(f"Erro de conexão com o banco: {err}")
    finally:
        # Fecha a conexão
        if cursor:
            cursor.close()
        if cnx and cnx.is_connected():
            cnx.close()
            print("Conexão com o MySQL foi fechada.")

if __name__ == '__main__':
    main()