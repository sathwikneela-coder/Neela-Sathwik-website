const fs = require('fs');

function inspect() {
    const html = fs.readFileSync('temp_form.html', 'utf8');
    const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);/);
    if (match) {
        console.log("Found FB_PUBLIC_LOAD_DATA_!");
        try {
            const data = eval(match[1]);
            // Let's write the parsed array into a JSON file so we can view it cleanly.
            fs.writeFileSync('form_data_dump.json', JSON.stringify(data, null, 2));
            console.log("Wrote dump to form_data_dump.json!");
            
            // Let's print out the main parts:
            console.log("Main array length:", data.length);
            console.log("Item [1] keys/structure:");
            if (data[1]) {
                console.log("data[1][1] length:", data[1][1] ? data[1][1].length : 'none');
                data[1][1].forEach((item, index) => {
                    console.log(`\nItem ${index}:`, JSON.stringify(item).substring(0, 300));
                });
            }
        } catch (e) {
            console.log("Eval error:", e.message);
        }
    } else {
        console.log("FB_PUBLIC_LOAD_DATA_ not found!");
    }
}

inspect();
