#!/bin/bash
# ci-review.sh — Automated React project checks for PR pipelines.
# Runs ESLint (if configured) and Playwright E2E tests, then posts a markdown
# report as a PR comment.
#
# Usage:
#   ./ci-review.sh                  # local run, outputs CI_REVIEW.md
#   ./ci-review.sh --pr <number>    # local run + posts comment to PR

set -e

PR_NUMBER=""
OUTPUT_FILE="CI_REVIEW.md"
FAILED=0

# Parse args
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --pr) PR_NUMBER="$2"; shift ;;
  esac
  shift
done

# ── Header ────────────────────────────────────────────────────────────────────
{
  echo "# CI Code Review"
  echo ""
  echo "**Run:** $(date -u '+%Y-%m-%d %H:%M UTC')"
  echo "**Branch:** $(git branch --show-current 2>/dev/null || echo 'unknown')"
  echo ""
} > "$OUTPUT_FILE"

# ── ESLint ────────────────────────────────────────────────────────────────────
echo "## ESLint" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if [ -f ".eslintrc*" ] || [ -f "eslint.config*" ] || grep -q '"eslint"' package.json 2>/dev/null; then
  ESLINT_OUT=$(npx eslint src/ --format compact 2>&1 || true)
  if echo "$ESLINT_OUT" | grep -q " error "; then
    echo "❌ Lint errors found:" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    echo "$ESLINT_OUT" | grep " error " >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    FAILED=1
  else
    echo "✅ No lint errors." >> "$OUTPUT_FILE"
  fi
else
  echo "⚠️ ESLint not configured — skipped." >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# ── Playwright ────────────────────────────────────────────────────────────────
echo "## E2E Tests (Playwright)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
  PLAYWRIGHT_OUT=$(npx playwright test --reporter=line 2>&1 || true)
  if echo "$PLAYWRIGHT_OUT" | grep -qE "failed|Error"; then
    echo "❌ Tests failed:" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    echo "$PLAYWRIGHT_OUT" | tail -30 >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    FAILED=1
  else
    PASSED=$(echo "$PLAYWRIGHT_OUT" | grep -oE "[0-9]+ passed" | head -1)
    echo "✅ ${PASSED:-All tests passed}." >> "$OUTPUT_FILE"
  fi
else
  echo "⚠️ No Playwright config found — skipped." >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# ── Verdict ───────────────────────────────────────────────────────────────────
echo "## Verdict" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
if [ "$FAILED" -eq 0 ]; then
  echo "✅ **All automated checks passed.** Ready for AI review." >> "$OUTPUT_FILE"
else
  echo "❌ **Checks failed.** Fix the issues above before requesting a merge." >> "$OUTPUT_FILE"
fi

echo ""
echo "Report written to $OUTPUT_FILE"

# ── Post to PR ────────────────────────────────────────────────────────────────
if [[ -n "$PR_NUMBER" ]]; then
  if command -v gh &> /dev/null; then
    gh pr comment "$PR_NUMBER" --body-file "$OUTPUT_FILE"
    echo "Posted CI review to PR #$PR_NUMBER"
  else
    echo "gh CLI not found — skipping PR comment."
  fi
fi

exit "$FAILED"
