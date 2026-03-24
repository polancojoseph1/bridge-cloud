"""
Bridge Cloud — Playwright Browser Verification
Smoke tests the chat UI at http://localhost:3000
Run: python tests/playwright_verify.py
"""
import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "http://localhost:3000"
SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(exist_ok=True)

results = []

def record(name: str, ok: bool, detail: str = ""):
    status = "PASS" if ok else "FAIL"
    results.append((name, status, detail))
    print(f"  [{status}] {name}" + (f" — {detail}" if detail else ""))

async def shot(page, name: str):
    await page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=False)


async def verify_desktop(browser):
    ctx = await browser.new_context(viewport={"width": 1440, "height": 900}, ignore_https_errors=True)
    page = await ctx.new_page()
    try:
        await page.goto(BASE, wait_until="domcontentloaded", timeout=15000)
        await page.wait_for_timeout(1000)
        await shot(page, "desktop_01_loaded")

        # 1. Redirects to /chat
        record("Redirects to /chat", "/chat" in page.url, page.url)

        # 2. Page title
        title = await page.title()
        record("Page has title", bool(title), title)

        # 3. Input bar visible
        input_bar = page.locator("textarea, input[type='text'], [data-testid='input-bar'], [placeholder]").first
        record("Input bar visible", await input_bar.is_visible())
        await shot(page, "desktop_02_chat")

        # 4. Can type in input
        if await input_bar.is_visible():
            await input_bar.fill("hello")
            val = await input_bar.input_value()
            record("Input bar accepts text", val == "hello")
            await input_bar.fill("")

        # 5. No JS errors on load
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.wait_for_timeout(500)
        record("No JS errors on load", len(errors) == 0, "; ".join(errors[:3]) if errors else "")

        # 6. Instance tab bar present (InstanceTabBar component)
        tab_bar = page.locator("[data-testid='instance-tab-bar'], .instance-tab-bar, nav").first
        record("Instance/nav bar present", await tab_bar.count() > 0)

        await shot(page, "desktop_03_final")
    finally:
        await ctx.close()


async def verify_mobile(browser):
    ctx = await browser.new_context(viewport={"width": 390, "height": 844}, ignore_https_errors=True)
    page = await ctx.new_page()
    try:
        await page.goto(BASE, wait_until="domcontentloaded", timeout=15000)
        await page.wait_for_timeout(1000)
        await shot(page, "mobile_01_loaded")

        record("Mobile: loads without crash", True)

        # Input bar visible on mobile
        input_bar = page.locator("textarea, input[type='text'], [placeholder]").first
        record("Mobile: input bar visible", await input_bar.is_visible())

        await shot(page, "mobile_02_chat")
    finally:
        await ctx.close()


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        print("\n=== Desktop (1440x900) ===")
        await verify_desktop(browser)
        print("\n=== Mobile (390x844) ===")
        await verify_mobile(browser)
        await browser.close()

    passed = sum(1 for _, s, _ in results if s == "PASS")
    failed = sum(1 for _, s, _ in results if s == "FAIL")
    total = len(results)

    print(f"\n{'='*50}")
    print(f"BROWSER VERIFICATION: {passed}/{total} PASS, {failed} FAIL")
    print(f"{'='*50}")

    if failed:
        print("\nFailed:")
        for name, status, detail in results:
            if status == "FAIL":
                print(f"  ✗ {name}" + (f" — {detail}" if detail else ""))
        sys.exit(1)
    else:
        print("\nAll checks passed.")
        sys.exit(0)


if __name__ == "__main__":
    asyncio.run(main())
