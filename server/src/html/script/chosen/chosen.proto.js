// Generated by CoffeeScript 1.6.1
(function(){var e,t,n,r,i,s={}.hasOwnProperty,o=function(e,t){function r(){this.constructor=e}for(var n in t)s.call(t,n)&&(e[n]=t[n]);r.prototype=t.prototype;e.prototype=new r;e.__super__=t.prototype;return e};n=function(){function e(){this.options_index=0;this.parsed=[]}e.prototype.add_node=function(e){return e.nodeName.toUpperCase()==="OPTGROUP"?this.add_group(e):this.add_option(e)};e.prototype.add_group=function(e){var t,n,r,i,s,o;t=this.parsed.length;this.parsed.push({array_index:t,group:!0,label:e.label,children:0,disabled:e.disabled});s=e.childNodes;o=[];for(r=0,i=s.length;r<i;r++){n=s[r];o.push(this.add_option(n,t,e.disabled))}return o};e.prototype.add_option=function(e,t,n){if(e.nodeName.toUpperCase()==="OPTION"){if(e.text!==""){t!=null&&(this.parsed[t].children+=1);this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:e.value,text:e.text,html:e.innerHTML,selected:e.selected,disabled:n===!0?n:e.disabled,group_array_index:t,classes:e.className,style:e.style.cssText})}else this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0});return this.options_index+=1}};return e}();n.select_to_array=function(e){var t,r,i,s,o;r=new n;o=e.childNodes;for(i=0,s=o.length;i<s;i++){t=o[i];r.add_node(t)}return r.parsed};this.SelectParser=n;i=this;e=function(){function e(e,t){this.form_field=e;this.options=t!=null?t:{};this.is_multiple=this.form_field.multiple;this.set_default_values();this.setup();this.set_default_text();this.set_up_html();this.register_observers();this.finish_setup()}e.prototype.set_default_values=function(){var e=this;this.click_test_action=function(t){return e.test_active_click(t)};this.activate_action=function(t){return e.activate_field(t)};this.active_field=!1;this.mouse_on_container=!1;this.results_showing=!1;this.result_highlighted=null;this.result_single_selected=null;this.allow_single_deselect=this.options.allow_single_deselect!=null&&this.form_field.options[0]!=null&&this.form_field.options[0].text===""?this.options.allow_single_deselect:!1;this.disable_search_threshold=this.options.disable_search_threshold||0;this.disable_search=this.options.disable_search||!1;this.enable_split_word_search=this.options.enable_split_word_search!=null?this.options.enable_split_word_search:!0;this.search_contains=this.options.search_contains||!1;this.choices=0;this.single_backstroke_delete=this.options.single_backstroke_delete||!1;this.max_selected_options=this.options.max_selected_options||Infinity;this.allow_custom_value=this.options.allow_custom_value!=null?this.options.allow_custom_value:!1;this.inherit_select_classes=this.options.inherit_select_classes||!1;return!0};e.prototype.set_default_text=function(){var e;this.form_field.getAttribute("data-placeholder")?this.default_text=this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.default_text=this.options.placeholder_text_multiple||this.options.placeholder_text||"Select Some Options":this.allow_custom_value?this.default_text=this.options.placeholder_text_single||this.options.placeholder_text||"Type or Select an Option":this.default_text=this.options.placeholder_text_single||this.options.placeholder_text||"Select an Option";if(this.allow_custom_value){this.custom_group_text=this.form_field.getAttribute("data-custom_group_text")||this.options.custom_group_text||"Custom Value";e="Add custom value"}else e="No results match";return this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||e};e.prototype.mouse_enter=function(){return this.mouse_on_container=!0};e.prototype.mouse_leave=function(){return this.mouse_on_container=!1};e.prototype.input_focus=function(e){var t=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return t.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()};e.prototype.input_blur=function(e){var t=this;if(!this.mouse_on_container){this.active_field=!1;return setTimeout(function(){return t.blur_test()},100)}};e.prototype.result_add_option=function(e){var t,n;if(!e.disabled){e.dom_id=this.container_id+"_o_"+e.array_index;t=e.selected&&this.is_multiple?[]:["active-result"];e.selected&&t.push("result-selected");e.group_array_index!=null&&t.push("group-option");e.classes!==""&&t.push(e.classes);n=e.style.cssText!==""?' style="'+e.style+'"':"";return'<li id="'+e.dom_id+'" class="'+t.join(" ")+'"'+n+">"+e.html+"</li>"}return""};e.prototype.results_update_field=function(){this.set_default_text();this.is_multiple||this.results_reset_cleanup();this.result_clear_highlight();this.result_single_selected=null;return this.results_build()};e.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()};e.prototype.results_search=function(e){return this.results_showing?this.winnow_results():this.results_show()};e.prototype.keyup_checker=function(e){var t,n;t=(n=e.which)!=null?n:e.keyCode;this.search_field_scale();switch(t){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices>0)return this.keydown_backstroke();if(!this.pending_backstroke){this.result_clear_highlight();return this.results_search()}break;case 13:e.preventDefault();if(this.results_showing)return this.result_select(e);break;case 27:this.results_showing&&this.results_hide();return!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}};e.prototype.generate_field_id=function(){var e;e=this.generate_random_id();this.form_field.id=e;return e};e.prototype.generate_random_char=function(){var e,t,n;e="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";n=Math.floor(Math.random()*e.length);return t=e.substring(n,n+1)};return e}();i.AbstractChosen=e;i=this;t=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}o(t,e);t.prototype.setup=function(){this.current_value=this.form_field.value;return this.is_rtl=this.form_field.hasClassName("chzn-rtl")};t.prototype.finish_setup=function(){return this.form_field.addClassName("chzn-done")};t.prototype.set_default_values=function(){t.__super__.set_default_values.call(this);this.single_temp=new Template('<a href="javascript:void(0)" class="chzn-single chzn-default" tabindex="-1"><span>#{default}</span><div><b></b></div></a><div class="chzn-drop" style="left:-9000px;"><div class="chzn-search"><input type="text" autocomplete="off" /></div><ul class="chzn-results"></ul></div>');this.multi_temp=new Template('<ul class="chzn-choices"><li class="search-field"><input type="text" value="#{default}" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chzn-drop" style="left:-9000px;"><ul class="chzn-results"></ul></div>');this.choice_temp=new Template('<li class="search-choice" id="#{id}"><span>#{choice}</span><a href="javascript:void(0)" class="search-choice-close" rel="#{position}"></a></li>');this.choice_noclose_temp=new Template('<li class="search-choice search-choice-disabled" id="#{id}"><span>#{choice}</span></li>');return this.no_results_temp=new Template('<li class="no-results">'+this.results_none_found+' "<span>#{terms}</span>"</li>')};t.prototype.set_up_html=function(){var e,t,n,i,s,o;this.container_id=this.form_field.identify().replace(/[^\w]/g,"_")+"_chzn";t=["chzn-container"];t.push("chzn-container-"+(this.is_multiple?"multi":"single"));this.inherit_select_classes&&this.form_field.className&&t.push(this.form_field.className);this.is_rtl&&t.push("chzn-rtl");this.f_width=this.form_field.getStyle("width")?parseInt(this.form_field.getStyle("width"),10):this.form_field.getWidth();n={id:this.container_id,"class":t.join(" "),style:"width: "+this.f_width+"px",title:this.form_field.title};e=this.is_multiple?(new Element("div",n)).update(this.multi_temp.evaluate({"default":this.default_text})):(new Element("div",n)).update(this.single_temp.evaluate({"default":this.default_text}));this.form_field.hide().insert({after:e});this.container=$(this.container_id);this.dropdown=this.container.down("div.chzn-drop");i=this.container.getHeight();s=this.f_width-r(this.dropdown);this.dropdown.setStyle({width:s+"px",top:i+"px"});this.search_field=this.container.down("input");this.search_results=this.container.down("ul.chzn-results");this.search_field_scale();this.search_no_results=this.container.down("li.no-results");if(this.is_multiple){this.search_choices=this.container.down("ul.chzn-choices");this.search_container=this.container.down("li.search-field")}else{this.search_container=this.container.down("div.chzn-search");this.selected_item=this.container.down(".chzn-single");o=s-r(this.search_container)-r(this.search_field);this.search_field.setStyle({width:o+"px"})}this.results_build();this.set_tab_index();return this.form_field.fire("liszt:ready",{chosen:this})};t.prototype.register_observers=function(){var e=this;this.container.observe("mousedown",function(t){return e.container_mousedown(t)});this.container.observe("mouseup",function(t){return e.container_mouseup(t)});this.container.observe("mouseenter",function(t){return e.mouse_enter(t)});this.container.observe("mouseleave",function(t){return e.mouse_leave(t)});this.search_results.observe("mouseup",function(t){return e.search_results_mouseup(t)});this.search_results.observe("mouseover",function(t){return e.search_results_mouseover(t)});this.search_results.observe("mouseout",function(t){return e.search_results_mouseout(t)});this.form_field.observe("liszt:updated",function(t){return e.results_update_field(t)});this.form_field.observe("liszt:activate",function(t){return e.activate_field(t)});this.form_field.observe("liszt:open",function(t){return e.container_mousedown(t)});this.search_field.observe("blur",function(t){return e.input_blur(t)});this.search_field.observe("keyup",function(t){return e.keyup_checker(t)});this.search_field.observe("keydown",function(t){return e.keydown_checker(t)});this.search_field.observe("focus",function(t){return e.input_focus(t)});return this.is_multiple?this.search_choices.observe("click",function(t){return e.choices_click(t)}):this.container.observe("click",function(e){return e.preventDefault()})};t.prototype.search_field_disabled=function(){this.is_disabled=this.form_field.disabled;if(this.is_disabled){this.container.addClassName("chzn-disabled");this.search_field.disabled=!0;this.is_multiple||this.selected_item.stopObserving("focus",this.activate_action);return this.close_field()}this.container.removeClassName("chzn-disabled");this.search_field.disabled=!1;if(!this.is_multiple)return this.selected_item.observe("focus",this.activate_action)};t.prototype.container_mousedown=function(e){var t;if(!this.is_disabled){t=e!=null?e.target.hasClassName("search-choice-close"):!1;e&&e.type==="mousedown"&&!this.results_showing&&e.stop();if(!this.pending_destroy_click&&!t){if(!this.active_field){this.is_multiple&&this.search_field.clear();document.observe("click",this.click_test_action);this.results_show()}else!this.is_multiple&&e&&(e.target===this.selected_item||e.target.up("a.chzn-single"))&&this.results_toggle();return this.activate_field()}return this.pending_destroy_click=!1}};t.prototype.container_mouseup=function(e){if(e.target.nodeName==="ABBR"&&!this.is_disabled)return this.results_reset(e)};t.prototype.blur_test=function(e){if(!this.active_field&&this.container.hasClassName("chzn-container-active"))return this.close_field()};t.prototype.close_field=function(){document.stopObserving("click",this.click_test_action);this.active_field=!1;this.results_hide();this.container.removeClassName("chzn-container-active");this.winnow_results_clear();this.clear_backstroke();this.show_search_field_default();return this.search_field_scale()};t.prototype.activate_field=function(){this.container.addClassName("chzn-container-active");this.active_field=!0;this.search_field.value=this.search_field.value;return this.search_field.focus()};t.prototype.test_active_click=function(e){return e.target.up("#"+this.container_id)?this.active_field=!0:this.close_field()};t.prototype.results_build=function(){var e,t,n,r,s;this.parsing=!0;this.results_data=i.SelectParser.select_to_array(this.form_field);if(this.is_multiple&&this.choices>0){this.search_choices.select("li.search-choice").invoke("remove");this.choices=0}else if(!this.is_multiple){this.selected_item.addClassName("chzn-default").down("span").update(this.default_text);this.disable_search||this.form_field.options.length<=this.disable_search_threshold?this.container.addClassName("chzn-container-single-nosearch"):this.container.removeClassName("chzn-container-single-nosearch")}e="";s=this.results_data;for(n=0,r=s.length;n<r;n++){t=s[n];if(t.group)e+=this.result_add_group(t);else if(!t.empty){e+=this.result_add_option(t);if(t.selected&&this.is_multiple)this.choice_build(t);else if(t.selected&&!this.is_multiple){this.selected_item.removeClassName("chzn-default").down("span").update(t.html);this.allow_single_deselect&&this.single_deselect_control_build()}}}this.search_field_disabled();this.show_search_field_default();this.search_field_scale();this.search_results.update(e);return this.parsing=!1};t.prototype.result_add_group=function(e){if(!e.disabled){e.dom_id=this.container_id+"_g_"+e.array_index;return'<li id="'+e.dom_id+'" class="group-result">'+e.label.escapeHTML()+"</li>"}return""};t.prototype.result_do_highlight=function(e){var t,n,r,i,s;this.result_clear_highlight();this.result_highlight=e;this.result_highlight.addClassName("highlighted");r=parseInt(this.search_results.getStyle("maxHeight"),10);s=this.search_results.scrollTop;i=r+s;n=this.result_highlight.positionedOffset().top;t=n+this.result_highlight.getHeight();if(t>=i)return this.search_results.scrollTop=t-r>0?t-r:0;if(n<s)return this.search_results.scrollTop=n};t.prototype.result_clear_highlight=function(){this.result_highlight&&this.result_highlight.removeClassName("highlighted");return this.result_highlight=null};t.prototype.results_show=function(){var e;if(!this.is_multiple){this.selected_item.addClassName("chzn-single-with-drop");this.result_single_selected&&this.result_do_highlight(this.result_single_selected)}else if(this.max_selected_options<=this.choices){this.form_field.fire("liszt:maxselected",{chosen:this});return!1}e=this.is_multiple?this.container.getHeight():this.container.getHeight()-1;this.form_field.fire("liszt:showing_dropdown",{chosen:this});this.dropdown.setStyle({top:e+"px",left:0});this.results_showing=!0;this.search_field.focus();this.search_field.value=this.search_field.value;return this.winnow_results()};t.prototype.results_hide=function(){this.is_multiple||this.selected_item.removeClassName("chzn-single-with-drop");this.result_clear_highlight();this.form_field.fire("liszt:hiding_dropdown",{chosen:this});this.dropdown.setStyle({left:"-9000px"});return this.results_showing=!1};t.prototype.set_tab_index=function(e){var t;if(this.form_field.tabIndex){t=this.form_field.tabIndex;this.form_field.tabIndex=-1;return this.search_field.tabIndex=t}};t.prototype.show_search_field_default=function(){if(this.is_multiple&&this.choices<1&&!this.active_field){this.search_field.value=this.default_text;return this.search_field.addClassName("default")}this.search_field.value="";return this.search_field.removeClassName("default")};t.prototype.search_results_mouseup=function(e){var t;t=e.target.hasClassName("active-result")?e.target:e.target.up(".active-result");if(t){this.result_highlight=t;this.result_select(e);return this.search_field.focus()}};t.prototype.search_results_mouseover=function(e){var t;t=e.target.hasClassName("active-result")?e.target:e.target.up(".active-result");if(t)return this.result_do_highlight(t)};t.prototype.search_results_mouseout=function(e){if(e.target.hasClassName("active-result")||e.target.up(".active-result"))return this.result_clear_highlight()};t.prototype.choices_click=function(e){e.preventDefault();if(this.active_field&&!e.target.hasClassName("search-choice")&&!e.target.up(".search-choice")&&!this.results_showing)return this.results_show()};t.prototype.choice_build=function(e){var t,n,r=this;if(this.is_multiple&&this.max_selected_options<=this.choices){this.form_field.fire("liszt:maxselected",{chosen:this});return!1}t=this.container_id+"_c_"+e.array_index;this.choices+=1;this.search_container.insert({before:(e.disabled?this.choice_noclose_temp:this.choice_temp).evaluate({id:t,choice:e.html,position:e.array_index})});if(!e.disabled){n=$(t).down("a");return n.observe("click",function(e){return r.choice_destroy_link_click(e)})}};t.prototype.choice_destroy_link_click=function(e){e.preventDefault();if(!this.is_disabled){this.pending_destroy_click=!0;return this.choice_destroy(e.target)}};t.prototype.choice_destroy=function(e){if(this.result_deselect(e.readAttribute("rel"))){this.choices-=1;this.show_search_field_default();this.is_multiple&&this.choices>0&&this.search_field.value.length<1&&this.results_hide();e.up("li").remove();return this.search_field_scale()}};t.prototype.results_reset=function(){this.form_field.options[0].selected=!0;this.selected_item.down("span").update(this.default_text);this.is_multiple||this.selected_item.addClassName("chzn-default");this.show_search_field_default();this.results_reset_cleanup();typeof Event.simulate=="function"&&this.form_field.simulate("change");if(this.active_field)return this.results_hide()};t.prototype.results_reset_cleanup=function(){var e;this.current_value=this.form_field.value;e=this.selected_item.down("abbr");if(e)return e.remove()};t.prototype.result_select=function(e){var t,n,r;if(this.result_highlight){t=this.result_highlight;this.result_clear_highlight();if(this.is_multiple)this.result_deactivate(t);else{this.search_results.descendants(".result-selected").invoke("removeClassName","result-selected");this.selected_item.removeClassName("chzn-default");this.result_single_selected=t}t.addClassName("result-selected");r=t.id.substr(t.id.lastIndexOf("_")+1);n=this.results_data[r];n.selected=!0;this.form_field.options[n.options_index].selected=!0;if(this.is_multiple)this.choice_build(n);else{this.selected_item.down("span").update(n.html);this.allow_single_deselect&&this.single_deselect_control_build()}(!e.metaKey&&!e.ctrlKey||!this.is_multiple)&&this.results_hide();this.search_field.value="";typeof Event.simulate=="function"&&(this.is_multiple||this.form_field.value!==this.current_value)&&this.form_field.simulate("change");this.current_value=this.form_field.value;return this.search_field_scale()}};t.prototype.result_activate=function(e){return e.addClassName("active-result")};t.prototype.result_deactivate=function(e){return e.removeClassName("active-result")};t.prototype.result_deselect=function(e){var t,n;n=this.results_data[e];if(!this.form_field.options[n.options_index].disabled){n.selected=!1;this.form_field.options[n.options_index].selected=!1;t=$(this.container_id+"_o_"+e);t.removeClassName("result-selected").addClassName("active-result").show();this.result_clear_highlight();this.winnow_results();typeof Event.simulate=="function"&&this.form_field.simulate("change");this.search_field_scale();return!0}return!1};t.prototype.single_deselect_control_build=function(){if(this.allow_single_deselect&&!this.selected_item.down("abbr"))return this.selected_item.down("span").insert({after:'<abbr class="search-choice-close"></abbr>'})};t.prototype.winnow_results=function(){var e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m;this.no_results_clear();u=0;a=this.search_field.value===this.default_text?"":this.search_field.value.strip().escapeHTML();s=this.search_contains?"":"^";i=new RegExp(s+a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i");c=new RegExp(a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i");m=this.results_data;for(h=0,d=m.length;h<d;h++){t=m[h];if(!t.disabled&&!t.empty)if(t.group)$(t.dom_id).hide();else if(!this.is_multiple||!t.selected){e=!1;o=t.dom_id;if(i.test(t.html)){e=!0;u+=1}else if(this.enable_split_word_search&&(t.html.indexOf(" ")>=0||t.html.indexOf("[")===0)){r=t.html.replace(/\[|\]/g,"").split(" ");if(r.length)for(p=0,v=r.length;p<v;p++){n=r[p];if(i.test(n)){e=!0;u+=1}}}if(e){if(a.length){f=t.html.search(c);l=t.html.substr(0,f+a.length)+"</em>"+t.html.substr(f+a.length);l=l.substr(0,f)+"<em>"+l.substr(f)}else l=t.html;$(o).innerHTML!==l&&$(o).update(l);this.result_activate($(o));t.group_array_index!=null&&$(this.results_data[t.group_array_index].dom_id).setStyle({display:"list-item"})}else{$(o)===this.result_highlight&&this.result_clear_highlight();this.result_deactivate($(o))}}}return u<1&&a.length?this.no_results(a):this.winnow_results_set_highlight()};t.prototype.winnow_results_clear=function(){var e,t,n,r,i;this.search_field.clear();t=this.search_results.select("li");i=[];for(n=0,r=t.length;n<r;n++){e=t[n];e.hasClassName("group-result")?i.push(e.show()):!this.is_multiple||!e.hasClassName("result-selected")?i.push(this.result_activate(e)):i.push(void 0)}return i};t.prototype.winnow_results_set_highlight=function(){var e;if(!this.result_highlight){this.is_multiple||(e=this.search_results.down(".result-selected.active-result"));e==null&&(e=this.search_results.down(".active-result"));if(e!=null)return this.result_do_highlight(e)}};t.prototype.no_results=function(e){return this.search_results.insert(this.no_results_temp.evaluate({terms:e}))};t.prototype.no_results_clear=function(){var e,t;e=null;t=[];while(e=this.search_results.down(".no-results"))t.push(e.remove());return t};t.prototype.keydown_arrow=function(){var e,t,n;e=this.search_results.select("li.active-result");if(e.length){if(!this.result_highlight)this.result_do_highlight(e.first());else if(this.results_showing){n=this.result_highlight.nextSiblings();t=n.intersect(e);t.length&&this.result_do_highlight(t.first())}if(!this.results_showing)return this.results_show()}};t.prototype.keyup_arrow=function(){var e,t,n;if(!this.results_showing&&!this.is_multiple)return this.results_show();if(this.result_highlight){n=this.result_highlight.previousSiblings();e=this.search_results.select("li.active-result");t=n.intersect(e);if(t.length)return this.result_do_highlight(t.first());this.choices>0&&this.results_hide();return this.result_clear_highlight()}};t.prototype.keydown_backstroke=function(){var e;if(this.pending_backstroke){this.choice_destroy(this.pending_backstroke.down("a"));return this.clear_backstroke()}e=this.search_container.siblings().last();if(e&&e.hasClassName("search-choice")&&!e.hasClassName("search-choice-disabled")){this.pending_backstroke=e;this.pending_backstroke&&this.pending_backstroke.addClassName("search-choice-focus");return this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClassName("search-choice-focus")}};t.prototype.clear_backstroke=function(){this.pending_backstroke&&this.pending_backstroke.removeClassName("search-choice-focus");return this.pending_backstroke=null};t.prototype.keydown_checker=function(e){var t,n;t=(n=e.which)!=null?n:e.keyCode;this.search_field_scale();t!==8&&this.pending_backstroke&&this.clear_backstroke();switch(t){case 8:this.backstroke_length=this.search_field.value.length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(e);this.mouse_on_container=!1;break;case 13:e.preventDefault();break;case 38:e.preventDefault();this.keyup_arrow();break;case 40:this.keydown_arrow()}};t.prototype.search_field_scale=function(){var e,t,n,r,i,s,o,u,a;if(this.is_multiple){n=0;o=0;i="position:absolute; left: -1000px; top: -1000px; display:none;";s=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"];for(u=0,a=s.length;u<a;u++){r=s[u];i+=r+":"+this.search_field.getStyle(r)+";"}t=(new Element("div",{style:i})).update(this.search_field.value.escapeHTML());document.body.appendChild(t);o=Element.measure(t,"width")+25;t.remove();o>this.f_width-10&&(o=this.f_width-10);this.search_field.setStyle({width:o+"px"});e=this.container.getHeight();return this.dropdown.setStyle({top:e+"px"})}};return t}(e);i.Chosen=t;Prototype.Browser.IE&&/MSIE (\d+\.\d+);/.test(navigator.userAgent)&&(Prototype.BrowserFeatures.Version=new Number(RegExp.$1));r=function(e){var t,n;t=new Element.Layout(e);return n=t.get("border-left")+t.get("border-right")+t.get("padding-left")+t.get("padding-right")};i.get_side_border_padding=r}).call(this);