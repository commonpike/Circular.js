/* ----------------------
	registry
----------------------- */

new CircularModule({

	name		: 'registry',
	requires	: ['log','debug'],
	counter	: 0,
	
	newProperties 	: function() {
		return {
			'flags'	: {
				'registered'				: false,
				'watched'						: false,
				'domobserved'				: false,
				'dataobserved'			: false,
				'processing'				: false,
				'processedin'				: false,
				'processedout'			: false,
				'attrsetchanged'		: true,
				'contentchanged'		: true,
				'contentchanged:p'	: 0,
				'contentchanged:i'	: false,
				'contentchanged'		: true,
				'contextchanged'		: true,
				'attrdomchanged'		: true,
				'attrdatachanged'		: true
			},
			'outercontext'	: '',
			'innercontext'	: '',
			'attributes'		: [],		// todo: reverse naming
			'name2attr'			: {}		// todo: reverse naming
		};
	} ,
	
	newAttribute 	: function(name) {
		return {
			'name'				: name,
			'module'			: '',
			'original'		: '',
			'expression'	: '',
			'result'			: undefined,
			'value'				: '',
			'oldpaths'		: [],
			'paths'				: [],		
			'flags'			: {
				'parsed'						: false,
				'registered'				: false,
				'attrdomchanged'		: true,
				'attrdomchanged:p'	: 0,
				'attrdomchanged:i'	: false,
				'attrdatachanged'		: true,
				'attrdatachanged:p'	: 0,
				'attrdatachanged:i'	: false,
				'breaking'					: false
			}
		}
	} ,

	setAttribute(node,attrname,value,cycle) {
		if (!cycle) {
			Circular.queue(function() {
				Circular.registry.setAttribute(node,attrname,value,true);
				return;
			});
		}
		Circular.debug.write('@registry.setAttribute',attrname);
		var $node = $(node);
		if (node instanceof jQuery) node = $node.get(0);
		
		var props = this.get(node);
		if (!props.outercontext) {
			props.outercontext = Circular.engine.getContext(node);
			Circular.debug.write('@registry.setAttribute','context:',props.outercontext);
		}
		
		// this would usually be enough:
		/*
			// save and watch
			this.set(node,props,true);
	
			// wake up the dogs
			node.setAttribute(attrname,value);
		*/
		
		// but we will be more elaborate:
		// we'll set the original prop of the attribute,
		// not register it, wake up the dogs. this makes it 
		// possible to set things in the attribute which
		// may not fit in there for dom reasons
		if (!props.flags.watched) {
				Circular.watchdog.watch(node,props);
		}
		if (!props.name2attr[attrname]) {
			var attr = this.newAttribute(attrname);
			attr.original = value;
			props.attributes.push(attr);
		} else {
			props.name2attr[attrname].original=value;
		}
		
		// dont register that, fake store it
		$node.data('cc-properties',props);
		
		
		// wake up the dogs
		node.setAttribute(attrname,'{|@registry.pending|}');
		
		//Circular.watchdog.catch(node,'event','attrsetchanged');
		//Circular.watchdog.catch(node,'event','attrdatachanged',attrname);
		
	},
	
	lock	: function(node) {
		var props = this.get(node,true);
		props.flags.locked=true;
		this.set(node,props);
	},
	
	unlock	: function(node) {
		props = $(node).data('cc-properties');
		props.flags.locked=false;
		$(node).data('cc-properties',props);
	},
	
	set	: function(node,props,watch) {
		Circular.debug.write('@registry.set');
		if (!props.flags.registered) {
			props.flags.registered = true;
			this.counter++;
		}
		for (var ac=0;ac<props.attributes.length;ac++) {
			props.attributes[ac].flags.registered=true;
		}
		if (watch) {
			Circular.debug.write('@registry.set','watch',node);
			Circular.watchdog.watch(node,props);
		}
		$(node).data('cc-properties',props);
	},
	
	get	: function(node,force) {
		// Circular.debug.write('Circular.registry.get');
		// this should perhaps return a deep copy instead ..
		var props = $(node).data('cc-properties');
		if (!props) props = this.newProperties();
		if (!props.flags.locked || force) {
			return props;
		} else {
			Circular.log.error('@registry.get','Node is locked',node);
		}
	}
	
	
	
});