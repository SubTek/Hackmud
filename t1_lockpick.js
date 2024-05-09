function(context, args) {
    // Check if the args parameter is not provided and return an error message if absent
    if (!args) {
        return "Input target with target:#s.npc.loc";
    }
    
    let kv = {}; // Initialize an empty object to store key-value pairs for command arguments
    let response; // Variable to hold responses from the target system
    let lock = ""; // Variable to keep track of the current lock type encountered
    let ez = ["open", "release", "unlock"]; // Array of EZ lock keywords
    let colors = "red,orange,yellow,lime,green,cyan,blue,purple".split(','); // Array of color strings for color lock
    let n1 = "is not the"; // Error message fragment used to detect incorrect parameters
    let l0cket = "cmppiq,sa23uw,tvfkyq,uphlaw,vc2c7q,xwz7ja,i874y3,72umy0,5c7e1r,hc3b69,nfijix,4jitu5,6hh8xw".split(','); // List of possible l0cket codes
    let times = {}; // Object to store timing information for lock handling

    rspC(); // Initial call to interact with the target

    let lastCycle = 0; // Variable to track time spent in the current cycle
    while (true) {
        if (!response) {
            return "[`DERROR`] Target does not exist"; // Return an error if no response from target
        }

        // Track time taken to resolve the current lock
        if (lock.length) {
            times[lock] = Date.now() - _START - lastCycle;
        }
        lastCycle = Date.now() - _START;

        // Check if the connection has been terminated or system went offline
        if (!rspI("Connection terminated.") || !rspI("system offline")) {
            rspC(); // Re-establish connection if necessary
        }

        // Check if access is denied, indicating a lock to be handled
        if (rspI("Denied access")) {
            lock = /`N(\S*?)` lock./.exec(response)[1]; // Extract lock type from response

            // Handle EZ type locks
            if (lock.includes("EZ_")) {
                for (let i of ez) {
                    kv[lock] = i;
                    if (!rspC().includes(n1)) {
                        break; // Exit the loop if correct EZ command is found
                    }
                }

                // Additional lock specifics within EZ
                if (rspI("digit")) {
                    ezDigit("digit"); // Handle digit request
                } else if (rspI("ez_prime")) {
                    ezDigit("ez_prime"); // Handle prime number request
                }
            } else if (lock.includes("c00")) { // Handle c00 color locks
                for (let i in colors) {
                    let j = parseInt(i);
                    kv[lock] = colors[i];

                    // Specific handling based on color lock type
                    if (lock == "c001") {
                        kv["color_digit"] = kv["c001"].length;
                    } else if (lock == "c002") {
                        kv["c002_complement"] = colors[(j + 4) % 8];
                    } else if (lock == "c003") {
                        kv["c003_triad_1"] = colors[(j + 5) % 8];
                        kv["c003_triad_2"] = colors[(j + 3) % 8];
                    }

                    rspC();
                    if (!rspI(n1)) {
                        break; // Exit the loop if correct color is found
                    }
                }
            } else if (lock.includes("l0cket")) { // Handle l0cket type locks
                let error = true;
                for (let i of l0cket) {
                    kv["l0cket"] = i;
                    if (!rspC().includes(n1)) {
                        error = false;
                        break; // Exit loop if correct l0cket code is found
                    }
                }

                if (error) {
                    return "[`DERROR`] Unknown lock argument"; // Return error if l0cket code fails
                }
            } else if (lock.includes("DATA_CHECK")) { // Handle DATA_CHECK type locks
                kv["DATA_CHECK"] = "";
                let data_check = rspC().split("\n");

                if (data_check.length != 3) {
                    return "[`DERROR`] DATA_CHECK failure, less than 3 questions"; // Error on unexpected DATA_CHECK format
                }

                let string = "";
                for (let i of data_check) {
                    string += #fs.lore.data_check({ lookup: i }).answer; // Construct answer from lore data checks
                }

                kv["DATA_CHECK"] = string; // Update DATA_CHECK response
            }
        } else if (rspI("terminated") || rspI("defence system offline")) {
            return "[`LSUCCESS`] Hack successful!"; // Return success if termination or offline status confirmed
        } else if (rspI(n1)) {
            return "[`DERROR`] Wrong lock argument"; // Return error if wrong argument detected
        } else if (rspI("breached")) {
            return "[`DERROR`] Target Already Breached!"; // Return error if target already breached
        }
    }

    function ezDigit(key) {
        let digit = 0;
        if (key.includes("prime")) {
            digit = 1; // Start with 1 for prime number handling
        }

        while (true) {
            kv[key] = digit++;
            if (digit > 9) digit++;
            if (!rspC().includes(n1)) {
                break; // Break loop if correct digit found
            }
        }
    }

    function rspC() {
        response = args.target.call(kv); // Call target with current key-value arguments
        return response; // Return response from target
    }

    function rspI(x) {
        return response.includes(x); // Helper to check if response includes a specific substring
    }
}
