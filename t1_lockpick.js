function(context, args) {
    // Check if args are not provided if not return instructions.
    if (!args) {
        return "Input target with target:#s.npc.loc";
    }
    
    // Initialize variables for key-value pairs, the response from calls, and current lock type.
    let kv = {}, response, lock = "", ez = ["open", "release", "unlock"];
    // Define possible color codes and lock codes for c00 and l0cket locks.
    const colors = ["red", "orange", "yellow", "lime", "green", "cyan", "blue", "purple"];
    const n1 = "is not the";
    const l0cket = ["cmppiq", "sa23uw", "tvfkyq", "uphlaw", "vc2c7q", "xwz7ja", "i874y3", "72umy0", "5c7e1r", "hc3b69", "nfijix", "4jitu5", "6hh8xw"];
    let times = {}, startTime = Date.now();

    // Start the response cycle.
    rspC();
    let lastCycle = startTime;
    // Begin a loop that will continue indefinitely.
    while (true) {
        // If the system responds with "Target does not exist" return an error indicating so.
        if (!response) {
            return "[`DERROR`] Target does not exist";
        }
        // Record the time taken for each lock to be dealt with.
        if (lock) {
            times[lock] = Date.now() - startTime - lastCycle;
        }
        lastCycle = Date.now() - startTime;
        // If the system responds with connection terminated or system offline, restart the cycle.
        if (!rspI("Connection terminated.") || !rspI("system offline")) {
            rspC();
        }
        // Handle access denial by identifying the lock type and trying potential solutions.
if (rspI("Denied access")) {
    lock = /`N(\S*?)` lock./.exec(response)[1];
    switch (true) {
        case lock.includes("EZ_"):
            for (let i of ez) {
                kv[lock] = i;
                if (!rspC().includes(n1)) {
                    break;
                }
            }
            // Further handle EZ locks requiring digits or primes.
            if (rspI("digit")) {
                ezDigit("digit");
            } else if (rspI("ez_prime")) {
                ezDigit("ez_prime");
            }
            break;
        case lock.startsWith("c00"):
            for (let i = 0; i < colors.length; i++) {
                kv[lock] = colors[i];
                handleColorLock(i, lock);
                rspC();
                if (!rspI(n1)) {
                    break;
                }
            }
            break;
        case lock.includes("l0cket"):
            let error = true;
            for (let code of l0cket) {
                kv["l0cket"] = code;
                if (!rspC().includes(n1)) {
                    error = false;
                    break;
                }
            }
            if (error) {
                return "[`DERROR`] Unknown lock argument";
            }
            break;
        case lock.includes("DATA_CHECK"):
            handleDataCheck();
            break;
        default:
            return "[`DERROR`] Unknown lock type";
    }
} else if (rspI("terminated") || rspI("defence system offline")) {
            return "[`LSUCCESS`] Hack successful!";
        } else if (rspI("breached")) {
            return "[`DERROR`] Target Already Breached!";
        }
    }

    // Function to handle digit and prime challenges for EZ locks.
    function ezDigit(key) {
        let digit = key.includes("prime") ? 1 : 0;
        while (true) {
            kv[key] = digit++;
            if (!rspC().includes(n1)) {
                break;
            }
            if (key.includes("prime") && digit > 9) digit++;
        }
    }

    // Function to set color-related lock values based on color index and lock type.
    function handleColorLock(index, lockType) {
        if (lockType == "c001") {
            kv["color_digit"] = colors[index].length;
        } else if (lockType == "c002") {
            kv["c002_complement"] = colors[(index + 4) % 8];
        } else if (lockType == "c003") {
            kv["c003_triad_1"] = colors[(index + 5) % 8];
            kv["c003_triad_2"] = colors[(index + 3) % 8];
        }
    }

    // Function to handle DATA_CHECK by querying the game lore database for each item and concatenating the results.
    function handleDataCheck() {
        kv["DATA_CHECK"] = "";
        let data_check = rspC().split("\n");

        let string = "";
        for (let item of data_check) {
            string += #fs.lore.data_check({ lookup: item }).answer;
        }
        kv["DATA_CHECK"] = string;
    }

    // Call the target with current keyvalue pairs and update the response.
    function rspC() {
        response = args.target.call(kv);
        return response;
    }

    // Function to check if the response includes a specific substring.
    function rspI(x) {
        return response.includes(x);
    }
}