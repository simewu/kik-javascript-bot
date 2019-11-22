// Secure function visibility
Function.prototype.toString = () => "function() { [native code] }";

// Secure code evaluations
const secureEval = code => {
	const safeThis = {};
    return function() {
	    // Remove the parts we don't want the user to have access to
	    let msg = node = util = context = flow = global = consoleStringify = secureEval = undefined;
    	return eval(code); // Safe eval
    }.call(safeThis);
}

const consoleStringify = msg => {
    if(msg === undefined) {
        msg = "undefined";
    } else if(typeof msg == "string" || typeof msg == "number") { // Use JSON.stringify() on everything but strings and numbers
        msg = msg.toString();
    } else {
        try {
            if(msg.constructor !== undefined && (msg.constructor.name == "Object" || msg.constructor.name == "Array")) {
                msg = JSON.stringify(msg);
            } else {
                msg = msg.toString();
            }
        } catch(e) {
            msg = msg + "";
        }
    }
    return msg;
}

if(msg.kik.type == "start-chatting" || msg.kik.type == "scan-data") {
    msg.kik.message.body = "Help";
    msg.payload = msg.kik.message.body;
    msg.kik.message.type = "text";
    msg.kik.type = "text";
} else if(msg.kik.type != "text") {
    if(msg.kik.type == "link") {
        msg.kik.message.body = "I can't understand this...";
    } else {
        msg.kik.message.body = "I can't understand " + msg.kik.type + "s...";
    }
    try {
        let url;
        if(msg.kik.type == "picture") {
            url = msg.kik.message["picUrl"];
        } else if(msg.kik.type == "link") {
            url = msg.kik.message["url"];
        } else {
            url = msg.kik.message[msg.kik.type + "Url"];
            if(url === undefined) throw "";
        }
        msg.kik.message.body += " but here's its" + (url.startsWith("https://platform.kik.com") ? " temporary" : "") + " link\n" + url;

    } catch(e) {}
    msg.kik.attribution = undefined;
    msg.kik.message.stickerUrl = undefined;
    msg.kik.message.stickerPackId = undefined;
    msg.kik.message.picUrl = undefined;
    msg.kik.message.videoUrl = undefined;
    msg.payload = msg.kik.message.body;
    msg.kik.message.type = "text";
    msg.kik.type = "text";
    return msg;
}

//iOS bug fix
msg.payload = msg.payload.replace(/\u200b/g, "");
msg.payload = msg.payload.replace(/^\s*@bot\.js\s*/i, "");

// Introduction
if(msg.payload == "" || msg.payload.toLowerCase() == "@bot.js" || msg.payload.toLowerCase() == "help" || msg.payload.toLowerCase() == "hello" || msg.payload.toLowerCase() == "hi") {
    msg.kik.message.type = "text";
    msg.kik.message.body = "Hello! Send me some code, and I will evaluate it for you. Share your creations by visiting the #bot.js group chat! By using this bot, you agree to follow the community guidelines. Failure to comply will result in account reporting. Please be safe.\n\nFor information on how to use JavaScript, please refer to the following link. Happy coding! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference";
    msg.payload = msg.kik.message.body;
    
    /*//msg2.kik.message.type = "suggested";
    msg2.kik.message.body = "Hello!";
    msg2.kik.message.to = msg2.kik.message.from;
    msg2.kik.message.from = undefined;
    msg2.payload =  msg2.kik.message.body //msg.kik.message.body;
    msg2.kik.message.keyboards = [
        {
            to: msg2.kik.message.to,
            type: "suggested",
            //hidden: true,
            responses: [
                {
                    type: "text",
                    body: "console.log(\"Hello World\")"
                },
                {
                    type: "friend-picker",
                    body: "Choose Some Friends"
                }
            ]
        }
    ];*/
    // console.log(JSON.stringify(msg, null, "  "));
    return msg;
}

let __sendDefaultPayload = true;

const alert = (...args) => {
    if(args.length == 0) args[0] = "";
    msg.payload += args[0] + "\n";
    __sendDefaultPayload = false;
}
console.log = (...args) => {
    if(args.length == 0) args[0] = undefined;
    for(i in args) args[i] = consoleStringify(args[i]);
    alert(args.join(" "));
}
console.error = (...args) => {
    if(args.length == 0) args[0] = undefined;
    for(i in args) args[i] = consoleStringify(args[i]);
    alert("Error: " + args.join(" "));
}
console.warn = (...args) => {
    if(args.length == 0) args[0] = undefined;
    for(i in args) args[i] = consoleStringify(args[i]);
    alert("Warning: " + args.join(" "));
}
const process = {stdout(){}}; // process.stdout.write() has no newline
process.stdout.write = str => {
    if(args.length == 0) args[0] = "";
    for(i in args) msg.payload += consoleStringify(args[i]);
    __sendDefaultPayload = false;
}
process.stdout.error = process.stdout.write; 
const Console = console;
const Alert = alert;

let __response, __code = msg.payload;
msg.payload = "";
try {
    // Replace "this" with {}
    __response = secureEval.call({}, __code);
} catch(e) {
    __response = e.name.replace(/(?=[^\s])Error/, " Error") + ": " + e.message;
}
__response = consoleStringify(__response);
//console.log("type: " + (typeof __response) + "\n=" + __response + "\nsendDefaultPayload=" + __sendDefaultPayload);
if(__sendDefaultPayload != false || __response != "undefined") {
    msg.payload += __response;
}
if(msg.payload == "") msg.payload = "\"\"";
msg.payload = msg.payload.substring(0, 2000);
return msg;