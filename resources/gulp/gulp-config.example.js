var paths = {
    root:          'public',
    assets_dest:   'public/assets',
    css_dest:      'public/assets/css',
    scripts_dest:  'public/assets/js',
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
    url: 'http://localhost',
    paths: paths,
    builds: builds,
    vendor: vendor
};
