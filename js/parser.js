
// preprocess - for now, turn all for () { loops into while () { loops
function pre_process_commands(arr) {
    var sub_array;

    for (var i=0; i<arr.length; i++) {
        var test = arr[i];                  // remove later


        if (arr[i].match(/\b(for)\b\s+\(/)) { //[A-Za-z0-9_\,\.\(\)\+\-\/\*=<>!;]+\)\s*{/)) {
            sub_array = arr[i].split("(", 2);
            sub_array[1] = sub_array[1].replace(/\s/g, "");
            new_commands_array = sub_array[1].split(/[;\)]/);
            arr[i] = "while (" + new_commands_array[1] + ") {";
            arr.splice(i, 0, (new_commands_array[0] + ";"));
            end_function_index = get_index_closing_bracket(arr, i+1);
            arr.splice(end_function_index-1, 0, (new_commands_array[2] + ";"));
        }
    }

    return arr;

}

// parse all the functions in the script to an array of functions
function parse_functions(script) {

    var commands = script.split("\n");
    var help_cmds;
    var new_commands;
    var arr;
    var args_names;
    var line;


    for (var i=0; i<commands.length; i++) {
        line = commands[i];

        f_index = line.indexOf("function ");

        if ((f_index >= 0) && (line.indexOf("{") > 0)) {
            line = line.replace(/^\s*/, "").replace(/\s*$/, "");

            // make arguments... put into an array, and send them to execute commands
            arr = line.split(/[()]/);
            name = (arr[0].split(" "))[1];
            args_names = [];
            if (arr[1].length > 0) { args_names = arr[1].split(", "); }

            help_cmds = get_bracketed_commands(commands, i);
            i += help_cmds.length-1;
            new_commands = pre_process_commands(help_cmds);

            func = new UserFunction(name, new_commands, args_names);

            g_functions.push(func);
        }
    }

}

// return the commands for the function with name
// return null if not found
function find_function(aName) {

    for (var i=0; i<g_functions.length; i++) {
        if (g_functions[i].name == aName) {
            return g_functions[i];
        }
    }

    return null;

}

// executes the code at function str func
// recursive
// returns the movement created
function go_to(func_name, args_values) {

    func = find_function(func_name);
    if (func == null) { return null; }

    return (execute_at_commands(func.commands, args_values, func.arg_names));

}

// find and return the index of the closing bracket                 REMOVE THIS
// helper function for find function command
function get_closing_bracket(start) {
    var count = 1;

    var i = g_script.indexOf("{", start);
    if (i < 0) { return -1; }

    i += 1;

    while (count > 0) {
        if (i>=g_script.length) { return -1; }
        if (g_script[i] == "}") { count -= 1; }
        if (g_script[i] == "{") { count += 1; }
        i++;
    }

    return i;
}

// executes an array of commands using a list of arguments and values
// returns a movement created by these commands
function execute_at_commands(commands, args_values, args_names) {
    var arr = [];
    var i;

    // first make value and name arrays for valuable - populate with arguments
    var var_values = [];
    for (i = 0; i < args_values.length; i++) {
        var_values.push(args_values[i]);
    }

    var var_names = [];
    for (i = 0; i < args_names.length; i++) {
        var_names.push(args_names[i]);
    }

    for (i=1; i<commands.length; i++) {
        var help_arr = evaluate_line(commands, i, var_values, var_names);
        i = help_arr[1];

        if (help_arr[0] != null) {
            arr.push(help_arr[0]);
        }
    }

    return new OrderMovements(arr);
}


