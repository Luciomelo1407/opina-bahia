"""
Gera o arquivo src/lib/bahia-locations.json com cidades e bairros da Bahia.

Requisitos:
  Python 3.10+  →  python --version
  uv            →  pip install uv   (ou: pip install edne-correios-loader)

Como usar:
  python scripts/generate-bahia-locations.py

O script vai:
  1. Baixar o DNE completo dos Correios (~500 MB) e importar para dne.db (SQLite local)
  2. Extrair cidades e bairros do estado da Bahia
  3. Salvar em src/lib/bahia-locations.json
  4. Apagar o dne.db ao final (opcional — veja KEEP_DB abaixo)
"""

import json
import sqlite3
import subprocess
import sys
from pathlib import Path

# ── Configurações ─────────────────────────────────────────────────────────────
UF = "BA"
DB_PATH = Path("dne.db")
OUTPUT_PATH = Path("src/lib/bahia-locations.json")
KEEP_DB = False  # True para não apagar o dne.db após gerar o JSON
# ─────────────────────────────────────────────────────────────────────────────


def step(msg: str):
    print(f"\n→ {msg}")


def run(cmd: list[str]):
    result = subprocess.run(cmd, capture_output=False)
    if result.returncode != 0:
        print(f"\nErro ao executar: {' '.join(cmd)}")
        sys.exit(1)


def main():
    # 1. Instalar dependência
    step("Instalando edne-correios-loader...")
    run([sys.executable, "-m", "pip", "install", "--quiet", "edne-correios-loader"])

    # Importar após instalação
    from edne_correios_loader import DneLoader

    # 2. Importar DNE para SQLite
    step(f"Importando DNE dos Correios para {DB_PATH} (pode demorar alguns minutos)...")
    loader = DneLoader(database_url=f"sqlite:///{DB_PATH}")
    loader.load()

    # 3. Consultar cidades e bairros da Bahia
    step(f"Consultando cidades e bairros do estado {UF}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT municipio, bairro
        FROM cep_unificado
        WHERE uf = ?
          AND municipio IS NOT NULL AND municipio != ''
          AND bairro    IS NOT NULL AND bairro    != ''
        ORDER BY municipio, bairro
    """, (UF,))

    rows = cursor.fetchall()
    conn.close()

    # 4. Montar dicionário { cidade: [bairro, ...] }
    locations: dict[str, list[str]] = {}
    for municipio, bairro in rows:
        cidade = municipio.strip().title()
        b = bairro.strip().title()
        locations.setdefault(cidade, [])
        if b not in locations[cidade]:
            locations[cidade].append(b)

    total_cidades = len(locations)
    total_bairros = sum(len(v) for v in locations.values())
    step(f"Encontradas {total_cidades} cidades e {total_bairros} bairros.")

    # 5. Salvar JSON
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(locations, f, ensure_ascii=False, indent=2)
    step(f"Arquivo salvo em {OUTPUT_PATH}")

    # 6. Limpar banco temporário
    if not KEEP_DB and DB_PATH.exists():
        try:
            DB_PATH.unlink()
            print(f"  (dne.db removido. Defina KEEP_DB=True para mantê-lo.)")
        except PermissionError:
            print(f"  (Não foi possível remover dne.db automaticamente. Apague manualmente se quiser.)")

    print("\nConcluído! Importe no seu componente assim:")
    print("  import locations from '@/lib/bahia-locations.json'")


if __name__ == "__main__":
    main()
