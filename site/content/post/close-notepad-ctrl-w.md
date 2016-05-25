+++
date        = "2016-05-22T16:03:11-07:00"
title       = "Close Notepad with Control-W"
description = "How to add a missing keyboard shortcut to Windows"
slug        = "close-notepad-ctrl-w"
categories  = "code"
tags        = ["hack", "windows"]
+++

I use [Atom](https://atom.io/) and [Notepad++](https://notepad-plus-plus.org/) for most text editing tasks on Windows, but occasionally I'll drop down to good, trusty Notepad. It loads fast and handles bare-bones editing tasks without much fuss. However, I found it annoying that there was no shortcut to quit Notepad other than ``Alt-F4``, which feels awkward on my keyboard. Why can't I use ``Ctrl-W``?

<!--more-->

``Ctrl-W`` has a long history: it's always been the shortcut to close Windows Explorer (folder) windows. When tabbed browsing came onto the scene, it became the de facto shortcut for closing browser windows and tabs. It's downright muscle memory for me at this point.

I see Notepad when I do ``git commit``, thanks to [GitPad][gitpad]. My muscle memory tries to type a message and press ``Ctrl-W`` to close the window, so why fight it?

It turns out it's easy to add the missing keyboard shortcut. I created a simple [AutoHotkey][ahk] script:

{{< gist 29b8b688b5b6a0e9a7dccc7ff3e62314 >}}

The script works by listening for ``Ctrl-W`` in any active Notepad.exe window, and remapping it to ``Alt-F4``.

I put a shortcut to the ``.ahk`` file in my Windows Start Menu Startup folder (yes, that still exists!), and now I can use my keyboard muscle memory without fail.

[gitpad]: https://github.com/github/GitPad
[ahk]: https://autohotkey.com/
