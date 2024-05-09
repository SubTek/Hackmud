function(context, args) {
    if (!args) {
        return "Input target with target:#s.npc.loc";
    }
    
    let kv = {}; // Variable for all keys and parameters
    let response;
    let lock = "";
    let ez = ["open", "release", "unlock"];
    let colors = "red,orange,yellow,lime,green,cyan,blue,purple".split(',');
    let n1 = "is not the"; // Comparison check string for the incorrect parameters
    let l0cket = "cmppiq,sa23uw,tvfkyq,uphlaw,vc2c7q,xwz7ja,i874y3,72umy0,5c7e1r,hc3b69,nfijix,4jitu5,6hh8xw".split(',');
    let times = {};

    rspC();

    let lastCycle = 0;
    while (true) {
        if (!response) {
            return "[`DERROR`] Target does not exist";
        }

        if (lock.length) {
            times[lock] = Date.now() - _START - lastCycle;
        }
        lastCycle = Date.now() - _START;

        if (!rspI("Connection terminated.") || !rspI("system offline")) {
            rspC();
        }

        if (rspI("Denied access")) { // Lock found
            lock = /`N(\S*?)` lock./.exec(response)[1];

            if (lock.includes("EZ_")) { // EZ lock cracking
                for (let i of ez) {
                    kv[lock] = i;
                    if (!rspC().includes(n1)) {
                        break;
                    }
                }

                if (rspI("digit")) {
                    ezDigit("digit");
                } else if (rspI("ez_prime")) {
                    ezDigit("ez_prime");
                }
            } else if (lock.includes("c00")) { // Color lock cracking
                for (let i in colors) {
                    let j = parseInt(i);
                    kv[lock] = colors[i];

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
                        break;
                    }
                }
            } else if (lock.includes("l0cket")) { // l0cket cracking
                let error = true;
                for (let i of l0cket) {
                    kv["l0cket"] = i;
                    if (!rspC().includes(n1)) {
                        error = false;
                        break;
                    }
                }

                if (error) {
                    return "[`DERROR`] Unknown lock argument";
                }
            } else if (lock.includes("DATA_CHECK")) { // DATA_CHECK cracking
                kv["DATA_CHECK"] = "";
                let data_check = rspC().split("\n");

                if (data_check.length != 3) {
                    return "[`DERROR`] DATA_CHECK failure, less than 3 questions";
                }

                let string = "";
                for (let i of data_check) {
                    string += #fs.lore.data_check({ lookup: i }).answer;
                }

                kv["DATA_CHECK"] = string;
            }
        } else if (rspI("terminated") || rspI("defence system offline")) {
            return "[`LSUCCESS`] Hack successful!";
        } else if (rspI(n1)) { // Argument is wrong, something went wrong in the unlocking process
            return "[`DERROR`] Wrong lock argument";
        } else if (rspI("breached")) { // Target already breached
            return "[`DERROR`] Target Already Breached!";
        }
    }

    function ezDigit(key) {
        let digit = 0;
        if (key.includes("prime")) {
            digit = 1;
        }

        while (true) {
            kv[key] = digit++;
            if (digit > 9) digit++;
            if (!rspC().includes(n1)) {
                break;
            }
        }
    }

    function rspC() {
        response = args.target.call(kv);
        return response;
    }

    function rspI(x) {
        return response.includes(x);
    }
}
