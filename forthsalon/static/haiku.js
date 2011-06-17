function core_words() {
  var dict = new Object();
  dict['x'] = ['dstack.push(x);']; 
  dict['y'] = ['dstack.push(y);']; 

  dict['push'] = ['rstack.push(dstack.pop());'];
  dict['pop'] = ['dstack.push(rstack.pop());'];
  dict['>r'] = dict['push'];
  dict['r>'] = dict['pop'];

  dict['@'] = ['dstack.push(mem[dstack.pop()]);'];
  dict['!'] = ['var t = dstack.pop(); mem[t] = dstack.pop();'];

  dict['dup'] = ['dstack.push(dstack[dstack.length-1]);']; 
  dict['over'] = ['dstack.push(dstack[dstack.length-2]);']; 

  dict['2dup'] = ['dstack.push(dstack[dstack.length-2]);',
                  'dstack.push(dstack[dstack.length-2]);'];
  dict['z+'] = ['dstack[dstack.length-3] += dstack.pop();',
                'dstack[dstack.length-3] += dstack.pop();'];
  dict['z*'] = ['var t1 = dstack[dstack.length-4] * ' +
                         'dstack[dstack.length-2] - ' +
                         'dstack[dstack.length-3] * ' +
                         'dstack[dstack.length-1];',
                'var t2 = dstack[dstack.length-4] * ' +
                         'dstack[dstack.length-1] + ' +
                         'dstack[dstack.length-3] * ' +
                         'dstack[dstack.length-2];',
                'dstack.pop();',
                'dstack.pop();',
                'dstack[dstack.length-2] = t1;',
                'dstack[dstack.length-1] = t2;'];

  dict['drop'] = ['dstack.pop();'];
  dict['swap'] = ['var t = dstack[dstack.length-1];',
                  'dstack[dstack.length-1] = dstack[dstack.length-2];',
                  'dstack[dstack.length-2] = t;']

  dict['='] = ['dstack.push((dstack.pop() == dstack.pop())?1:0);'];
  dict['<>'] = ['dstack.push((dstack.pop() != dstack.pop())?1:0);'];
  dict['<'] = ['dstack.push((dstack.pop() > dstack.pop())?1:0);'];
  dict['>'] = ['dstack.push((dstack.pop() < dstack.pop())?1:0);'];
  dict['<='] = ['dstack.push((dstack.pop() >= dstack.pop())?1:0);'];
  dict['>='] = ['dstack.push((dstack.pop() <= dstack.pop())?1:0);'];

  dict['+'] = ['dstack.push(dstack.pop() + dstack.pop());'];
  dict['*'] = ['dstack.push(dstack.pop() * dstack.pop());'];
  dict['-'] = ['var t = dstack.pop();',
               'dstack.push(dstack.pop() - t);'];
  dict['/'] = ['var t = dstack.pop();',
               'dstack.push(dstack.pop() / t);'];
  dict['mod'] = ['var t = dstack.pop();',
                 'dstack.push(dstack.pop() % t);'];
  dict['pow'] = ['var t = dstack.pop();',
                 'dstack.push(Math.pow(dstack.pop(), t));'];
  dict['**'] = dict['pow'];
  dict['atan2'] = ['var t = dstack.pop();',
                   'dstack.push(Math.atan2(dstack.pop(), t));'];

  dict['and'] = ['var t = dstack.pop();',
                 'dstack.push((dstack.pop() && t)?1:0);'];
  dict['or'] = ['var t = dstack.pop();',
                'dstack.push((dstack.pop() || t)?1:0);'];
  dict['not'] = ['dstack[dstack.length-1] = (!dstack[dstack.length-1])?1:0;'];

  dict['min'] = ['dstack.push(Math.min(dstack.pop(), dstack.pop()));'];
  dict['max'] = ['dstack.push(Math.max(dstack.pop(), dstack.pop()));'];

  dict['negate'] = ['dstack[dstack.length-1] = -dstack[dstack.length-1];'];
  dict['sin'] = [
      'dstack[dstack.length-1] = Math.sin(dstack[dstack.length-1]);'];
  dict['cos'] = [
      'dstack[dstack.length-1] = Math.cos(dstack[dstack.length-1]);'];
  dict['tan'] = [
      'dstack[dstack.length-1] = Math.tan(dstack[dstack.length-1]);'];
  dict['log'] = [
      'dstack[dstack.length-1] = Math.log(dstack[dstack.length-1]);'];
  dict['exp'] = [
      'dstack[dstack.length-1] = Math.exp(dstack[dstack.length-1]);'];
  dict['sqrt'] = [
      'dstack[dstack.length-1] = Math.sqrt(dstack[dstack.length-1]);'];
  dict['floor'] = [
      'dstack[dstack.length-1] = Math.floor(dstack[dstack.length-1]);'];
  dict['ceil'] = [
      'dstack[dstack.length-1] = Math.ceil(dstack[dstack.length-1]);'];
  dict['abs'] = [
      'dstack[dstack.length-1] = Math.abs(dstack[dstack.length-1]);'];

  dict['pi'] = ['dstack.push(Math.PI);'];

  dict['random'] = ['dstack.push(Math.random());'];

  dict['if'] = ['if(dstack.pop()) {'];
  dict['else'] = ['} else {'];
  dict['then'] = ['}'];

  dict['here'] = ['dstack.push(here);'];
  dict['allot'] = ['here += dstack.pop();'];

  return dict;
}

