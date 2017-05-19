# Contributing to Astrum

Our aim is to make Astrum as versatile as possible and if you’d like to contribute to the project please take a moment to review this document.

## Using the issue tracker

The [issue tracker](https://github.com/nodivide/astrum/issues) is our preferred channel for [bug reports](#bugs), [features requests](#features) and submitting [pull requests](#pull-requests).

<a name="bugs"></a>
## Bug reports

*When creating a bug issue please apply the red “bug” label.*

A bug is a reproducible issue that is caused by the code in the repository. 

*Note: Astrum applies your projects CSS and JavaScript to render component examples, please ensure that any suspected “bugs” aren’t being caused by an adverse issue in your own project code*.

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the latest `master` or development branch in the repository.

3. **Isolate the problem** &mdash; ideally create a [reduced test case](https://css-tricks.com/reduced-test-cases/) and a live example.

Please try to be as detailed as possible in your report, in particular what steps will reproduce the issue and what browser(s) and OS you are experience it on? Screenshots are also useful. All these details will help us resolve any potential bugs more quickly.

<a name="features"></a>
## Feature requests

*When creating a feature request please apply the green “feature request” label.*

We’re open to ideas and will consider any strong case for additional features to incorporate into Astrum. Please consider the wider user base when making a feature request. Will this the new feature benefit everyone?

Example use cases and scenarios for why the new feature is being requested are always helpful. 

Thanks for taking the time and endeavouring to help make Astrum better.

<a name="pull-requests"></a>
## Pull requests

Pull requests are a great help. Please ensure they remain focused in scope and commit messages conform to these [git message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

**Please ask first** before developing any new features, otherwise you risk spending a lot of time working on something that we might not want to merge into Astrum.

The following process is the best way to get your work included:

1. [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork, and configure the remotes:

	```bash
	# Clone your fork of the repo into the current directory
	$ git clone https://github.com/<your-username>/astrum.git
	```
			   
	```bash		
	# Navigate to the newly cloned directory
	$ cd astrum
	```
			
	```bash  
	# Assign the original repo to a remote called "upstream"
	$ git remote add upstream https://github.com/nodivide/astrum.git
	```
	   
	```bash	   
	# Create a globally-installed symbolic link to your local              
	# development copy of Astrum
	$ npm link
	```
   
2. If you cloned a while ago, get the latest changes from upstream:

	```bash
	git checkout master
	git pull upstream master
	```

3. Create a new local branch (off the main develop branch) and prefix it with the type of PR you’re submitting, feature/, change/, or fix/ followed by a short description e.g. fix/heading-alignment:

	```bash
	git checkout -b <prefix/description>
	```

4. Commit your changes.

5. Locally merge the upstream develop branch into your local branch to ensure you’re PR contains any changes that have occurred since you started:

	```bash
	git pull upstream master
	```

6. Push your local branch up to your fork:

	```bash
	git push origin <prefix/description>
	```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.

**IMPORTANT**: By submitting a pull request, you agree to allow us to license your work under the terms of the [MIT License](LICENSE.txt).
