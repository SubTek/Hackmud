function(context, args) // target:#s.amal_robo.public regex:"_jr_"
{
    // Return a message if no arguments are provided
	if (!args) {
		return 'Input a `Ntarget` with target:#s.corp.public.\nOptional: `Nregex` argument, to filter tresults".'
	}
    // Array of regular expressions to match project-related phrases
	let project_phrases = [
		/^(\S+) announces beta testing/g,
		/Work continues on (\S+), hope/g,
		/new developments on (\S+) progress/g,
		/critical review of (\S+), the/g,
		/project (\S+) has come clean/g,
		/release date for (\S+)\./g,
		/fake backstarters for (\S+) since/g,
		/of project (\S+) has come clean/g,
		/Look for (\S+) in your/g,
	]

	let temp, target
    // Check if a target has been provided in args, if not return an error messag
	if (args.target)
	{
		target = args.target
	}
	else {
		return "[`DERROR`] Input a `Ntarget` with target:#s.corp.public"
	}

	let now = Date.now();

	// Remove corruption and split the data to extract commands and members from the response
	let command = #fs.subtek.decorrupt({target,args:{}}).split(/access directory with /g)[1].split(':')[0]
	let member_command = #fs.subtek.decorrupt({target,args:{}}).split(/access directory with .*?:"/g)[1].split('"')[0]
	
	// Extract the news page and strategy page info
	let main_page = #fs.subtek.decorrupt({target}).split(/\n/g)
	let news_page = main_page[main_page.length-1].split(/\n/g)[0].split(/ /g)	
	news_page = main_page[main_page.length-1].split(/ ?\| ?/g)[0]
	let strategy_page = main_page[main_page.length-1].split(/ ?\| ?/g)[1].split(/ /g)[0]

	// Retrieve password from the page data
	let keyVals = {}
	keyVals[command] = strategy_page
	temp = #fs.subtek.decorrupt({target,args:keyVals})
	let password = temp.split('this strategy ')[1].split(' and')[0]

	// Process news page to collect project names
	keyVals[command] = news_page
	temp = #fs.subtek.decorrupt({target,args:keyVals})
	if (typeof temp == "object") {
		temp = temp.join('\n');
	}
	let projects = []
	for (let project_phrase of project_phrases) {
		let match
		while (match = project_phrase.exec(temp)) {
			projects.push(match[1])
		}
	}

	// Prepare to retrieve project members
	keyVals[command] = member_command
	keyVals["p"] = password;
	keyVals["pass"] = password;
	keyVals["password"] = password;

    keyVals = Object.getOwnPropertyNames(keyVals).reduce((acc, key) => {acc[key] = keyVals[key]; return acc;}, {});
    

	// Find project members
	let members = [];
	while(keyVals["project"] = projects.pop())
	{
		// Check if the operation is running too long; break if so
		let x = Date.now() - now < 4000
		if (!x) {
			break;
		}

        // Retrieve and process project member data
		temp = #fs.subtek.decorrupt({target,args:keyVals})
		if (typeof temp == "object") {
			temp = temp.join('\n');
		}
		let list = temp.split('\n');
		for (let i of list) {
			if (i.includes('<') || i.includes(' ')) {
				continue;
			}
            // Check if sec level is adequate and filter members
			let lv = #fs.scripts.get_level({name:i})
			if (typeof(lv) != "number") continue
			if (lv < 4) continue
			members.push(i);
		}
	}
    // Filter and sort the members by the provided regex, if applicable
	if (args.regex) {
		let regexp = RegExp(args.regex)
		return members.filter(x=>regexp.test(x))
	}
	return members.filter(x=>x).sort();
}