function code_tags(src) {
  var tags = [];
  var char_count = src.length;
  src = src.replace(/[ \r\t]+/, ' ');
  src = src.replace(/[ ]+\n/, '\n');
  src = src.replace(/\n[ ]+/, '\n');
  src = src.replace(/[\n]+/, '\n');
  src = src.replace(/[\n]$/, '');
  // Measure each line.
  var lines = src.split('\n');
  var line_counts = [];
  for (var i = 0; i < lines.length; i++) {
    line_counts.push(lines[i].trim().split(' ').length);
  }
  // Pull out each word.
  var words = src.replace(/[ \n]+/g, ' ').trim().split(' ');
  // Decide style.
  if (lines.length == 3 &&
      lines[0].trim().split(' ').length == 5 &&
      lines[1].trim().split(' ').length == 7 &&
      lines[2].trim().split(' ').length == 5) {
    // Haiku has 7-5-7 words.
    tags.push('style:haiku');
  } else if (src.length <= 140) {
    // Short is <= 140 characters.
    tags.push('style:short');
  } else {
    // Anything else is long.
    tags.push('style:long');
  }
  // Detect animation.
  for (var i = 0; i < words.length; i++) {
    if (words[i].toLowerCase() == 't') {
      tags.push('animated');
      break;
    }
  }
  // Show counts.
  tags.push('characters:' + char_count);
  tags.push('words:' + words.length);
  tags.push('lines:' + line_counts.join(','));
  return tags;
}

if (typeof String.prototype.trim != 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/, ''); 
  }
}

function compile(src) {
  var code = ['var go = function(x, y) {',
              ' var dstack=[]; var rstack=[]; var mem=[]; var gas=512;',
              ' var here = 1024;'];
  var dict = core_words();
  var var_index = 0;
  var func_index = 0;
  var pending_cost = 0;
  src = src.replace(/[ \r\n\t]+/g, ' ').trim();
  src = src.split(' ');
  for (var i = 0; i < src.length; i++) {
    pending_cost++;
    var word = src[i];
    word = word.toLowerCase();
    if (word == 'variable') {
      i++;
      dict[src[i]] = ['dstack.push(' + var_index + ');'];
      var_index++;
    } else if (word == '(') {
      // Skip comments.
      while (i < src.length && src[i] != ')') {
        i++;
      }
    } else if (word == ':') {
      i++;
      dict[src[i]] = ['func' + func_index + '();'];
      code.push('function func' + func_index + '() {');
      func_index++;
    } else if (word == ';') {
      code.push('}');
    } else if (word in dict) {
      var meaning = dict[word];
      var need_check = (meaning.length == 1 &&
                        meaning[0].substr(0, 4) == 'func') ||
	               pending_cost > 10;
      var gas_check = 'if (gas < 0) { return [0.87, 0.69, 1.0]; }';
      if (need_check) {
        code.push('gas -= ' + pending_cost + ';');
        code.push(gas_check);
        pending_cost = 0;
      }
      code = code.concat(dict[word]);
      if (need_check) {
        code.push(gas_check);
      }
    } else {
      code.push('dstack.push(' + parseFloat(word) + ');');
    }
  }
  code.push('return dstack; }; go');
  code = eval(code.join(' '));
  return code;
}

