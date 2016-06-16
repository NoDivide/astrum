# Astrum

![](http://nodivide.imgix.net/astrum/header.jpg)

Astrum is a lightweight pattern library designed to be included with any web project.

It's non-opinionated and doesn't expect you to write your markup or code in any particular way.

An Astrum pattern library comprises of components organised into groups. A component comprises of a rendered sample of a particular element along with a code sample and a (optional) description for the components usage. A group can also have an (optional) description and is used for organisational purposes. You also have the option to add pages of content, for example an introduction page and/or coding guidelines specific to your project.

***

## Table of Contents
- [Getting Started](#getting-started)
- [How Astrum Works](#getting-started)
	- [Folder Structure](#folder-structure)
	- [The data.json File](#the-data-file)
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
- [License](#license)

***

## Getting Started<a href=“#getting-started”></a>
Firstly globally install Astrum:

`npm install -g astrum`

Then from within your project root initialise Astrum into a publicly accessible folder e.g.:

`astrum init ./public/patterns`

Finally add your first component e.g.:

`astrum new buttons/default`

Your pattern library should now be up and running though granted it will look a little sparse at this stage.

## How Astrum Works<a href=“#how-astrum-works”></a>
Astrum is a single page, [Vue.js](https://vuejs.org) powered, app. As mentioned previously, it comprises of components organised into groups and loads it's all important data from a core `data.json` file.

### Folder Structure<a href=“#folder-structure”></a>

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
index.html               // Patterns app index file.
LICENSE.txt              // MIT licence file. 
```

Each group has it’s own folder under `components` and each component has it’s own sub-folder under it’s parent group.

### The data.json File<a href=“#the-data-file”></a>
The `data.json` file is central to how Astrum works and should be relatively self explanatory upon opening it. By default it looks like this:

```
{
    "project_logo": null,
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
        "show_version": true,
        "max-width": null
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

#### Project Details<a href=“#project-details”></a>
```
{
    "project_logo": "/assets/images/logo.svg",
    "project_name": "My Project",
    "project_url": "http://myproject.com",
    "copyright_start_year": 2015,
    "client_name": "Best Client Ltd",
    "client_url": "http://bestclient.com",
```

The more information you add to your `data.json` file the more customised the Astrum UI becomes for example if you specify a `project_logo` (this can be a relative path or a full URL) the logo will appear at the top of the sidebar and/or if you specify a `client_name` along with a `copyright_start_year`, copyright information will be automatically generated. This will appear at the bottom of the sidebar.

#### Creators<a href=“#creators”></a>
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

#### Theming<a href=“#theming”></a>
```
    "theme": {
        "border_color": "#E0E6ED",
        "highlight_color": "#F9FAFC",
        "brand_color": "#00585C",
        "background_color": "#FFFFFF",
        "code_highlight_theme": "github",
        "override_code_highlight_bg": "#F9FAFC",
        "sample_dark_background": "#333333",
        "show_version": true,
        "max-width": null
    },
```

Astrum supports basic theming to help you bring your pattern library inline with you projects branding.

Key | Default | Description
---|---|---
border_color | #E0E6ED | The border color used throughout the pattern library, e.g. separating the nav items and around the component containers.
highlight_color | #F9FAFC | The highlight color used throughout the pattern library, .e.g. the background on nav items and the show code sample buttons.
brand_color | #00585C | The primary brand color for your project, used sparing to signify the active nav item as well as and anchors used in your descriptions.
background_color | #FFFFFF | The background color for the whole pattern library.
code_hightlight_theme | github | Astrum uses [highlight.js](https://highlightjs.org) for its code samples. You can use any style you like: [available styles](https://highlightjs.org/static/demo)
override_code_highlight_bg | #F9FAFC | Allows you to override a [highlight.js](https://highlightjs.org) styles background color.
sample_dark_background | #333333 | The color used for dark background component samples.
show_version | true | Show the Astrum version at the bottom of the sidebar.
max-width | null | A maximum width for the components container element.

#### Assets<a href=“#assets”></a>
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

#### Font Libraries<a href=“#font-libraries”></a>
```
    "font_libraries": {
        "typekit_code": null,
        "typography_web_fonts": null,
        "google_web_fonts": null
    },
```
If your project requires a font service you can specify this here. 

**Note:** *For TypeKit you only need to specify the unique code for example: https://use.typekit.net/**dxp5bzu**.js*

#### Content Pages<a href=“#content-pages”></a>
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

## Adding Components <a href=“#adding-components”></a>
The simplest way to add a component to your pattern library is by using the Astrum command-line tool which will as you a series of questions on how you want the component to be configured. For example:

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

The necessary files required for the new component are created for you automatically so now you can add your markup and a component description ready to be display in your pattern library.

### Component Types<a href=“#component-types”></a>
Astrum currently supports two component types. The default component and a **colors** type. The **colors** type let’s you include a color palette in your pattern library and to include it you use the `—type` option:

`astrum new branding/color-palette —type colors`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-new-colors.gif)

This result of this in your `data.json` file would be:

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

### Special Options<a href=“#special-options”></a>
Components can also have special options that alter their behaviour. To use these add an `options` key to the component, for example:

```
{
    "group": "navigation",
    "name": "primary",
    "title": "Primary Navigation",
    "options": {
	      "sample_dark_background": true
    }
}
```

The available options are:

Key|Value|Description
---|---|---
sample_dark_background|boolean|Set the background of the component sample area to be a dark color.
sample_min_height|integer|Astrum detects if a component is hidden at desktop or mobile resolutions by detected the component rendered height. When it’s hidden in your project CSS Astrum shows a message to this effect. If the component is absolutely positioned it has no height so you can set a min-height with this option to ensure it is shown properly and Astrum messaging is shown correctly.
sample_mobile_hidden|boolean|Typically used in conjunction with the `sample_min_height` option if a component is meant to be hidden at mobile resolutions set this option to true.

## Editing Components<a href=“#editing-components”></a>
To edit a component use the `edit` command:

`astrum edit branding/primary-palette`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-edit.gif)

## Editing Groups<a href=“#editing-groups”></a>
You can also edit a group using the `—group` option:

`astrum edit —group branding`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-edit-group.gif)

**Note:** *If you change a groups name Astrum automatically updates all of the groups components.*

## Listing Components<a href=“#listing-components”></a>
Do see a list of all of the components in your pattern library you can use the `list` command:

`astrum list`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-list.gif)


## Deleting Components<a href=“#deleting-components”></a>
To delete a component use the `delete` command:

`astrum delete navigation/utility`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-delete.gif)

## Deleting Groups<a href=“#deleteing-groups”></a>
You can also delete an entire group along with all it’s components using the `—group` option:

`astrum delete —group navigation`

![](https://dl.dropboxusercontent.com/u/251342/astrum-gifs/astrum-delete-group.gif)

## Updating Astrum<a href=“#updating-astrum”></a>
Firstly update the Astrum package:

`npm update -g astrum`

Then update your Astrum instance e.g.:

`astrum update ./public/patterns`

You will receive feedback that the update is complete.

## Contributing<a href=“#contributing”></a>
Astrum was created by Ryan Taylor & Matt West of [No Divide](http://nodividestudio.com). We welcome anyone and everyone to contribute to the project and help us make Astrum as versatile as possible. If you decide to get involved, please take a moment to review our [contribution guidelines](CONTRIBUTING.md):

- [Bug reports](CONTRIBUTING.md#bugs)
- [Feature requests](CONTRIBUTING.md#features)
- [Pull requests](CONTRIBUTING.md#pull-requests)


## License<a href=“#license”></a>
The code is available under the [MIT license](_template/LICENSE.txt).
