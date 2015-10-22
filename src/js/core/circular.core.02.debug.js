/* ----------------------
	debug
----------------------- */

new CircularModule({

	name			: 'debug',
	enabled		: false,
	requires	: ['log'],
	config		: {
		debugging	: false
	},
	
	init	: function() {
		if (Circular.config.debugging) {
			this.on();
		}
	},
	
	in	: function(attr,node,props) {
		this.write('mod.debug',node);
		attr.outer = this.enabled;
		// cant use parser.boolish yet
		if (!attr.original || attr.result) {
			this.on();
		} else {
			this.off();
		}
	},
	
	out	: function(attr,node,props) {
		if (!attr.outer) this.write('mod.debug - off');
		this.enabled=attr.outer;
		if (attr.outer) this.write('mod.debug - on');
	},
	
	toggle: function(on) 	{ 
		if (!on) this.write('mod.debug - off');
		this.enabled=on; 
		if (on) this.write('mod.debug - on');
	},
	on		: function() 		{ this.toggle(true); },
	off		: function() 		{ this.toggle(false); },
	
	write	: function() {
		if (this.enabled) Circular.log.write(arguments);
	}
	
	
});