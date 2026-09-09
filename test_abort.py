from playwright.sync_api import sync_playwright

def run(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

    # Try typing into chat input on empty state
    page.get_by_role("textbox", name="Chat input").fill("test mock api that streams slowly")
    page.get_by_role("button", name="Send message").click()
    page.wait_for_timeout(500)

    # Click stop button
    page.get_by_role("button", name="Stop generation").click()
    page.wait_for_timeout(500)

    # Check if a new message is there and stops streaming
    page.screenshot(path="abort.png")
    page.wait_for_timeout(2000)
    page.screenshot(path="abort2.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    run(page)
    browser.close()
