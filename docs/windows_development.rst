.. _windows_development:

Windows Development
###################

Our build does not run natively on Windows due to its requirement of a POSIX shell and some of
the core utilities such as ``cat``, ``cp``, ``echo``, ect. However, you can build and develop
OpenSphere on Windows with any of the following:

- Git Bash (included with Git for Windows)
- Cygwin_
- `Windows Subsystem for Linux`_
- Docker
- Linux VM

These instructions will take the simplest approach by using Git Bash.

.. _Cygwin: https://www.cygwin.com
.. _Windows Subsystem for Linux: https://docs.microsoft.com/en-us/windows/wsl/install-win10


Prerequisites
=============

Install git, java, node, and yarn. We recommend using Chocolatey_, a package manager for Windows.
After installing Chocolatey_, run the following in a command prompt as an administrator:

.. _Chocolatey: https://chocolatey.org/

.. code-block:: none

  choco install git jre8 nvm yarn
  refreshenv
  nvm install 10.16.2
  nvm use 10.16.2

Now we will check our work:

.. code-block:: none

  git --version
  java -version
  node --version
  npm --version
  yarn --version

Git for Windows installs "Git Bash". Search for it in the Start Menu and fire it up.


Setup
=====

Setup the project workspace and clone the project:

.. code-block:: none

  cd <your workspace directory>
  git clone https://github.com/ngageoint/opensphere-yarn-workspace
  cd opensphere-yarn-workspace/workspace
  git clone https://github.com/ngageoint/opensphere
  yarn install
  cd opensphere

Now you are about ready to build opensphere. However, we need to tell the NPM script runner to use BASH
rather than whatever it typically uses on Windows.

.. code-block:: none

  npm config set script-shell "C:/Program Files/git/bin/bash.exe"

If you have other node projects on your machine and do not wish for this to pollute them, then consider adding
that configuration to a ``.npmrc`` file local to the project.

Also fix your line ending configuration for git (necessary if using Git Bash but not if you are using a full POSIX environment such as Cygwin_):

.. code-block:: none

  git config core.autocrlf input

Now build:

.. code-block:: none

  npm run build

At the time of this writing, ``yarn`` has a bug with the ``script-shell`` config. A fix has already been committed and should make their next non-patch release. After that you can use ``yarn run build`` or just ``yarn build`` if  you prefer.
