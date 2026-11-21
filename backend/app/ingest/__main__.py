import os
import sys

# Support running from backend directory or repo root
try:
    from app.ingest.main import run_ingest
except ImportError:
    from backend.app.ingest.main import run_ingest

if __name__ == "__main__":
    run_ingest(all_tables="--all" in sys.argv)
