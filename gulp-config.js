var paths = {
    root:          '',
    assets_dest:   'assets',
    css_dest:      'assets/css',
    scripts_dest:  'assets/js',
    icons_dest:    'assets/icons',
    core:          'resources/core',
    vendor:        'node_modules'
};

var builds = {
    site: {
        styles: {
            raw:  paths.core + '/site/sass/',
            src:  paths.css_dest + '/src/site/',
            dist: paths.css_dest + '/dist/site/'
        },

        scripts: {
            raw:  paths.core + '/site/js/',
            src:  paths.scripts_dest + '/src/site/',
            dist: paths.scripts_dest + '/dist/site/'
        },

        icons: {
            raw:    paths.core + '/site/icons/',
            dest:   paths.icons_dest + '/site/',
            styles: paths.core + '/site/sass/components/icons/'
        },

        handlebarsTemplates: {
            raw: paths.core + '/site/js/templates/'
        },

        templates: {
            raw: 'resources/views/'
        }
    }
};

var vendor = {
    site: {
        styles: [
            paths.vendor + '/normalize.css/normalize.css'
        ],
        scripts: {
            head: [],
            foot: []
        }
    }
};

module.exports = {
    url: 'http://bp-static.loc',
    paths: paths,
    builds: builds,
    vendor: vendor
};
