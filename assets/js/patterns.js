/**
 * Component component
 */
var ndplComponent = Vue.extend({

    props: {
        component: {
            required: true
        }
    },

    computed: {
        toggleCode: function() {
            // If code_show was set to true on page load set it to false
            if(this.component.code_show && this.$root.window_outer_width >= this.$root.breakpoint) {
                this.component.code_show = false;
            }

            return this.component.code_show || this.$root.window_outer_width >= this.$root.breakpoint;
        }
    },

    watch: {
        'component.html': function() {
            if(this.component.html.length) {
                var block = this.$el.querySelector('pre code');

                hljs.highlightBlock(block);
            }
        }
    },

    ready: function() {
        var _this = this;

        window.addEventListener('scroll', _this.updateActive);
        window.addEventListener('resize', _this.updateActive);

        // Show code on desktop resolutions
        if(_this.$root.window_outer_width >= _this.$root.breakpoint) {
            _this.component.code_show = true;
        }
    },

    methods: {

        /**
         * Update component active in navigation
         */
        updateActive: function() {
            var _this = this;

            if(_this.$root.scroll_position >= _this.$el.offsetTop - 80 &&
                _this.$root.scroll_position < _this.$el.offsetTop + _this.$el.offsetHeight) {
                if(!_this.$root.scrolling_to) {
                    _this.$root.active_component = _this.component;
                    _this.$root.open_group = null;
                    _this.$root.updateHash(_this.component.id);
                }
            }
        }
    }
});
Vue.component('ndpl-component', ndplComponent);

/**
 * Group component
 */
var ndplGroup = Vue.extend({

    props: {
        group: {
            required: true
        }
    },

    ready: function() {
        var _this = this;

        window.addEventListener('scroll', _this.updateActive);
        window.addEventListener('resize', _this.updateActive);
    },

    methods: {

        /**
         * Update group active state in navigation
         */
        updateActive: function() {
            var _this = this;

            if(_this.$root.scroll_position >= _this.$el.offsetTop &&
                _this.$root.scroll_position < _this.$el.offsetTop + _this.$el.offsetHeight) {
                if(!_this.$root.scrolling_to) {
                    if(_this.$root.active_component.group != _this.group.name) {
                        _this.$root.active_component = _this.group.components[0];
                        _this.$root.open_group = null;
                        _this.$root.updateHash(_this.group.components[0].id);
                    }
                }
            }
        }
    }
});
Vue.component('ndpl-group', ndplGroup);

/**
 * Script component
 */
var ndplScript = Vue.extend({

    props: {
        script: {
            required: true
        }
    },

    methods: {

        /**
         * Loads TypeKit.
         */
        loadTypekit: function() {
            var _this = this;

            try {
                Typekit.load({
                    async: true
                });
            } catch(e) {};
        }
    }
});
Vue.component('ndpl-script', ndplScript);

/**
 * Vue instance
 */
