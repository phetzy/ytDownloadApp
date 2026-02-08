import os
import subprocess
import sys
from datetime import datetime, timezone


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _run(cmd: list[str], timeout_seconds: int) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=timeout_seconds,
    )


def main() -> int:
    print(f"[{_utc_now_iso()}] Railway cron: yt-dlp update starting")

    try:
        import yt_dlp  # type: ignore

        print(f"[{_utc_now_iso()}] Current yt-dlp version: {getattr(yt_dlp, '__version__', 'unknown')}")
    except Exception as e:
        print(f"[{_utc_now_iso()}] WARNING: Could not import yt_dlp to read current version: {e}")

    cmd = [
        sys.executable,
        "-m",
        "pip",
        "install",
        "--upgrade",
        "--no-cache-dir",
        "--user",
        "yt-dlp",
    ]

    try:
        print(f"[{_utc_now_iso()}] Running: {' '.join(cmd)}")
        result = _run(cmd, timeout_seconds=300)

        if result.stdout:
            print(result.stdout.rstrip())
        if result.stderr:
            print(result.stderr.rstrip(), file=sys.stderr)

        if result.returncode != 0:
            print(f"[{_utc_now_iso()}] FAIL: pip returned exit code {result.returncode}", file=sys.stderr)
            return result.returncode

        try:
            import importlib

            yt_dlp_mod = importlib.import_module("yt_dlp")
            importlib.reload(yt_dlp_mod)
            print(
                f"[{_utc_now_iso()}] Updated yt-dlp version: {getattr(yt_dlp_mod, '__version__', 'unknown')}"
            )
        except Exception as e:
            print(f"[{_utc_now_iso()}] WARNING: Could not import/reload yt_dlp after update: {e}")

        print(f"[{_utc_now_iso()}] SUCCESS: yt-dlp update completed")
        return 0

    except subprocess.TimeoutExpired:
        print(f"[{_utc_now_iso()}] FAIL: yt-dlp update timed out", file=sys.stderr)
        return 124
    except Exception as e:
        print(f"[{_utc_now_iso()}] FAIL: Unexpected error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
