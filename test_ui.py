from playwright.sync_api import sync_playwright

def test_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:3000/chat')

        # Test 1: Empty State & Suggestions
        print("Testing empty state...")
        page.wait_for_selector('text="Bridge Cloud"')
        page.wait_for_selector('text="Explain a concept"')

        # Click suggestion
        page.click('text="Explain a concept"')

        # Should send message and appear in chat
        page.wait_for_selector('text="Explain a concept"')

        print("Empty state OK")

        # Test 2: Stop button
        # Need to wire up stop button to abort fetch stream with AbortController

        # Take screenshot
        page.screenshot(path="screenshot.png")
        browser.close()

if __name__ == "__main__":
    test_ui()
