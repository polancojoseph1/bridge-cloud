from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(1000)

    # 1. Start streaming (use mock server to just run text)
    # The application defaults to using mock server if local profiles aren't connected
    # We will just write 'test message' and verify we get stop button
    page.get_by_placeholder("Message Bridge Cloud…").fill("Write a long poem about the ocean.")
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Send message").click()
    page.wait_for_timeout(100)

    # Verify Stop button appears in streaming state
    # Take screenshot of the EmptyState to verify Stop Button and Orchestration Mode UI
    page.screenshot(path="empty_state_streaming.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
