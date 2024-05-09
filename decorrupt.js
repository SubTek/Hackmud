function(context, args) // Main function taking context and args as parameters
{
    // Get the calling user's name
    var caller = context.caller;

    // Import a library of helper scripts
    var lib = #fs.scripts.lib();

    // Check if 'args' is null or if 'args.target' is undefined; if so, return usage info
    if (!args || !args.target) return `subtek.decorrupt{target:#s.cyberdine.public,args:"arg1:value1,arg2:value2,arg3:value3,etc:etcetera"}\n\nArguments are optional. All values will be converted to strings\n\nmacro:\nsubtek.decorrupt {{ target:#s.{0}, args:{1} }}`;

    // Declarations for handling the response from the target script
    let response, response2, crp = /`.[¡¢Á¤Ã¦§¨©ª]`/g, join = false;

    // Log the script call to the database
    #db.i({script: context.this_script, args, context});

    // Call the target script with provided arguments and store the response
    if (args) {
        response = args.target.call(args.args);
        response2 = args.target.call(args.args);
    } else {
        response = args.target.call();
        response2 = args.target.call();
    }
    
    // Convert responses to strings if they are not already
    if (typeof response != "string") {
        response = response.join("\n").replace(crp, "§");
        response2 = response2.join("\n").replace(crp, "§");
        join = true;
    } else {
        response = response.replace(crp, "§");
        response2 = response2.replace(crp, "§");
    }

    // Loop to replace corrupted characters in the response before a timeout occurs
    while (Date.now() - _START < 3900) {
        
        let corIndex = response.indexOf("§");
        if (corIndex == -1) {
            return response;
        }
    
        let r2char = response2.substr(corIndex, 1);
        if (r2char == "§") {
            // If character at index is still corrupted, fetch new response2
            if (join) {
                if (args) {
                    response2 = args.target.call(args.args).join("\n").replace(crp, "§");
                } else {
                    response2 = args.target.call().join("\n").replace(crp, "§");
                }
            } else {
                if (args) {
                    response2 = args.target.call(args.args).replace(crp, "§");
                } else {
                    response2 = args.target.call().replace(crp, "§");
                }
            }
            continue;
        }
        
        // Replace corrupted character with correct character from response2
        response = replaceAt(response, corIndex, r2char);
    }
    return response;

    // Function to replace a character at a specific index in a string
    function replaceAt(string, index, replacement) {
        return string.substr(0, index) + replacement + string.substr(index + replacement.length);
    }
}
