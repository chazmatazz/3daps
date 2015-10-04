// runs the user script
// divides textbox into lines and sends them to be parsed individually (at first)
function run_user_script() {
    reset_all();

    var error = false;
    var script = document.code_form.code_box.value;

    parse_functions(script);

    var move = go_to("Main", []);

    if (move == null) {
        document.code_form.code_box.value += "\nError";
    } else {
        g_playerMovement.push(move);
    }
}

/**
 * Tracks key down events.
 * @param {Event} e keyboard event.
 */
function onKeyDown(e) {
    g_keyDown[e.keyCode] = true;
}

/**
 * Tracks key up events.
 * @param {Event} e keyboard event.
 */
function onKeyUp(e) {
    g_keyDown[e.keyCode] = false;
}

/**
 * Look at keys.
 */
function handleMoveKeys(elapsedTime) {
}



/* Added by Ken, captures 'tab' inputs as indents instead of navigating to
 the next form */
function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function replaceSelection (input, replaceString) {
    if (input.setSelectionRange) {
        var selectionStart = input.selectionStart;
        var selectionEnd = input.selectionEnd;

        var scrollTop = input.scrollTop; // fix scrolling issue with Firefox
        input.value = input.value.substring(0, selectionStart) + replaceString +
            input.value.substring(selectionEnd);
        input.scrollTop = scrollTop;


        if (selectionStart != selectionEnd){
            setSelectionRange(input, selectionStart, selectionStart + 	replaceString.length);
        }else{
            setSelectionRange(input, selectionStart + replaceString.length, selectionStart + replaceString.length);
        }

    }else if (document.selection) {
        var range = document.selection.createRange();

        if (range.parentElement() == input) {
            var isCollapsed = range.text == '';
            range.text = replaceString;

            if (!isCollapsed)  {
                range.moveStart('character', -replaceString.length);
                range.select();
            }
        }
    }
}

function catchTab(item,e){
    if(navigator.userAgent.match("Gecko")){
        c=e.which;
    }else{
        c=e.keyCode;
    }
    if(c==9){
        replaceSelection(item,"   ");
        setTimeout("document.getElementById('"+item.id+"').focus();",0);
        return false;
    }
}