new Vue({
    el: 'html',

    data: {
        intro: null,
        project_name: null,
        project_url: null,
        copyright_start_year: null,
        client_name: null,
        client_url: null,
        creators: {},
        groups: {},
        components: {},
        theme: {
            brand_color: '#FEA1AC',
            background_color: '#F4F4F4',
            inverted_text: true,
            code_highlight_theme: 'solarized-dark'
        },
        assets: {
            css: [],
            js: []
        },
        font_libraries: {
            typekit_code: null,
            google_web_fonts: null,
            typography_web_fonts: null
        },
        error_log: [],
        components_loaded_count: 0,
        loaded: false,
        resizing: false,
        typekit_loaded: false,
        errored: false,
        scroll_position: 0,
        active_component: {
            group_id: '',
            id: ''
        },
        open_group: null,
        scrolling_to: false,
        window_outer_width: 0,
        breakpoint: 960,
        mobile_view: false,
        open_nav: false,
        rtime: new Date(1, 1, 2000, 12,00,00),
        timeout: false,
        delta: 200
    },

    computed: {
        copyright_year: function() {
            var date = new Date();

            if(date.getFullYear() == this.copyright_start_year) {
                return this.copyright_start_year;
            }

            return this.copyright_start_year + ' - ' + date.getFullYear();
        },

        allCreators: function() {
            var formattedCreators = '';

            for(var i = 0; i < this.creators.length; i++) {
                prefix = i === this.creators.length - 1 ? ' & ' : ', ';
                url = this.creators[i].url;
                name = this.creators[i].name.replace(' ', '&nbsp;');

                formattedCreators += prefix + '<a href="' + url + '" target="_blank" >' + name + '</a>';
            }

            return formattedCreators.substring(2);
        }
    },

    ready: function() {
        var _this = this;

        _this.loadDataFile();

        _this.window_outer_width = window.outerWidth;

        _this.mobile_view = _this.window_outer_width >= _this.breakpoint ? false : true;

        window.addEventListener('scroll', _this.setScrollPosition);
        window.addEventListener('resize', function() {
            _this.window_outer_width = window.outerWidth;
            _this.setScrollPosition();

            _this.mobile_view = _this.window_outer_width >= _this.breakpoint ? false : true;

            _this.rtime = new Date();

            if (_this.timeout === false) {
                _this.timeout = true;
                setTimeout(_this.resizeFadeToggle, _this.delta);
            }
        });
    },

    methods: {

        /**
         * Reads the patterns.json file.
         */
        loadDataFile: function () {
            var _this = this;

            _this.$http.get('/patterns.json').then(function (response) {

                _this.initData(response.data);

                _this.loadIntro();
                _this.setupGroups();
            });
        },

        /**
         * Initilise data bindings.
         *
         * @param data
         */
        initData: function(data) {
            var _this = this;

            for(var key in data) {
                _this.$set(key, data[key]);
            }
        },

        /**
         * Update URL hash.
         *
         * @param hash
         */
        updateHash: function(hash) {
            history.pushState ? history.pushState(null, null, '#' + hash) : location.hash = hash;
        },

        /**
         * Load intro Markdown.
         */
        loadIntro: function() {
            var _this = this;

            _this.$http.get('/templates/intro.md').then(function(response) {
                _this.$set('intro', marked(response.data));
            }, function() {
                _this.logError('Failed to load <strong>intro</strong> template from <code>/templates/intro.md</code>. Is it missing?');
            });
        },

        /**
         * Setup component groups.
         */
        setupGroups: function() {
            var _this = this;

            // Loop through the groups
            for (var i = 0; i < _this.groups.length; i++) {
                var group = _this.groups[i];

                // Set group navigation navigation
                var groupId = 'group-' + group.name;
                _this.$set('groups[' + i + '].id', groupId);
                _this.$set('groups[' + i + '].active', false);

                // Set group components array
                _this.$set('groups[' + i + '].components', []);

                // Add group components to group
                for (var j = 0; j < _this.components.length; j++) {
                    if (_this.components[j].group === group.name) {

                        // Set component navigation variables
                        _this.$set('components[' + j + '].id', 'component-' + _this.components[j].name);
                        _this.$set('components[' + j + '].group_id', groupId);
                        _this.$set('components[' + j + '].active', false);
                        _this.$set('components[' + j + '].code_show', false);

                        // Add html and description properties to the component object.
                        _this.$set('components[' + j + '].html', '');
                        _this.$set('components[' + j + '].description', '');

                        group.components.push(_this.components[j]);

                        _this.loadComponent(_this.components[j]);
                    }
                }
            }
        },

        /**
         * Load component files.
         *
         * @param component
         */
        loadComponent: function(component) {
            var _this = this,
                component_path = 'components/' + component.group + '/' + component.name;

            // Get and set component markup
            _this.$http.get(component_path + '/markup.html').then(function (response) {
                component.html = response.data;
                _this.areComponentsLoaded();
            }, function () {
                _this.logError('HTML file for <strong>' + component.name + '</strong> component failed to load from <code>/' + component_path + '/html.md</code>');
            });

            // Get and set component description
            _this.$http.get(component_path + '/description.md').then(function (response) {
                component.description = marked(response.data);
                _this.areComponentsLoaded();
            }, function () {
                _this.logError('Description file for <strong>' + component.name + '</strong> component failed to load from <code>/' + component_path + '/description.md</code>');
            });
        },

        /**
         * Increment components loaded.
         */
        areComponentsLoaded: function() {
            var _this = this;

            _this.components_loaded_count += 1;

            if (_this.components_loaded_count === _this.components.length * 2) {

                setTimeout(function() {
                    _this.loaded = true;
                }, 2000);
            }
        },

        /**
         * Log errors.
         *
         * @param error_message
         * @param data
         * @param error_type
         */
        logError: function(error_message, data, error_type) {
            var _this = this;

            error_type = typeof error_type !== 'undefined' ? error_type : 'error';
            data = typeof data !== 'undefined' ? data : null;

            _this.error_log.push(error_message);
            console[error_type]('[Pattern Library warn]: ' + error_message);

            if(data) {
                console[error_type](data);
            }

            _this.errored = true;
        },

        /**
         * Set scroll position
         */
        setScrollPosition: function() {
            var _this = this,
                doc = document.documentElement,
                top = doc && doc.scrollTop || document.body.scrollTop;

            _this.scroll_position = top;
        },

        /**
         * Scroll to element
         *
         * @param e
         */
        scrollTo: function(e) {
            var _this = this,
                offset = _this.mobile_view ? 52 : 124;

            _this.scrolling_to = true;

            smoothScroll.animateScroll(e.target.hash, null, {
                offset: offset,
                callback: function() {
                    _this.scrolling_to = false;
                    _this.open_nav = false;
                }
            });
        },

        /**
         * Toggle navigation
         */
        toggleNav: function() {
            var _this = this;

            _this.open_nav = ! _this.open_nav;
        },

        toggleOpenGroups: function(group) {
            var _this = this;

            _this.open_group = _this.open_group == group.id ? null : group.id;
        },

        resizeFadeToggle: function() {
            var _this = this;

            _this.resizing = true;

            if (new Date() - _this.rtime < _this.delta) {
                setTimeout(_this.resizeFadeToggle, _this.delta);
            } else {
                _this.timeout = false;

                setTimeout(function() {
                    _this.resizing = false;
                }, 1000);
            }
        }
    }
});