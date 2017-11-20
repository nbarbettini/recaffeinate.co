---
title: "Set up the ultimate Windows 10 console"
description: A guide to setting up PowerShell, ConEmu,Chocolatey, Git for Windows, and posh-git on Windows 10
date: 2017-08-10T07:32:58-07:00
---

The console (terminal) on Windows has come a long way since command.com. PowerShell might seem weird at first if you're used to bash on *nix, but it's grown into a very powerful console and scripting tool.

Over the years, I've gathered a list of my favorite plugins and tweaks to make PowerShell and the console even better. In this post, I'll show you how to customize PowerShell on Windows 10 for an awesome console experience.

<!--more-->

#### ConEmu for a tabbed console

First things first, install [ConEmu][conemu]. ConEmu is a terminal that can run any shell in a tabbed window. In other words, it's a nice "frame" around PowerShell, cmd.exe, or other CLI applications:

![Tabbed consoles in ConEmu](/img/post/conemu-tabs.gif)

ConEmu gives you a huge variety of options and ways to customize how the console looks and behaves. Once you start using it, you won't go back to plain powershell.exe.

#### Chocolatey for package management

[Chocolatey][choco] is the missing package manager for Windows. It makes it easy to install and update tools and programs from the console. If you've used `brew` on macOS or `apt-get install` on Debian, you'll feel right at home.

Chocolatey must be installed (and run) from an **administrative** shell. You can start PowerShell as an admin by searching for and right-clicking on Windows PowerShell in the Start Menu and choosing Run as administrator. Or, in ConEmu, click on the **+** icon and choose PowerShell (Admin).

You can refer to the official [install instructions][choco-install], but here's the gist: from an administrative PowerShell console, run:

```ps1
Set-ExecutionPolicy AllSigned; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

Type `choco` or `choco -?` to make sure it's installed:

![choco](/img/post/choco.gif)

Here's what you can do with Chocolatey, at a glance:

* [Search for packages][choco-packages] and install them with `choco install <packagename>`
* Remove packages with `choco uninstall <packagename>`
* See what's installed with `choco list --local-only`
* Check for outdated packages with `choco outdated`
* Upgrade outdated packages with `choco upgrade <packagename>` or `choco upgrade all`
* Much more (try `choco -?`)

#### Git for Windows

If you use Git for version control, you'll need [Git for Windows][g4w]. You can download and install it from the official site, or with `choco install git` (again, make sure you do this from an administrative shell).

After it's done installing, restart the console and run `git --version` to make sure it's on your PATH.

#### posh-git for a nicer Git experience

Once you have Git for Windows installed, you'll definitely want [posh-git][posh-git]. posh-git adds some much-needed conveniences to the Git experience, such as tab-completion and a customizable prompt message:

![Prompt and tab completion in posh-git](/img/post/posh-git-completion.gif)

Install posh-git with the official [installation instructions][posh-git-install] or with `choco install poshgit`. Then, restart your console and navigate to a local Git repo. If you don't see the current branch in the prompt, run `Add-PoshGitToProfile -AllHosts` and restart the console once more.

#### Further reading

* [Set up a smoking Git shell on Windows](http://haacked.com/archive/2015/10/29/git-shell/) by Phil Haack
* [Better Git with PowerShell](http://haacked.com/archive/2011/12/13/better-git-with-powershell.aspx/) also by Phil Haack
* [Is there a better Windows Console Window?](https://stackoverflow.com/q/60950/3191599) on StackOverflow

What are your favorite console tweaks? Let me know in the comments!

[conemu]: https://conemu.github.io/
[choco]: https://chocolatey.org/
[choco-install]: https://chocolatey.org/install
[choco-packages]: https://chocolatey.org/packages
[g4w]: https://git-for-windows.github.io/
[posh-git]: https://github.com/dahlbyk/posh-git
[posh-git-install]: https://github.com/dahlbyk/posh-git#installation
