from playwright.sync_api import sync_playwright

def run(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)

    page.get_by_role("textbox", name="Chat input").fill("Please write a very long essay.")
    page.get_by_role("button", name="Send message").click()
    page.wait_for_timeout(500)

    # Drag scrollbar up slightly using mouse events
    box = page.locator(".flex-1.overflow-y-auto.py-6").bounding_box()
    # Scroll by evaluating JS to simulate dragging or just wheel
    page.evaluate("document.querySelector('.flex-1.overflow-y-auto.py-6').scrollTop = 0")
    page.wait_for_timeout(500)

    # Wait to see if it scrolls back down automatically
    page.screenshot(path="scroll2.png")
    page.wait_for_timeout(1000)
    page.screenshot(path="scroll3.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    run(page)
    browser.close()