// takes a single line and does all the processing of operations, variable replacements, comparisons, etc.
function process_line(line, values, names) {

    line = line.replace(/([A-Za-z0-9_\s]+)\+=([A-Za-z0-9\s]+)/, "$1" + "=" + "$1" + "+" + "$2");
    line = line.replace(/([A-Za-z0-9_\s]+)\-=([A-Za-z0-9\s]+)/, "$1" + "=" + "$1" + "-" + "$2");
    line = line.replace(/([A-Za-z0-9_\s]+)\+\+/, "$1" + "=" + "$1" + "+ 1");
    line = line.replace(/([A-Za-z0-9_\s]+)\-\-/, "$1" + "=" + "$1" + "- 1");

    line = parse_variable_values(line, values, names);	// puts values into all known variables

    line = line.replace(/([^A-Za-z0-9_])\((-*\d+\.*\d*)\)/g, "$1" + "$2");	// removes redundant ()

    if (line.match(/[\-]/) != null) {
        line = line.replace(/(\d)\-(\d)/g, "$1" + "+-" + "$2");
        line = line.replace(/(\d)\-\-(\d)/g, "$1" + "+" + "$2");
        line = line.replace(/\-\-(\d)/g, "$1");
    }

    line = evaluate_operations(line);			// evaluates all +-/* and removes ()

    if (line.match(/_random/) != null) {
        line = evaluate_random(line);
    }

    line = evaluate_comparisons(line);			// evaluates (==, <, >, <=, >=), stores 0 or 1, removes ()

    if (line.match(/[!&{2}|{2}]/)) {			// adding - evaluate complex &&, ||, !

        line = line.replace(/!true/, "false");
        line = line.replace(/!false/, "true");

        line = evaluate_logic_expressions(line);

    }

    return line;
}


// evaluate a single line (at commands[index] and return a move created from it
function evaluate_line(commands, index, values, names) {
    var new_commands;
    var line = commands[index];
    line = line.replace(/^\s*/, "").replace(/\s*$/, "");		// gets rid of excess white space
    if ((line == "") || (line== "}")) { return [null, index]; }
    var aMove = null;

    line = process_line(line, values, names);

    // work on this later - embedded function calls
    // find a way to search outside in for these - func(func2(y), func2(z)))
    // if you have more () then you can't advance - index
    if (line.match(/\s*\b(_move|_rotate|_moveTo|_reset)\b\([\-0-9., ]*\);/)) {
        aMove = process_base_function(line);
        return ([aMove, index]);
    } else {
        var f_call = line.match(/[A-Za-z0-9_\-]+\([\-0-9., ]*\)/);
        while (f_call) {
            aMove = process_user_defined_function(f_call[0]);
            line = line.replace(/[A-Za-z0-9_\-]+\([\-0-9., ]*\)/, return_register);
            f_call = line.match(/[A-Za-z0-9_\-]+\([\-0-9., ]*\)/);
        }
        // may not want to return
        // because these could contain a return value that requires evaluation
        // or there could be another, imbedded function call - not allowing for now

    }

    if ((line.indexOf("DoInOrder {") >= 0) || (line.indexOf("DoTogether {") >= 0)) {
        new_commands = get_bracketed_commands(commands, index);
        aMove = process_base_movement(new_commands, values, names);
        index += new_commands.length - 1;
        return ([aMove, index]);
    }

    // conditional (if/then... else)
    if (line.match(/\b(if)\b\s+\b(true|false)\b/)) {
        new_commands = get_bracketed_commands(commands, index);
        aMove = process_conditional(line, new_commands, values, names);
        index += new_commands.length - 1;
        return ([aMove, index]);
    }

    // while loop (while true do )
    if (line.match(/\b(while)\b\s+\b(true)\b/)) {
        new_commands = get_bracketed_commands(commands, index);
        aMove = process_while_loop(new_commands, values, names);
        index -= 1;
        return ([aMove, index]);
    } else if (line.match(/\b(while)\b\s+\b(false)\b/)) {
        var length = get_index_closing_bracket(commands, index);
        index = length - 1;
        return ([aMove, index]);
    }

    // loop - for (i=0; i < ex; i++) {

    create_variables(line, names, values);		// create variables for all "var" and "global" designations

    assign_variables(line, names, values);		// assign values to variables [var_name]\s*=\s*\d\.+\d+;

    // check return value
    var return_match = line.match(/\b(return)\b\s+\-*\d+\.*\d*/);
    if (return_match) {
        var return_value = return_match[0].split(/\s+/);
        return_register = return_value[1];
    }

    return ([aMove, index]);
}


