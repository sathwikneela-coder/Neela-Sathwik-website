async function test() {
    const url = "https://script.google.com/macros/s/AKfycbxpsmKj8r6Qr-x6iDdOWo4sbss5qQJrC1PZKVpDzmzyQmOjvtIEBBQVcL5qrVDC3rvhEA/exec";
    
    console.log("Testing text/plain POST...");
    try {
        const resJson = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({
                name: "Test PlainText Sathwik",
                email: "test_plain@example.com",
                phone: "5555555555",
                service: "Brand Identity",
                business: "Plain Biz",
                details: "Test with text/plain Content-Type"
            })
        });
        console.log("Plain response status:", resJson.status);
        const text = await resJson.text();
        console.log("Plain response text:", text.substring(0, 500));
    } catch (e) {
        console.log("Plain error:", e.message);
    }
}

test();
