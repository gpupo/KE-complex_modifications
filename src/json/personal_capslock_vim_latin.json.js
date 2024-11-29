// JavaScript should be written in ECMAScript 5.1.

function main() {
  console.log(
    JSON.stringify(
      {
        title: 'gpupo 60%rules',
        rules: [].concat(caps_rules()),
      },
      null,
      '  '
    )
  )
}
function createManipulator(key, toKey, modifiers, conditions) {
  var manipulator = {
    conditions: conditions,
    from: {
      key_code: key,
      modifiers: { optional: ["any"] }
    },
    to: [{ key_code: toKey }],
    type: "basic"
  };

  if (modifiers && modifiers.length > 0) {
    manipulator.to[0].modifiers = modifiers;
  }

  return manipulator;
}

//conditions: only caps lock pressed
var cl_on_con = [{
  name: "caps_lock pressed",
  type: "variable_if",
  value: 1
}]
var doc_map = {
  "CAPS": "Esc",
  "CAPS+h/j/k/l": "←↓↑→",
  "CAPS+i/o": "Home/End",
  "CAPS+w/b": "Word left/right",
  "CAPS+Backspace": "Delete Forward"
};
var mappings = [
  { from: "j", to: "down_arrow", c: cl_on_con },
  { from: "k", to: "up_arrow", c: cl_on_con },
  { from: "h", to: "left_arrow", c: cl_on_con },
  { from: "l", to: "right_arrow", c: cl_on_con },
  { from: "d", to: "page_down", c: cl_on_con },
  { from: "u", to: "page_up", c: cl_on_con },
  { from: "i", to: "home", c: cl_on_con },
  { from: "o", to: "end", c: cl_on_con },
  { from: "delete_or_backspace", to: "delete_forward", c: cl_on_con },
  { from: "w", to: "left_arrow", modifiers: ["option"], c: cl_on_con },
  { from: "b", to: "right_arrow", modifiers: ["option"], c: cl_on_con },
];

var capsLockManipulator = {
  from: {
    key_code: "caps_lock",
    modifiers: { optional: ["any"] }
  },
  to: [
    {
      set_variable: {
        name: "caps_lock pressed",
        value: 1
      }
    }
  ],
  to_after_key_up: [
    {
      set_variable: {
        name: "caps_lock pressed",
        value: 0
      }
    }
  ],
  to_if_alone: [{ key_code: "escape" }],
  type: "basic"
};

function render_doc(doc_map) {
  var result = Object.keys(doc_map).map(function(key) {
    return key + " › " + doc_map[key];
  }).join(", ");

  return result
}

function caps_rules() {
  var manipulators = [];
  for (var i = 0; i < mappings.length; i++) {
    var map = mappings[i];
    manipulators.push(createManipulator(map.from, map.to, map.modifiers || [], map.c || []));
  }
  manipulators.push(capsLockManipulator);

  return {
    description: render_doc(doc_map),
    manipulators: manipulators
  };
}
main()