// evaluate all (*/+-==<>) expressions - recursively - in order */+-
// evaluates () expressions first - and remove () after evaluation
function evaluate_operations(line) {
    var arr, x, y, z;

    var index_any_ex = line.search(/\-*\d+\.*\d*\s*[\+\*\-\/]\s*\-*\d+\.*\d*/);
    if (index_any_ex < 0) {
        return line;
    }

    var expression_string = null;

    // we may have to check here for () expressions, but I'm going to skip this first and see if it works

    // in order *, /, +, -
    expression_string = line.match(/\-*\d+\.*\d*\s*[\*]\s*\-*\d+\.*\d*/);
    if (expression_string != null) {
        arr = expression_string[0].split(/\s*\*\s*/);
        x = parseFloat(arr[0]);
        y = parseFloat(arr[1]);
        z = x * y;
        line = line.replace(/\-*\d+\.*\d*\s*[\*]\s*\-*\d+\.*\d*/, z);

    } else {
        expression_string = line.match(/\-*\d+\.*\d*\s*[\/]\s*\-*\d+\.*\d*/);
        if (expression_string != null) {
            arr = expression_string[0].split(/\s*\/\s*/);
            x = parseFloat(arr[0]);
            y = parseFloat(arr[1]);
            z = x / y;
            line = line.replace(/\-*\d+\.*\d*\s*[\/]\s*\-*\d+\.*\d*/, z);
        } else {
            expression_string = line.match(/\-*\d+\.*\d*\s*[\+]\s*\-*\d+\.*\d*/);
            if (expression_string != null) {
                arr = expression_string[0].split(/\s*\+\s*/);
                x = parseFloat(arr[0]);
                y = parseFloat(arr[1]);
                z = x + y;
                line = line.replace(/\-*\d+\.*\d*\s*[\+]\s*\-*\d+\.*\d*/, z);
            } else {
                expression_string = line.match(/\-*\d+\.*\d*\s*[\-]\s*\-*\d+\.*\d*/);
                if (expression_string != null) {
                    arr = expression_string[0].split(/\s*\-\s*/);
                    x = parseFloat(arr[0]);
                    y = parseFloat(arr[1]);
                    z = x - y;
                    line = line.replace(/\-*\d+\.*\d*\s*[\-]\s*\-*\d+\.*\d*/, z);
                }
            }
        }
    }

    line = line.replace(/([^A-Za-z0-9_])\((-*\d+\.*\d*)\)/g, "$1" + "$2");				// remove redundant ()

    return (evaluate_operations(line));
}

// must look like this (x == 5)... spaces and () critical to functioning
function evaluate_comparisons(line) {
    var arr, op, x, y, z;

    var expression_string = line.match(/\(\-*\d+\.*\d*\s*(==|<=|>=|<|>|!=)\s*\-*\d+\.*\d*\)/);
    while (expression_string != null) {
        arr = expression_string[0].split(expression_string[1]);
        x = parseFloat(arr[0].replace(/[\(\)\s*]/, ""));
        op = expression_string[1];
        y = parseFloat(arr[1].replace(/[\(\)\s*]/, ""));

        z = 0;
        switch (op) {
            case "==": z = (x == y); break;
            case "!=": z = (x != y); break;
            case ">=": z = (x >= y); break;
            case "<=": z = (x <= y); break;
            case "<": z = (x < y); break;
            case ">": z = (x > y); break;
        }

        line = line.replace(/\(\-*\d+\.*\d*\s*(==|<=|>=|<|>|!=)\s*\-*\d+\.*\d*\)/, z);
        expression_string = line.match(/\(\-*\d+\.*\d*\s*(==|<=|>=|<|>|!=)\s*\-*\d+\.*\d*\)/);
    }

    return line;
}


// must look like _random(int_low, int_high)
function evaluate_random(line) {

    var expression_string = line.match(/_random\(([0-9]+), ([0-9]+)\)/);
    while (expression_string != null) {
        var x = parseFloat(expression_string[1]);
        var y = parseFloat(expression_string[2]);

        var z = Math.floor(Math.random()*(y-x)) + x;

        line = line.replace(/_random\(([0-9]+), ([0-9]+)\)/, z);
        expression_string = line.match(/_random\(([0-9]+), ([0-9]+)\)/);
    }

    return line;

}

