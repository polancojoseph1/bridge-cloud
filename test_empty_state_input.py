from playwright.sync_api import sync_playwright

def run(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)
    page.get_by_role("textbox", name="Chat input").fill("this should be the unified input")
    page.wait_for_timeout(500)
    page.screenshot(path="empty_state_unified.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    run(page)
    browser.close()
