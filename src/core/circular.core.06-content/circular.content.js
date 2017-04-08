
/* ----------------------
	content
----------------------- */

new CircularModule('content',{

	config				: {
		addclass	: false
	},
	
	settings 			: {
		insertcss		: ['.cc-content-generated {  }']
	},

	attributes		: {
		'cc-content' : {
			in		: function(ccattr,ccnode,node) {
				if (ccattr.content.expression) {
					val = ccattr.content.result;
				} else {
					val = ccattr.content.value;
				}
				Circular.log.debug('@content','cc-content','setting content',val);
				node.textContent=val;
				if (Circular.content.config.addclass) {
					$(node).addClass('cc-content-generated');
				}
			},
			insert	: function(ccattr,ccnode,node) {
				Circular.log.debug('@content','attributes.cccontent.insert','ignore');
				/*var value = ccattr.content.value;	
				if (value.length>16) value = value.substring(0,16)+'(...)';
				if (node.getAttribute(ccattr.properties.name)!=value) {
					if (Circular.watchdog  && ccnode.flags.watched ) { // watched was commented ?
						Circular.watchdog.pass(node,'attrdomchanged',ccattr.properties.name);
					}
					node.setAttribute(ccattr.properties.name,value);
				}*/
			}			
		}
	}
	
		
});