// evaluates
// works like operations, do simple function, then remove (), repeat
function evaluate_logic_expressions(line) {

    var replace_str = "false";

    var logic_expression = line.match(/\b(true|false)\b\s*(&&|\|\|)\s*\b(true|false)\b/);
    if (!logic_expression) { return line; }

    if (logic_expression != null) {
        if (logic_expression[2] == "&&") {
            if ((logic_expression[1] == "true") && (logic_expression[3] == "true")) {
                replace_str = "true";
            }
        } else if (logic_expression[2] == "||") {
            if ((logic_expression[1] == "true") || (logic_expression[3] == "true")) {
                replace_str = "true";
            }
        }

        line = line.replace(/\b(true|false)\b\s*(&&|\|\|)\s*\b(true|false)\b/, replace_str);
    }

    line = line.replace(/\(\b(true|false)\b\)/g, "$1");				// remove redundant ()

    return (evaluate_logic_expressions(line));

}


// find all the incidents of variable names within the line
// places value from value array into incidents of variable names
function parse_variable_values(line, values, names) {

    if ((values.length == 0) && (g_values.length ==0)) { return line; }

    var eq_index = line.search(/[^!=]=[^=><]/);

    if (eq_index >= 0) {
        l1 = line.slice(0, (eq_index+1));
        line = line.slice(eq_index+1);
    } else { l1 = ""; }

    // slice this at "=" ... /=[^=><]/
    // only fix variables in 2nd half
    // then put back together

    var i;
    // first place values into all instances of known variables
    for (i=0; i<names.length; i++) {
        r_str = "\\b" + names[i] + "\\b";
        reg = new RegExp(r_str, 'g');
        line = line.replace(reg, values[i]);
    }

    // first place values into all instances of known variables
    for (i=0; i<g_names.length; i++) {
        r_str = "\\b" + g_names[i] + "\\b";
        reg = new RegExp(r_str, 'g');
        line = line.replace(reg, g_values[i]);
    }

    return l1 + line;
}


// create variables for all "var" and "global" designations
function create_variables(line, names, values) {

    var local_var = line.match(/var\s[A-Za-z0-0_]/);			// create variables for all "var" designations
    if (local_var != null) {
        var arr = local_var[0].split(" ");
        names.push(arr[1]);
        values.push("");
    }

    var global_var = line.match(/global\s[A-Za-z0-0_]/);		// create variables for all "global" designations
    if (global_var != null) {
        var arr2 = global_var[0].split(" ");
        g_names.push(arr2[1]);
        g_values.push("");
    }
}

// assign values to variables [var_name]\s*=\s*\d\.+\d+;
function assign_variables(line, names, values) {
    var i;

    var assignment = line.match(/[A-Za-z0-0_]+\s*=\s*\-*\d+\.*\d*/);
    if (assignment != null) {
        var arr = assignment[0].split("=");
        var name = arr[0].replace(/[\s]/, "");
        var value = arr[1].replace(/[\s;]/, "");
        for (i = 0; i < names.length; i++) {
            if (names[i] == name) {
                values[i] = value;
                return;
            }
        }
        for (i = 0; i < g_names.length; i++) {
            if (g_names[i] == name) {
                g_values[i] = value;
                return;
            }
        }
        g_names.push(name);
        g_values.push(value);
    }
}


// returns an array of lines from this { to the its }
function get_bracketed_commands(cmd, start_index) {
    var new_commands = [];

    var i = start_index;
    var count = 1;
    new_commands.push(cmd[i]);
    i++;

    while ( (i < cmd.length) && (count > 0) ) {
        new_commands.push(cmd[i]);
        if (cmd[i].indexOf("}") >= 0) { count -= 1; }
        if (cmd[i].indexOf("{") >= 0) { count += 1; }
        i++;
    }

    return (new_commands);
}

// returns the index of the closing }
function get_index_closing_bracket(cmd, start_index) {
    var i = start_index;
    var count = 1;
    i++;

    while ( (i < cmd.length) && (count > 0) ) {
        if (cmd[i].indexOf("}") >= 0) { count -= 1; }
        if (cmd[i].indexOf("{") >= 0) { count += 1; }
        i++;
    }

    return i;

}