function render_rows(image, ctx, img, y, w, h, next) {
  start = new Date().getTime();
  try {
    // Decide if we're on android or a normal browser.
    if (navigator.userAgent.toLowerCase().search('android') < 0) {
      while (y < h && new Date().getTime() - start < 250) {
        var pos = w * (h - 1 - y) * 4;
        for (var x = 0; x < w; x++) {
          var col = image(x / w, y / h);
          if (col[3] == null) col[3] = 1;
          img.data[pos++] = Math.floor(col[0] * 255);
          img.data[pos++] = Math.floor(col[1] * 255);
          img.data[pos++] = Math.floor(col[2] * 255);
          img.data[pos++] = Math.floor(col[3] * 255);
        }
        y++;
      }
    } else {
      // Work around what seems to be an android canvas bug?
      while (y < h && new Date().getTime() - start < 250) {
        var pos = w * (h - 1 - y) * 4;
        for (var x = 0; x < w; x++) {
          var col = image(x / w, y / h);
          if (col[3] == null) col[3] = 1;
          if (isNaN(col[3])) col[3] = 0;
          var alpha = col[3];
          var alpha1 = 1 - col[3];
          col[0] = col[0] * alpha + alpha1;
          col[1] = col[1] * alpha + alpha1;
          col[2] = col[2] * alpha + alpha1;
          col[3] = 1;
          img.data[pos++] = Math.floor(col[0] * 255);
          img.data[pos++] = Math.floor(col[1] * 255);
          img.data[pos++] = Math.floor(col[2] * 255);
          img.data[pos++] = Math.floor(col[3] * 255);
        }
        y++;
      }
    }
  } catch(e) {
    // Ignore errors.
  }
  ctx.putImageData(img, 0, 0);
  if (y < h) {
    setTimeout(function() {
      render_rows(image, ctx, img, y, w, h, next);
    }, 0);
  } else {
    setTimeout(next, 0);
  }
}

function render(cv, image, next) {
  var ctx = cv.getContext('2d');
  var w = cv.width;
  var h = cv.height;
  var img = ctx.createImageData(w, h);

  render_rows(image, ctx, img, 0, w, h, function() {
    setTimeout(next, 0);
  });
}

function find_tag(parent, tag) {
  for (var i = 0; i < parent.childNodes.length; i++) {
    var child = parent.childNodes[i];
    if (child.tagName == tag.toUpperCase()) return child;
  }
  return null;
}

function update_haikus_one(work, next) {
  if (work.length == 0) {
    next();
    return;
  }
  var cv = work[0][0];
  var img = work[0][1];
  work = work.slice(1);
  render(cv, img, function() { update_haikus_one(work, next); });
}

function update_haikus(next) {
  var haikus = document.getElementsByName('haiku');
  var work = [];
  for (var i = 0; i < haikus.length; i++) {
    var haiku = haikus[i];
    var code_tag = find_tag(haiku, 'textarea');
    var code = code_tag.value;
    var canvas = find_tag(haiku, 'canvas');
    if (canvas == null) {
      canvas = document.createElement('canvas');
      haiku.appendChild(canvas);
    }
    canvas.setAttribute('width', haiku.getAttribute('width'));
    canvas.setAttribute('height', haiku.getAttribute('height'));
    try {
      work.push([canvas, compile(code)]);
    } catch(e) {
      // Ignore errors.
    }
  }
  update_haikus_one(work, next);
}