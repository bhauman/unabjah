describe 'Unabja'
  before
    play_area = new Element('div', { id:'play_area', style:'display:none'})

    $$('body')[0].insert(play_area)

    simple_pro = new UnabJa({ })
    simple_pro_other_scope = new UnabJa({ }, { scope:'other_scope' })
  end

  before_each
    home_element =  new Element('ul')
    $R(1,5).each(function(){ home_element.insert('<li class="sp_tester"></li>'); })
    play_area.insert(home_element)
  end

  after_each
   play_area.update('')
   simple_pro.rules = { }
   simple_pro_other_scope.rules = { }

  end

  it "should apply rules onload"
    $$('#fixture-1 li').each(function(el){
      el.hasClassName('hello_man').should.be true
    })
  end

  it "should only have one one rule applied per selector and that rule can be reassigned"
    var class_name = 'applied'
    simple_pro.add_behavior({ 'li': function(el){ el.addClassName(class_name) } })
    simple_pro.add_behavior({ 'li': function(el){ el.addClassName(class_name + "_other") } })
    simple_pro.apply_rules(play_area)

    play_area.select('li').each( function(el) {
      el.hasClassName(class_name).should.be false
      el.hasClassName(class_name + '_other').should.be true
    });

  end

  it "a different scope should have different rules"
    var func1 = function(el){ el.addClassName("ohyeah"); };
    var func2 = function(el){ el.addClassName("ohyeah2"); };
    simple_pro.add_behavior({ 'li#boy': func1 })
    simple_pro_other_scope.add_behavior({ 'li#boy': func2 });
    simple_pro.rules['li#boy'].should.be func1
    simple_pro_other_scope.rules['li#boy'].should.be func2
  end

  it "should only apply its own scoped rules"
    var func1 = function(el){ el.addClassName("ohyeah"); };
    var func2 = function(el){ el.addClassName("ohyeah2"); };
    play_area.select('li').each( function(el){ el.addClassName('boy') })
    simple_pro.add_behavior({ 'li.boy': func1 })
    simple_pro_other_scope.add_behavior({ 'li.boy': func2 });
    $$('li.boy').each(function(el){
      simple_pro.rule_has_been_applied(el, 'li.boy').should.be false
      simple_pro_other_scope.rule_has_been_applied(el, 'li.boy').should.be false
    })
    simple_pro.apply_rules(play_area);
    $$('li.boy').each(function(el){
      simple_pro.rule_has_been_applied(el, 'li.boy').should.be true
      simple_pro_other_scope.rule_has_been_applied(el, 'li.boy').should.be false
      el.hasClassName('ohyeah').should.be true
      el.hasClassName('ohyeah2').should.be false
    })
    $$('li.boy').each(function(el){ el.removeClassName('ohyeah') });
    simple_pro_other_scope.apply_rules(play_area);
    $$('li.boy').each(function(el){
      simple_pro.rule_has_been_applied(el, 'li.boy').should.be true
      simple_pro_other_scope.rule_has_been_applied(el, 'li.boy').should.be true
      el.hasClassName('ohyeah').should.be false
      el.hasClassName('ohyeah2').should.be true
    })
  end

  it "should apply rules to only element passed to apply rules"
    simple_pro.add_behavior({ 'li': function(el){ el.addClassName('only_here_in_fx_2') } })
    simple_pro.apply_rules($('fixture-2'))
   $$('#fixture-1 li').each(function(el){
     el.hasClassName('only_here_in_fx_2').should.be false
   })
   $$('#fixture-2 li').each(function(el){
     el.hasClassName('only_here_in_fx_2').should.be true
   })
  end

  it "should be able to add a rule"
    var func =  function(el) { };
    var func2 =  function(el) { };
    simple_pro.add_behavior({'li': func });
    simple_pro.rules['li'].should.be func
    simple_pro.add_behavior({'li.beach': func2 });
    simple_pro.rules['li.beach'].should.be func2
  end

  it "should be able to apply the rule to all elements"
    var class_name = 'hello'
    var func =  function(el) { el.addClassName(class_name) };
    simple_pro.add_behavior( {'li.sp_tester': func } );
    simple_pro.apply_rules();
    $$('li.sp_tester').each(function(el) {
      el.hasClassName("hello").should.be true
    })
    $$('li.sp_tester').first().hasClassName('hello').should.be true
    $$('li.sp_tester').last().hasClassName('hello').should.be true
  end

  it "should only apply the rule to any given element once"
    var class_name = 'hello'
    var func =  function(el) { el.addClassName(class_name) };
    simple_pro.add_behavior( {'li.sp_tester': func } );
    simple_pro.apply_rules();
    $$('li.sp_tester').each(function(el) {
      el.hasClassName("hello").should.be true
    })
    class_name = 'hello2'
    simple_pro.apply_rules()
    $$('li.sp_tester').each(function(el) {
      el.hasClassName("hello2").should.not.be true
    })
    home_element.insert('<li class="sp_tester"></li>');
    simple_pro.apply_rules()
    $$('li.sp_tester').first().hasClassName('hello2').should.be false
    $$('li.sp_tester').last().hasClassName('hello2').should.be true
  end

  it "should apply rules after ajax update"
    var class_name = 'hello'
    var func =  function(el) { el.addClassName(class_name) };
    simple_pro.add_behavior( {'li.sp_tester': func } );

    Ajax.Responders.dispatch('onComplete', this, "response");

    // I am waiting for the 'wait' function to work

    $$('li.sp_tester').each(function(el) {
//      el.hasClassName("hello").should.be true
    })

  end

end