// returns the index of the correct } else {
// returns index at the end of } if not found
function get_index_of_else(cmd) {
    var i = 1;
    var count = 1;

    while ( (i < cmd.length) && (count > 0) ) {
        if ((cmd[i].match(/}\s*else\s*{/)) && (count == 1)) {
            return i;
        }
        if (cmd[i].indexOf("}") >= 0) { count -= 1; }
        if (cmd[i].indexOf("{") >= 0) { count += 1; }
        i++;
    }
    return i;
}


// don't send the whole line here - just send the function call
function process_user_defined_function(line) {

    var function_array = line.split(/[()]/);
    if (function_array.length < 2) {return null;}		// check for correct format

    var func_name = function_array[0].replace(/^\s*/, "").replace(/\s*$/, "");
    var args = [];
    if (function_array[1].length>0) {
        args = function_array[1].split(", ");
    }

    return (go_to(func_name, args));
}

// process the while loop
// do we need to keep track of "Do_Together" flag?
function process_while_loop(commands, values, names) {
    var arr = [];

    for (var i=1; i<commands.length; i++) {
        var help_arr = evaluate_line(commands, i, values, names);
        i = help_arr[1];

        if (help_arr[0] != null) {
            arr.push(help_arr[0]); 			// only single movements now
        }
    }

    return new OrderMovements(arr);
}



// process the DoInOrder {} and DoTogether {} composite movement containers
function process_base_movement(commands, values, names) {
    var arr = [];

    for (var i=1; i<commands.length; i++) {
        var help_arr = evaluate_line(commands, i, values, names);
        i = help_arr[1];

        if (help_arr[0] != null) {
            arr.push(help_arr[0]); 			// only single movements now
        }
    }

    var move = null;
    if (commands[0].indexOf("DoInOrder {") > -1) {
        move = new OrderMovements(arr);
    } else {
        move = new TogetherMovements(arr);
    }

    return move;

}

// process conditional - if/then
function process_conditional(line, commands, values, names) {
    var arr = [];
    var i, help_arr;

    var end_index = commands.length;
    var else_index = get_index_of_else(commands);		// find the index of the correct } else {

    if (line.match(/\b(true)\b/)) {			// if true cycle through 1 to end_index (else_index)
        for (i=1; i<else_index; i++) {
            help_arr = evaluate_line(commands, i, values, names);
            i = help_arr[1];

            if (help_arr[0] != null) {
                arr.push(help_arr[0]); 			// only single movements now
            }
        }
    } else {						// if false and else_index > 0, then cycle else_index+1 - end_index
        for (i=else_index; i<end_index; i++) {
            help_arr = evaluate_line(commands, i, values, names);
            i = help_arr[1];

            if (help_arr[0] != null) {
                arr.push(help_arr[0]);
            }
        }
    }

    return new OrderMovements(arr);

}

// returns the command created, null if error
function process_base_function(line) {

    line = line.replace(/^\s*/, "").replace(/\s*$/, "");

    var function_array = line.split(/[()]/);
    if (function_array.length < 2) {return null;}		// check for correct format

    var func_name = function_array[0].replace(/\s*$/, "");
    var args = function_array[1].split(", ");

    var x = parseFloat(args[1]);
    var y = parseFloat(args[2]);
    var z = parseFloat(args[3]);
    var index = parseFloat(args[0]);
    var time = parseFloat(args[4]);

    // check for and execute move = _move(i, x, y, z, time)
    if (func_name == "_move") {
        return new SingleMovement(x, y, z, 0, 0, 0, time, index);
    }

    // check for and execute move = _moveTo(i, x, y, z, time)
    if (func_name == "_moveTo") {
        return new SingleMovementTo(x, y, z, time, index);
    }

    // check for and execute move = _reset(index)
    if (func_name == "_reset") {
        return new Identity(index);
    }

    // check for and execute move = _rotate(i, x, y, z, time)
    if (func_name == "_rotate") {
        return new SingleMovement(0, 0, 0, x * 3.14159265 / 180.0, y * 3.14159265 / 180.0, z * 3.14159265 / 180.0, time, index);
    }

    return null;
}
