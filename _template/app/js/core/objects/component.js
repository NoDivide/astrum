export default class Component {
    constructor(group = '', name = '', type = '', options = {}) {

        // Construct with passed params or inherited params. The inherited params take priority.
        this.group = (this.group.length ? this.group : group);
        this.name = (this.name.length ? this.name : name);
        this.type = (this.type.length ? this.type : type);
        this.options = (this.options ? this.options : options);

        // Set placeholder params for readability / intellisense purposes
        this.title = '';
        this.html = '';
        this.width = 'full';
        this.description = '';
        this.options = {
            disable_code_sample: false,
            sample_always_show: false,
            sample_dark_background: false,
            sample_mobile_hidden: false
        };

        // A global flag that determines if this object is in a healthy, loaded state
        this.loaded = false; 

        // Run the main loader
        this.load(store);
    }

    load(store) {
        let self = this;
        let group = store.state.groups.filter(group => group.name === self.group);
        let item = null;

        if(group) {
            let key = '';

            switch(this.type) {
                case 'component':
                default:
                    key = 'components';
                    break;
            }

            item = group[key].filter(item => item.name === self.name);
        }

        if(item) {
            // FOR WHEN I RETURN
            // It's here where we want to load up the meat and taters of the component class. 
            // Specifically the properties that have been set as default above 

            this.loaded = true;
        }
    }
};