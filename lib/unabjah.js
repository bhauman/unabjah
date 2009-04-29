var UnabJah = Class.create( {
  initialize: function(rules, options) {
    this.options = Object.extend({scope:'default'}, options || {});
    this.rules = rules || {};
    this.apply_responder();
    this.add_rules(this.rules);
    this.add_onload_handler();
  },
  apply_responder: function() {
    if (!this.responderApplied) {
      Ajax.Responders.register({
        onComplete : function() {
          setTimeout(function() { this.apply_rules(); }.bind(this), 10);
        }.bind(this)
      });
      this.responderApplied = true;
    }
  },
  add_onload_handler: function() {
    document.observe('dom:loaded', function() { this.apply_rules(); }.bind(this));
  },
  apply_rules: function(update_elem) {
    for(var selector in this.rules)
      this.apply_rule(selector, this.rules[selector], update_elem);
  },
  apply_rule: function(selector, func, update_elem) {
    var items = update_elem ? update_elem.select(selector) : $$(selector);
    items.each(function (el) {
      if(!this.rule_has_been_applied(el,selector)) {
        this.mark_rule(el, selector);
        func(el);
      }
    }.bind(this));
  },
  mark_rule: function (el, selector) {
    el[this.scope()][selector] = true;
  },
  rule_has_been_applied: function(el, selector) {
    if(!el[this.scope()]) el[this.scope()] = {};
    return el[this.scope()][selector] || false;
  },
  scope: function() {
    return 'unabja_rules_' + this.options.scope;
  },
  add_rules: function(rules) {
    Object.extend(this.rules, rules);
  }
});


