from playwright.sync_api import sync_playwright
import time

def test_abort():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:3000/chat')

        # Click suggestion
        page.click('text="Explain a concept"')

        # Click stop button
        page.wait_for_selector('button[title="Stop generation"]')
        page.click('button[title="Stop generation"]')

        # Check if streaming stopped
        time.sleep(1)

        # Take screenshot
        page.screenshot(path="screenshot_abort.png")
        browser.close()

if __name__ == "__main__":
    test_abort()
