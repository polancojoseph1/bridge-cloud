from playwright.sync_api import sync_playwright

def run(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)
    page.get_by_role("textbox", name="Chat input").fill("this is a long message that should stream slowly")
    page.get_by_role("button", name="Send message").click()

    page.wait_for_timeout(500)

    # Check if stop button is there
    stop_button = page.locator("button[aria-label='Stop generation']")
    if stop_button.count() > 0:
        stop_button.click()
        print("Clicked stop")
    else:
        print("No stop button found")

    page.wait_for_timeout(2000)
    # Check if it stopped streaming (wait for some time to see if more text is appended)
    content1 = page.locator(".prose").last.inner_text()
    page.wait_for_timeout(1000)
    content2 = page.locator(".prose").last.inner_text()
    print("Same content:", content1 == content2)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    run(page)
    browser.close()
