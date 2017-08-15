# Astrum

![](http://nodivide.imgix.net/astrum/header.jpg)

Astrum is a lightweight pattern library designed to be included with any web project.

It's non-opinionated and doesn't expect you to write your markup or code in any particular way.

An Astrum pattern library comprises of components organised into groups. Each component has a `markup.html` and `description.md` file which are
used to render an example of the component along with a code sample. A group can also have an description and is used for organisational purposes.
You also have the option to add pages of content, for example an introduction page and/or coding guidelines specific to your project.

[View a demo](http://astrum.nodividestudio.com/pattern-library/)

***

## Table of Contents
- [Getting Started](#getting-started)
- [How Astrum Works](#getting-started)
	- [Folder Structure](#folder-structure)
	- [The data.json File](#the-datajson-file)
		- [Project Details](#project-details)
		- [Creators](#creators)
		- [Theming](#theming)
		- [Assets](#assets)
		- [Font Libraries](#font-libraries)
		- [Content Pages](#content-pages)
- [Adding Components](#adding-components)
	- [Component Types](#component-types)
	- [Special Options](#special-options)
- [Editing Components](#editing-components)
- [Editing Groups](#editing-groups)
- [Listing Components](#listing-components)
- [Deleting Components](#deleting-components)
- [Deleting Groups](#deleting-groups)
- [Updating Astrum](#updating-astrum)
- [Contributing](#contributing)
- [Browser Support](#browser-support)
- [Acknowledgements](#acknowledgements)
- [License](#license)

***

<a href=“#getting-started”></a>
## Getting Started
Firstly globally install Astrum:

`npm install -g astrum`

Then from within your project root initialise Astrum into a publicly accessible folder e.g.:

`astrum init ./public/pattern-library`

Finally add your first component e.g.:

`astrum new buttons/default`

Your pattern library should now be up and running though granted it will look a little sparse at this stage.

<a href=“#how-astrum-works”></a>
## How Astrum Works
Astrum is a single page, [Vue.js](https://vuejs.org) powered, app. As mentioned previously, it comprises of components organised into groups and loads its all important data from a core `data.json` file.

<a href=“#folder-structure”></a>
### Folder Structure

```
app                      // Patterns CSS and JavaScript.
components               // Your components.
  buttons                // Example group folder.
    default              // Example component folder.
      markup.html        // Component markup.
      description.md     // Component description.
    description.md.      // Group description.
pages                    // Your pages.
  intro.md               // Example page.
data.json                // Core data file.
favicon.png              // Astrums default favicon.
index.html               // Patterns app index file.
LICENSE.txt              // MIT licence file.
```

Each group has its own folder under `components` and each component has its own sub-folder under its parent group.

<a href=“#the-data-file”></a>
### The data.json File
The `data.json` file is central to how Astrum works and should be relatively self explanatory upon opening it. By default it looks like this:

```
{
    "project_logo": null,
    "project_favicon": "favicon.png",
    "project_name": null,
    "project_url": null,
    "copyright_start_year": null,
    "client_name": null,
    "client_url": null,
    "creators": [
        {
            "name": null,
            "url": null
        }
    ],
    "theme": {
        "border_color": "#E0E6ED",
        "highlight_color": "#F9FAFC",
        "brand_color": "#00585C",
        "background_color": "#FFFFFF",
        "code_highlight_theme": "github",
        "override_code_highlight_bg": "#F9FAFC",
        "sample_dark_background": "#333333",
        "show_project_name": true,
        "show_version": true,
        "max-width": null,
        "titles": {
            "library_title": "Pattern Library",
            "pages_title": "Overview",
            "components_title": "Components"
        }
    },
    "assets": {
        "css": [],
        "js": []
    },
    "font_libraries": {
        "typekit_code": null,
        "typography_web_fonts": null,
        "google_web_fonts": null
    },
    "content": {
        "show_first_page_on_load": true,
        "title": "Overview",
        "pages": [
            {
                "name": "introduction",
                "title": "Introduction",
                "file": "./pages/intro.md"
            }
        ]
    },
    "groups": []
}
```

Let's break it down in details:

<a href=“#project-details”></a>
#### Project Details
```
{
    "project_logo": "/assets/images/logo.svg",
    "project_favicon": "../favicon.png",
    "project_name": "My Project",
    "project_url": "http://myproject.com",
    "copyright_start_year": 2015,
    "client_name": "Best Client Ltd",
    "client_url": "http://bestclient.com",
```

The more information you add to your `data.json` file, the more customised the Astrum UI becomes. For example, if you specify a `project_logo` (this can be a relative path or a full URL), the logo will appear at the top of the sidebar and/or if you specify a `client_name` along with a `copyright_start_year`, copyright information will be automatically generated. This will appear at the bottom of the sidebar.

<a href=“#creators”></a>
#### Creators
```
    "creators": [
        {
            "name": "Ryan Taylor",
            "url": "http://twitter.com/ryanhavoc"
        },
        {
            "name": "Matt West",
            "url": "http://twitter.com/mattantwest"
        }
    ]
```

You can specify as many creators as you need. Astrum will automatically format these into a "created by" line that appears at the bottom of the sidebar.

<a href=“#theming”></a>
#### Theming
```
    "theme": {
        "border_color": "#E0E6ED",
        "highlight_color": "#F9FAFC",
        "brand_color": "#00585C",
        "background_color": "#FFFFFF",
        "code_highlight_theme": "github",
        "override_code_highlight_bg": "#F9FAFC",
        "sample_dark_background": "#333333",
        "show_project_name": true,
        "show_version": true,
        "max_width": null,
        "titles": {
            "library_title": "Pattern Library",
            "pages_title": "Overview",
            "components_title": "Components"
        }
    },
```

Astrum supports basic theming to help you bring your pattern library in line with your projects branding.

Key | Default | Description
---|---|---
border_color | #E0E6ED | The border color used throughout the pattern library, e.g. separating the nav items and around the component containers.
highlight_color | #F9FAFC | The highlight color used throughout the pattern library, .e.g. the background on nav items and the show code sample buttons.
brand_color | #00585C | The primary brand color for your project, used sparing to signify the active nav item as well as and anchors used in your descriptions.
background_color | #FFFFFF | The background color for the whole pattern library.
code_hightlight_theme | github | Astrum uses [highlight.js](https://highlightjs.org) for its code samples. You can use any style you like: [available styles](https://highlightjs.org/static/demo)
override_code_highlight_bg | #F9FAFC | Allows you to override a [highlight.js](https://highlightjs.org) styles background color.
sample_dark_background | #333333 | The color used for dark background component samples.
show_project_name | true | Show the project name in the sidebar.
show_version | true | Show the Astrum version at the bottom of the sidebar.
max_width | null | A maximum width for the components container element.
titles | object | Customise titles that appear on the sidebar. Set a title to null if you'd prefer for it not to be shown at all.

<a href=“#assets”></a>
#### Assets
```
    "assets": {
        "css": [
            "../assets/css/styles.css"
        ],
        "js": [
            "../assets/js/vendor.js",
            "../assets/js/main.js"
        ]
    },
```
This is where you specify the CSS and JavaScript for your project, these will be included in your pattern library to render your components.

<a href=“#font-libraries”></a>
#### Font Libraries
```
    "font_libraries": {
        "typekit_code": null,
        "typography_web_fonts": null,
        "google_web_fonts": null
    },
```
If your project requires a font service you can specify this here.

**Note:** *For TypeKit you only need to specify the unique code for example: https://use.typekit.net/**dxp5bzu**.js*

<a href=“#content-pages”></a>
#### Content Pages
```
    "content": {
        "show_first_page_on_load": true,
        "title": "Overview",
        "pages": [
            {
                "name": "introduction",
                "title": "Introduction",
                "file": "./pages/intro.md"
            }
        ]
    },
```
Astrum includes an introduction page by default.

Key | Default | Description
---|---|---
show_first_page_on_load|true|Display the first page in the `pages` array on load.
title|Overview|The title that appears above the pages navigation in the sidebar.

Add your pages to the `pages` array, each item requires:

Key|Description
---|---
name|The page name, should be lowercase with no spaces. This value is used to set the page’s ID.
title|The page title, this appears in the page navigation in the sidebar.
file|Either created `.md` file in the pages directory and enter the relative path to it or specify a full Url to a markdown file, for example a `README.md` file in a Git repository.

**Note:** *If you don’t require any pages in your pattern library simple set the `content` key value to `null`.*

<a href=“#adding-components”></a>
## Adding Components
The simplest way to add a component to your pattern library is by using the Astrum command-line tool which will ask you a series of questions on how you want the component to be configured. For example:

`astrum new navigation/primary`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-new.gif)

This result of this in your `data.json` file would be:

```
    "groups": [
        {
            "name": "navigation",
            "title": "Navigation",
            "components": [
                {
                    "group": "navigation",
                    "name": "primary",
                    "title": "Primary Navigation"
                }
            ]
        }
    ],
```

The necessary files required for the new component are created for you automatically so now you can add your markup and a component description ready to be displayed in your pattern library.

<a href=“#component-types”></a>
### Component Types
Astrum currently supports two component types. The default component and a **colors** type. The **colors** type lets you include a color palette in your pattern library and to include it you use the `--type` option:

`astrum new branding/color-palette --type colors`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-new-colors.gif)

The result of this in your `data.json` file would be:

```
    "groups": [
        {
            "name": "branding",
            "title": "Branding",
            "components": [
                {
                    "group": "branding",
                    "name": "primary-palette",
                    "title": "Primary Color Palette",
                    "type": "colors",
                    "colors": []
                }
            ]
        },
   ],
```

You’ll need to edit your `data.json` file further to add your color values, for example:

```
"colors": [
    "#4c4c4c",
    "#7d8284",
    "#a6b1b5",
    "#e6eaf2",
    "#FFFFFF"
]
```

You can also add complimentary colors by comma separating the values e.g.:

```
"colors": [
    "#7da9f9,#507ed3",
    "#f469a7,#c14c80",
    "#60ceb8,#3fa18d",
    "#f5d13f,#f5a63f",
    "#e199e5,#c776cb"
]
```

<a href=“#special-options”></a>
### Special Options
Components can also have special options that alter their behaviour. To use these add an `options` key to the component, for example:

```
{
    "group": "navigation",
    "name": "primary",
    "title": "Primary Navigation",
    "options": {
	      "sample_dark_background": true,
	      "disable_code_sample": true
    }
}
```

The available options are:

Key|Value|Description
---|---|---
sample_dark_background|boolean|Set the background of the component sample area to be a dark color.
sample_background_color|string|Override sample background color. This option take precident over the dark background color.
sample_min_height|integer|Astrum detects if a component is hidden at desktop or mobile resolutions by detecting the components rendered height. When it’s hidden in your project CSS, Astrum shows a message to this effect. If the component is absolutely positioned, it has no height so you can set a min-height with this option to ensure it is shown properly and Astrum messaging is shown correctly.
sample_overflow_hidden|boolean|Apply `overflow: hidden;` to the component sample.
disabled_auto_sample_hiding|object|Astrum automatically detects if you've hidden a component at mobile or desktop resolutions in your stylesheets. You can disable this feature using this option. Add `show_on_mobile` and `show_on_desktop` keys to the object with boolean values to set how the component should behave.
disable_code_sample|boolean|Don't display the component code sample.

<a href=“#editing-components”></a>
## Editing Components
To edit a component use the `edit` command:

`astrum edit branding/primary-palette`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-edit.gif)

<a href=“#editing-groups”></a>
## Editing Groups
You can also edit a group using the `--group` option:

`astrum edit --group branding`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-edit-group.gif)

**Note:** *If you change a groups name, Astrum automatically updates all of the groups components.*

<a href=“#listing-components”></a>
## Listing Components
To see a list of all of the components in your pattern library, you can use the `list` command:

`astrum list`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-list.gif)

<a href=“#deleting-components”></a>
## Deleting Components
To delete a component use the `delete` command:

`astrum delete navigation/utility`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-delete.gif)

<a href=“#deleteing-groups”></a>
## Deleting Groups
You can also delete an entire group along with all its components using the `--group` option:

`astrum delete --group navigation`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-delete-group.gif)

<a href=“#updating-astrum”></a>
## Updating Astrum
Firstly update the Astrum package:

`npm update -g astrum`

Navigate to the route of your project and then update your Astrum instance e.g.:

`astrum update`

You will receive feedback that the update is complete.

There is also a `--force` option that you can use to force an update in the event that your Astrum instance is already on the current version. This is if you need to restore your Astrum instance core files.

<a href=“#contributing”></a>
## Contributing
Astrum was created by Ryan Taylor & Matt West of [No Divide](http://nodividestudio.com). We welcome anyone and everyone to contribute to the project and help us make Astrum as versatile as possible. If you decide to get involved, please take a moment to review our [contribution guidelines](.github/CONTRIBUTING.md):

- [Bug reports](.github/CONTRIBUTING.md#bugs)
- [Feature requests](.github/CONTRIBUTING.md#features)
- [Pull requests](.github/CONTRIBUTING.md#pull-requests)

<a href=“#browser-support”></a>
## Browser Support
- Chrome *(latest 2)*
- Safari *(latest 2)*
- Firefox *(latest 2)*
- Opera *(latest 2)*
- Edge *(latest 2)*
- Internet Explorer 10+

This doesn't mean that Astrum cannot be used in older browsers, we’re just aiming to ensure compatibility with those mentioned above.

<a href=“#acknowledgements”></a>
## Acknowledgements
Astrum wouldn’t work without [Vue.js](http://vuejs.org/) and the work that Evan You is doing there: [support his efforts](http://vuejs.org/support-vuejs/).

The nifty loading animation we use was created by [Tobias Ahlin](http://tobiasahlin.com/spinkit/).

Our command-line tool is built using [Commander](https://www.npmjs.com/package/commander) by TJ Holowaychuk and [Inquirer](https://www.npmjs.com/package/inquirer) by Simon Boudrias.

<a href=“#license”></a>
## License
The code is available under the [MIT license](_template/LICENSE.txt).
