const Vue = require('vue/dist/vue');
const hljs = require('highlightjs');
const marked = require('marked');
const smoothScroll = require('smooth-scroll');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');

Vue.use(require('vue-resource'));


/**
 * Component component
 */
var ndplComponent = Vue.extend({

    data: function() {
        return {
            loaded: false,
            hide_sample_code: false
        }
    },

    props: {
        component: {
            required: true
        }
    },

    computed: {
        inline_styles: function() {
            var _this = this,
                styles = '';

            // These inline style are only applied after the component has fully loaded
            if(_this.components_loaded) {
                if(_this.component.options.sample_min_height) {
                    styles += 'min-height:' + _this.component.options.sample_min_height + 'px;';
                }
            }

            if(_this.component.options.sample_overflow_hidden) {
                styles += 'overflow: hidden;';
            }
            if(_this.component.options.sample_background_color) {
                styles += 'background-color:' + _this.component.options.sample_background_color + ' !important;';
            }

            return styles;
        }
    },

    watch: {
        'component.html': function() {
            var _this = this;

            // Apply syntax highlighting when component html is loaded
            if(this.component.html.length) {
                _this.$root.applySyntaxHighlighting(_this.$el);
            }
        }
    },

    mounted: function() {
        var _this = this;

        // Listen for loaded event
        Astrum.$on('components_loaded', function() {

            // Monitor scroll and resize events and update navigation active state appropirately
            window.addEventListener('scroll', _this.updateActive);
            window.addEventListener('resize', _this.updateActive);

            _this.setHideSample(function() {
                _this.components_loaded = true;
            });
        });

        // Listen for resizing event
        Astrum.$on('resizing', function(is_resizing) {
            _this.components_loaded = false;

            if(! is_resizing) {
                _this.setHideSample(function() {
                    _this.components_loaded = true;
                });
            }
        });

        if (_this.component.html) {
            _this.$root.applySyntaxHighlighting(_this.$el);
        }
    },

    methods: {

        /**
         * Update component active in navigation.
         */
        updateActive: function() {
            var _this = this;
            
            // If scroll position is great than or equal to component offset top - 60 pixels
            // and scroll position is less than component offset top plus component height plus 60 pixels
            // and active component is not this component
            if(_this.$root && _this.$root.scroll_position >= _this.$el.offsetTop - 60 &&
                _this.$root.scroll_position < _this.$el.offsetTop + _this.$el.offsetHeight) {
                
                // If not currently auto scrolling to component
                // and component is not active
                if(!_this.$root.scrolling_to &&
                    !_this.isActive(_this.component)) {

                    // Set this component to active
                    _this.$root.active_components.push(_this.component);
                    _this.$root.open_group = null;
                    _this.$root.updateHash(_this.component.id);
                }
            } else {

                // If not currently auto scrolling to component
                if(_this.$root && !_this.$root.scrolling_to) {

                    // Loop through active components and remove this component
                    for (var i = 0; i < _this.$root.active_components.length; i++) {
                        var component = _this.$root.active_components[i];

                        if (component.id === _this.component.id) {
                            _this.$root.active_components.splice(i, 1);

                            return;
                        }
                    }
                }
            }
        },

        /**
         * Is component active in navigation.
         *
         * @param component
         * @returns {boolean}
         */
        isActive: function(component) {
            var _this = this;

            for (var i = 0; i < _this.$root.active_components.length; i++) {
                var c = _this.$root.active_components[i];

                if (component.id === c.id) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Should invert text based on hex brightness.
         *
         * @param hex
         * @returns {boolean}
         */
        shouldInvertText: function(hex) {
            var rgb = this.$root.convertHexToRgb(hex),
                brightness = this.$root.getColorBrightness(rgb);

            return brightness > 210;
        },

        /**
         * Should apply border based on hex brightness.
         *
         * @param hex
         * @returns {boolean}
         */
        shouldApplyBorder: function(hex) {
            var rgb = this.$root.convertHexToRgb(hex),
                brightness = this.$root.getColorBrightness(rgb);

            return brightness > 240;
        },

        /**
         * Set component sample element to be hidden if the sample
         * itself is hidden in the assets CSS stylesheet.
         *
         * @param callback
         */
        setHideSample: function(callback) {
            callback = typeof callback !== 'undefined' ?  callback : function() {};

            var _this = this;

            _this.hide_sample_code = false;

            setTimeout(function() {
                if(_this.$el.querySelector('.ndpl-component__code')) {

                    /**
                     * Auto-detect hidden sample.
                     */
                    if (_this.$el.querySelector('.ndpl-component__sample').offsetHeight <= 74 &&
                        !_this.component.options.disabled_auto_sample_hiding) {
                        _this.hide_sample_code = true;
                    }

                    /**
                     * If manually specifying when to show nad hide samples.
                     */
                    if (_this.component.options.disabled_auto_sample_hiding &&
                        _this.component.options.disabled_auto_sample_hiding.hasOwnProperty('show_on_mobile') &&
                        _this.component.options.disabled_auto_sample_hiding.hasOwnProperty('show_on_desktop')) {


                        if(_this.$root.mobile_view) {
                            _this.hide_sample_code = !_this.component.options.disabled_auto_sample_hiding.show_on_mobile;
                        } else {
                            _this.hide_sample_code = !_this.component.options.disabled_auto_sample_hiding.show_on_desktop;
                        }
                    }
                }

                callback();
            }, 0);
        },

        /**
         * Is sample code visible.
         *
         * @returns {boolean}
         */
        isCodeVisible: function() {
            var _this = this;

            return ! _this.hide_sample_code;
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
    }
});
Vue.component('ndpl-group', ndplGroup);

/**
 * Vue instance
 */
var Astrum = new Vue({
    el: '[data-app=astrum]',

    data: {
        intro: null,
        project_logo: null,
        project_favicon: null,
        project_name: null,
        project_url: null,
        copyright_start_year: null,
        client_name: null,
        client_url: null,
        creators: {},
        content: {},
        groups: {},
        theme: {
            border_color: null,
            highlight_color: null,
            brand_color: null,
            background_color: null,
            code_highlight_theme: null,
            override_code_highlight_bg: null,
            sample_dark_background: null,
            show_project_name: null,
            show_version: null,
            max_width: null,
            titles: {
                library_title: null,
                pages_title: null,
                components_title: null
            }
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
        log: {
            error: [],
            info: []
        },
        components_count: 0,
        groups_count: 0,
        stylesheets_count: 0,
        components_loaded_count: 0,
        groups_loaded_count: 0,
        stylesheets_loaded_count: 0,
        groups_loaded: false,
        components_loaded: false,
        stylesheets_loaded: false,
        styles: null,
        resizing: false,
        typekit_loaded: false,
        scroll_position: 0,
        prev_scroll_position: 0,
        active_group: null,
        active_components: [],
        active_page: null,
        open_group: null,
        show_first_page_on_load: false,
        scrolling_to: false,
        sidebar_scrolling: false,
        window_outer_width: 0,
        breakpoint: 960,
        mobile_view: false,
        open_nav: false,
        rtime: new Date(1, 1, 2000, 12,00,00),
        timeout: false,
        delta: 200,
        return_load_time: false,
        version: null
    },

    computed: {
        project: function() {
            if(this.project_name && this.project_url) {
                return '<a href="' + this.project_url + '" target="_blank"><span>' + this.project_name + '</span></a>';
            }

            if(this.project_name && !this.project_url) {
                return this.project_name;
            }

            return null;
        },

        copyright: function() {
            var date = new Date(),
                copyright_year = '',
                client = '',
                formattedCreators = '',
                creators = '',
                url = '',
                name = '';

            if (this.copyright_start_year && date.getFullYear() == this.copyright_start_year) {
                copyright_year = this.copyright_start_year;
            }
            if (this.copyright_start_year && date.getFullYear() > this.copyright_start_year) {
                copyright_year = this.copyright_start_year + ' - ' + date.getFullYear();
            }

            if (this.client_name && this.client_url) {
                client = '<a href="' + this.client_url + '" target="_blank">' + this.client_name + '</a>';
            }
            if (this.client_name && ! this.client_url) {
                client = this.client_name;
            }

            if (this.creators.length && this.creators[0].name) {
                for (var i = 0; i < this.creators.length; i++) {
                    prefix = i === this.creators.length - 1 ? ' & ' : ', ';
                    url = this.creators[i].url;
                    name = this.creators[i].name.replace(' ', '&nbsp;');

                    formattedCreators += prefix + '<a href="' + url + '" target="_blank">' + name + '</a>';
                }
            }
            if (formattedCreators) {
                creators = '<br/>Pattern library created by ' + formattedCreators.substring(2) + '.';
            }

            if (! copyright_year || ! client) return null;

            return '&copy; ' + copyright_year + ' ' + client + creators;
        },

        library_inline_styles: function() {
            var _this = this,
                styles = '';

            if(_this.theme.max_width) {
                styles += 'max-width:' + _this.theme.max_width + 'px;';
            }

            return styles;
        },

        loaded: function() {
            var _this = this;

            return _this.components_loaded && _this.stylesheets_loaded;
        }
    },

    watch: {
        groups_loaded: function() {
            var _this = this;

            _this.setupComponents();
        },

        components_loaded: function() {
            var _this = this;

            if (_this.components_loaded === true) {
                _this.scrollTo(window.location.hash);

                _this.injectProjectScripts();

                Astrum.$emit('components_loaded');
            }
        },

        stylesheets_loaded: function() {
            var _this = this;

            if (_this.stylesheets_loaded === true && _this.stylesheets_count !== 0) {
                var head = document.getElementsByTagName('head').item(0),
                    style,
                    output;

                output = postcss().use(prefixer({
                    prefix: '.ndpl-component__sample',

                    transform: function (prefix, selector, prefixedSelector) {
                        if (selector === 'html') {
                            return prefix + ' .html';
                        } else if (selector === 'body') {
                            return prefix + ' .body';
                        } else {
                            return prefixedSelector;
                        }
                    }
                })).process(_this.styles).css;

                // Inject inline styles for Astrum theme override.
                style = document.createElement('style');

                style.type = 'text/css';
                style.appendChild(document.createTextNode(output));

                head.appendChild(style);
            }
        }
    },

    mounted: function() {
        var _this = this;

        if (_this.return_load_time) console.time('Astrum loaded in');

        _this.loadDataFile();

        _this.window_outer_width = window.outerWidth;

        _this.mobile_view = _this.window_outer_width >= _this.breakpoint ? false : true;

        window.addEventListener('scroll', _this.setScrollPosition);
        window.addEventListener('resize', function() {
            _this.window_outer_width = window.outerWidth;
            _this.setScrollPosition();

            _this.mobile_view = _this.window_outer_width >= _this.breakpoint ? false : true;

            _this.rtime = new Date();

            if (_this.timeout === false && !_this.mobile_view) {
                _this.timeout = true;
                setTimeout(_this.trackResizing, _this.delta);
            }
        });

        /**
         * Disable body scrolling when mouseover/mouseleave
         * sidebar to prevent library scroll jumping.
         */
        var sidebar = document.querySelector('.ndpl-sidebar');
        sidebar.addEventListener('mouseover', function(e) {
            _this.sidebar_scrolling = true;
        })
        sidebar.addEventListener('mouseleave', function(e) {
            _this.sidebar_scrolling = false;
        });

        /**
         * Set active page based on hash or show first
         * page on load variable.
         */
        setTimeout(function() {
            var page = _this.isLoadingPage();

            if(page) {
                _this.loadPage(page);
            }
        }, 0);
    },

    methods: {

        /**
         * Inject project styles into head.
         */
        injectProjectStyles: function() {
            var _this = this;

            // If there are no stylesheets we mark them as loaded.
            if (! _this.assets.css.length) {
                _this.stylesheets_loaded = true;
                return;
            }

            _this.styles = '';
            _this.stylesheets_count = _this.assets.css.length;

            for (var i = 0; i < _this.assets.css.length; i++) {
                var stylesheet = _this.assets.css[i];

                // Get and set concatenate css.
                _this.$http.get(stylesheet + '?cb=' + new Date()).then(function (response) {
                    _this.styles += response.data;
                    _this.areStylesheetsLoaded();
                }, function (response) {
                    _this.logError('Stylesheet failed to load from <code>' + response.url.split('?')[0] + '</code>');
                });
            }
        },

        /**
         * Inject theme styles into head.
         */
        injectThemeStyles: function() {
            var _this = this,
                head = document.getElementsByTagName('head').item(0),
                style;

            // Inject inline styles for Astrum theme override.
            style = document.createElement('style');

            style.type = 'text/css';
            style.appendChild(document.createTextNode(
                '/* Targeted theme styles */' +
                '.ndpl-folding-cube .ndpl-cube:before { background-color: ' + _this.theme.brand_color + ' !important; }' +
                '.ndpl-component__sample--inverted    { background-color: ' + _this.theme.sample_dark_background + ' !important }' +
                '.ndpl-c-background                   { background-color: ' + _this.theme.background_color + ' !important; }' +
                '.ndpl-c-border                       { border-color: ' + _this.theme.border_color + ' !important; }' +
                '.ndpl-c-border-b                     { border-bottom-color: ' + _this.theme.border_color + ' !important; }' +
                '.ndpl-c-highlight                    { background-color: ' + _this.theme.highlight_color + ' !important; }' +
                '.ndpl-c-highlight-ca a.active,' +
                '.ndpl-c-highlight-ca a:hover         { background-color: ' + _this.theme.highlight_color + ' !important; }' +
                '.ndpl-c-brand-c                      { color: ' + _this.theme.brand_color + ' !important; }' +
                '.ndpl-c-brand-bg                     { background-color: ' + _this.theme.brand_color + ' !important; }' +
                '.ndpl-c-brand-b                      { border-color: ' + _this.theme.brand_color + ' !important; }' +
                '.ndpl-c-brand-bl-ca a.active,' +
                '.ndpl-c-brand-bl-ca a:hover          { border-left-color: ' + _this.theme.brand_color + ' !important; }' +
                '.ndpl-c-brand-a:hover                { color: ' + _this.theme.brand_color + ' !important; }' +
                '.ndpl-c-brand-ca a:hover             { color: ' + _this.theme.brand_color + ' !important; }' +
                '.ndpl-c-brand-cai a                  { color: ' + _this.theme.brand_color + ' !important; }'
            ));

            head.appendChild(style);

            // Inject highlight.js theme stylesheet.
            var link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = 'assets/highlightjs/styles/' + _this.theme.code_highlight_theme + '.css';

            head.appendChild(link);

            // We have the option to override a highlight.js themes background.
            if (_this.theme.override_code_highlight_bg) {
                style = document.createElement('style');

                style.type = 'text/css';
                style.appendChild(document.createTextNode('.hljs { background:' + _this.theme.highlight_color + ' !important; }'));

                head.appendChild(style);
            }
        },

        /**
         * Inject font libraries into head.
         */
        injectFontLibraries: function() {
            var _this = this,
                head = document.getElementsByTagName('head').item(0),
                link,
                script;

            // Inject Google web fonts.
            if (_this.font_libraries.google_web_fonts) {
                link = document.createElement('link');

                link.rel = 'stylesheet';
                link.href = _this.font_libraries.google_web_fonts;

                head.appendChild(link);
            }

            // Inject Typography web fonts.
            if (_this.font_libraries.typography_web_fonts) {
                link = document.createElement('link');

                link.rel = 'stylesheet';
                link.href = _this.font_libraries.typography_web_fonts;

                head.appendChild(link);
            }

            // Inject TypeKit web fonts.
            if (_this.font_libraries.typekit_code) {
                script = document.createElement('script');

                script.src = 'https://use.typekit.net/' + _this.font_libraries.typekit_code + '.js';

                head.appendChild(script);

                try {
                    Typekit.load({
                        async: true
                    });
                } catch(e) {};
            }
        },

        /**
         * Inject project scripts into body.
         */
        injectProjectScripts: function() {
            var _this = this,
                body = document.getElementsByTagName('body')[0];

            for (var i = 0; i < _this.assets.js.length; i++) {
                var script = document.createElement('script');

                script.src = _this.assets.js[i];

                body.appendChild(script);
            }
        },

        /**
         * Inject meta tags into head.
         */
        injectMeta: function() {
            var _this = this,
                head = document.getElementsByTagName('head').item(0);

            // Set page title.
            var title = _this.project_name ? _this.project_name + ' | Pattern Library' : 'Pattern Library';
            document.title = title;

            // Set application-name meta.
            var meta = document.createElement("meta");

            meta.name = 'application-name';
            meta.content = 'Astrum ' + _this.version;

            head.appendChild(meta);

            // Set favicon.
            link = document.createElement('link');

            link.rel = 'shortcut icon';
            link.href = _this.project_favicon;

            head.appendChild(link);
        },

        /**
         * Apply syntax highlighting to pre code elements
         * within passed element.
         *
         * @param el
         */
        applySyntaxHighlighting: function(el) {

            setTimeout(function() {
                var blocks = el.querySelectorAll('pre code');

                for(var i = 0; i < blocks.length; i++) {
                    var block = blocks[i];

                    hljs.highlightBlock(block);
                }
            }, 0);
        },

        /**
         * Reads the data.json file.
         */
        loadDataFile: function () {
            var _this = this;

            _this.$http.get('./data.json' + '?cb=' + new Date()).then(function (response) {
                _this.initData(response.data, function() {
                    _this.injectThemeStyles();
                    _this.injectProjectStyles();
                    _this.injectFontLibraries();
                    _this.injectMeta();

                    if(_this.$data.groups.length) {
                        _this.setupGroups();
                    } else {
                        _this.logInfo('You need to add a component to your library before it can be loaded.<br/>You can either do this manually by editing your <code>data.json</code> file,<br/> or you can use the command line helper: <code>astrum new [group_name/component_name]</code>');
                    }
                });
            });
        },

        /**
         * Determine if a page should be loaded.
         */
        isLoadingPage: function() {
            var _this = this,
                hash = location.hash;

            if(_this.content.pages !== undefined && _this.content.pages.length) {

                if(hash) {
                    for (var i = 0; i < _this.content.pages.length; i++) {
                        var page = _this.content.pages[i];

                        if (page.name == hash.replace('#', '')) return page;
                    }
                } else if(_this.content.show_first_page_on_load) {
                    return _this.content.pages[0];
                }
            }

            return false;
        },

        /**
         * Initilise data bindings.
         *
         * @param data
         */
        initData: function(data, callback) {
            callback = typeof callback !== 'undefined' ?  callback : function() {};

            var _this = this;

            for(var key in data) {
                Vue.set(_this, key, data[key]);
            }

            callback();
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
         * Setup component groups.
         */
        setupGroups: function() {
            var _this = this;

            // Loop through the groups
            for (var i = 0; i < _this.groups.length; i++) {
                var group = _this.groups[i];

                // Set group navigation navigation
                Vue.set(group, 'id', 'group-' + group.name);
                Vue.set(group, 'active', false);

                // Set default variables
                Vue.set(group, 'description', '');

                // Count groups
                _this.groups_count = _this.groups.length;

                // Load group
                _this.loadGroup(group);
            }
        },

        /**
         * Setup components.
         */
        setupComponents: function() {
            var _this = this;
            
            // Loop through the components
            for (var i = 0; i < _this.groups.length; i++) {
                var group = _this.groups[i];

                // Count components
                _this.components_count += group.components.length;

                // Add group components to group
                for (var j = 0; j < group.components.length; j++) {
                    
                    // Set default variables
                    Vue.set(group.components[j], 'id', 'group-' + group.name + '-component-' + group.components[j].name);
                    Vue.set(group.components[j], 'group_id', 'group-' + group.name);
                    Vue.set(group.components[j], 'active', false);
                    Vue.set(group.components[j], 'options', group.components[j].options ? group.components[j].options : {});
                    Vue.set(group.components[j], 'options.sample_always_show', group.components[j].options.sample_always_show ? group.components[j].options.sample_always_show : false);
                    Vue.set(group.components[j], 'options.sample_mobile_hidden', group.components[j].options.sample_mobile_hidden ? group.components[j].options.sample_mobile_hidden : false);
                    Vue.set(group.components[j], 'options.sample_dark_background', group.components[j].options.sample_dark_background ? group.components[j].options.sample_dark_background : false);
                    Vue.set(group.components[j], 'options.disable_code_sample', group.components[j].options.disable_code_sample ? group.components[j].options.disable_code_sample : false);
                    Vue.set(group.components[j], 'code_show', false);
                    Vue.set(group.components[j], 'type', group.components[j].type ? group.components[j].type : 'standard');
                    Vue.set(group.components[j], 'width', group.components[j].width ? group.components[j].width : 'full');

                    // Add html and description properties to the component object.
                    Vue.set(group.components[j], 'html', '');
                    Vue.set(group.components[j], 'description', '');

                    _this.loadComponent(group.components[j]);
                }
            }
        },

        /**
         * Load group files.
         *
         * @param group
         */
        loadGroup: function(group) {
            var _this = this,
                group_path = './components/' + group.name;

            // Get and set component description
            Astrum.$http.get(group_path + '/description.md' + '?cb=' + new Date()).then(function (response) {
                if (typeof response.data === 'string') group.description = marked(response.data);
                _this.areGroupsLoaded();
            }, function () {
                _this.logError('Description file for <strong>' + group.name + '</strong> group failed to load from <code>' + group_path + '/description.md</code>');
            });
        },

        /**
         * Load component files.
         *
         * @param component
         */
        loadComponent: function(component) {
            var _this = this,
                component_path = './components/' + component.group + '/' + component.name;

            // Get and set component markup
            _this.$http.get(component_path + '/markup.html' + '?cb=' + new Date()).then(function (response) {
                component.html = typeof response.data === 'string' ? response.data : '';
                _this.areComponentsLoaded();
            }, function () {
                    _this.logError('HTML file for <strong>' + component.name + '</strong> component failed to load from <code>' + component_path + '/html.md</code>');
            });

            // Get and set component description
            _this.$http.get(component_path + '/description.md' + '?cb=' + new Date()).then(function (response) {
                if (typeof response.data === 'string') component.description = marked(response.data);
                _this.areComponentsLoaded();
            }, function () {
                _this.logError('Description file for <strong>' + component.name + '</strong> component failed to load from <code>' + component_path + '/description.md</code>');
            });
        },

        /**
         * Increment groups loaded.
         */
        areGroupsLoaded: function() {
            var _this = this;

            _this.groups_loaded_count += 1;

            if (_this.groups_loaded_count === _this.groups_count) {

                setTimeout(function() {
                    _this.groups_loaded = true;
                }, 1000);
            }
        },

        /**
         * Increment components loaded.
         */
        areComponentsLoaded: function() {
            var _this = this;

            _this.components_loaded_count += 1;

            if (_this.components_loaded_count === _this.components_count * 2) {

                setTimeout(function() {
                    _this.components_loaded = true;

                    if (_this.return_load_time) console.timeEnd('Astrum loaded in');
                }, 2000);
            }
        },

        /**
         * Increment stylesheets loaded.
         */
        areStylesheetsLoaded: function() {
            var _this = this;

            _this.stylesheets_loaded_count += 1;

            if (_this.stylesheets_loaded_count === _this.stylesheets_count) {

                setTimeout(function() {
                    _this.stylesheets_loaded = true;
                }, 2000);
            }
        },

        /**
         * Add to log.
         *
         * @param message
         * @param data
         * @param type
         */
        addLog: function(message, data, type) {
            var _this = this;

            type = typeof type !== 'undefined' ? type : 'error';
            data = typeof data !== 'undefined' ? data : null;

            _this.log[type].push(message);
            console[type]('[Pattern Library warn]: ' + message);

            if(data) {
                console[type](data);
            }
        },

        /**
         * Log error helper.
         *
         * @param message
         * @param data
         */
        logError: function(message, data) {
            var _this = this;

            _this.addLog(message, data, 'error');
        },

        /**
         * Log info helper.
         *
         * @param message
         * @param data
         */
        logInfo: function(message, data) {
            var _this = this;

            _this.addLog(message, data, 'info');
        },

        /**
         * Set scroll position.
         */
        setScrollPosition: function() {
            var _this = this,
                doc = document.documentElement,
                top = doc && doc.scrollTop || document.body.scrollTop;

            _this.prev_scroll_position = _this.scroll_position;
            _this.scroll_position = top;
        },

        /**
         * Get scroll direction.
         *
         * @returns {string}
         */
        getScrollDirection: function() {
            var _this = this;

            return _this.prev_scroll_position < _this.scroll_position ? 'down' : 'up';
        },

        /**
         * Scroll to element.
         *
         * @param e
         */
        scrollToHref: function(e) {
            var _this = this;

            _this.scrollTo(e.target.hash);
            _this.active_page = null;
        },

        /**
         * Animate scroll to.
         *
         * @param hash
         */
        scrollTo: function(hash) {
            var _this = this,
                offset = _this.mobile_view ? 79 : 30;

            if(!hash) return;
            _this.scrolling_to = true;

            smoothScroll.animateScroll(document.querySelector(hash), null, {
                offset: offset,
                callback: function() {
                    _this.scrolling_to = false;
                    _this.open_nav = false;
                }
            });
        },

        /**
         * Toggle navigation.
         */
        toggleNav: function() {
            var _this = this;

            _this.open_nav = ! _this.open_nav;
        },

        /**
         * Toggle open groups.
         *
         * @param group
         */
        toggleOpenGroups: function(group) {
            var _this = this;

            _this.open_group = _this.open_group == group.id ? null : group.id;
            _this.active_page = null;
        },

        /**
         * Load content page.
         * @param page
         */
        loadPage: function(page) {
            var _this = this;

            _this.active_page = page;
            _this.active_components = [];
            _this.open_group = null;
            _this.open_nav = false;
            
            _this.$http.get(page.file + '?cb=' + new Date()).then(function (response) {
                Vue.set(_this.active_page, 'markup', marked(response.data));
                
                _this.applySyntaxHighlighting(document);
            });

            _this.updateHash(page.name);
        },

        /**
         * Track resizing and broadcast resizing events.
      */
        trackResizing: function() {
            var _this = this;

            _this.resizing = true;
            Astrum.$emit('resizing', true);

            if (new Date() - _this.rtime < _this.delta) {
                setTimeout(_this.trackResizing, _this.delta);
            } else {
                _this.timeout = false;

                setTimeout(function() {
                    _this.resizing = false;
                    Astrum.$emit('resizing', false);
                }, 1000);
            }
        },

        /**
         * Convert hex color value to rgb color values.
         *
         * @param hex
         * @returns {{r: number, g: number, b: number}}
         */
        convertHexToRgb: function(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Get color brightness value from rgb color values.
         *
         * @param rgb
         * @returns {number}
         */
        getColorBrightness: function(rgb) {
            return Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) /1000);
        }
    }
});