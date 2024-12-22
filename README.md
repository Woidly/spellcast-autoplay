# spellcast-autoplay

**The most efficient Discord Spellcast automation tool.**

![Showcase GIF](https://github.com/user-attachments/assets/eb7017da-1672-4d7c-8c16-2aa7a10996d2)

This is a userscript that automatically plays Spellcast.

This project is written in TypeScript with [Bun](https://bun.sh).

## Features

- Powered by the fastest Spellcast solver, [Woidly/spellcast-solver](https://github.com/Woidly/spellcast-solver)
- Directly injected into the game, so no pixel-perfect setup and mouse control is required
- Simple UI for configuration

## Server

Since JavaScript or Tampermonkey can't run solver executable on your machine, it also requires a server.
Server is powered by `Bun.serve`, therefore it doesn't require any JS dependencies and works out of the box.
Not much to say about it, it's very simple.
You can run it with `bun run server`.

However, it needs paths to solver and dictionary. You can specify paths with `-d`/`--dictionary` and `-s`/`--solver` arguments (like `bun run server -d /usr/share/dictionary.txt -s /opt/spellcast-solver`).  
You can also change server port with `-p`/`--port`, however there's no reason to change it, as default port `27974` should certainly be free.
But if you do change port, don't forget to also change it [in the client](client/lib/solver.ts#L5).

## Client (userscript)

### Building

To build, use the `build` script (`bun run build`).
Bun will minify all the necessary files, bundle them, append userscript meta and write output to `dist/spellcast.userscript.js`.
Note that build script relies on `cat` to read meta, though it isn't a big deal, since `cat` is available on almost every UNIX-based system.

### Userscript

It is a userscript, so you'll need a userscript manager to run it.
The only tested (and supported) one is [Tampermonkey](https://www.tampermonkey.net/), as script relies on its implementation of `GM.xmlHttpRequest` to bypass the CSP.  
However, if `GM.xmlHttpRequest` is not found, it'll try to use the default `fetch`, so technically it can work from other userscript managers (or even console) if CSP is disabled (you only will need to allow connection from `852509694341283871.discordsays.com` to `localhost`).  
You can learn more (or implement your own bypass) in [client/lib/http.ts](client/lib/http.ts).

After building, install the userscript (check out Tampermonkey's [FAQ](https://www.tampermonkey.net/faq.php#Q102)).

> [!TIP]
> For local development I recommend removing code from userscript and adding something like `@require file:///home/woidly/path/to/dist/spellcast.userscript.js` to include a local file that is automatically updated each time you re-build userscript.
> However, it only works in Chromium-based browsers and only if you enabled "Allow access to file URLs" for Tampermonkey in extension settings.
> You can learn more in [FAQ](https://www.tampermonkey.net/faq.php#Q402).

### Running

Now start the server and open Spellcast.
If you installed userscript properly, you'll see the UI at the bottom of the page.
If server can be reached, you'll see "Idle" or "Waiting for game hook..." in the UI.  
Otherwise, "Connection to the server failed!" on white background will be shown.
In this case, make sure server is running and can be reached from userscript, and press the "Retry" button.

### UI

![UI screenshot](https://github.com/user-attachments/assets/1f8c22ce-853e-405a-9dc7-9bc4a313e617)

UI is divided into 3 parts:

1. **Config**  
   Place where you can change solver config.
   So far it has the following settings:
   - Threads:  
     Number of threads passed to the solver in `--threads` argument.  
     However, if you have no swaps available, it will be set to `1` for this round, since multithreading is slower for 0 swaps.  
     Defaults to `navigator.hardwareConcurrency` or `8`.
   - Auto start timer:  
     Whether it should start timer in Spellcast for opponents automatically.
     Defaults to `true`.
2. **Status**  
   Text that displays current program state.
   Most solver-related states also have "Interrupt" button, but you should only press it in case it messes up or halts.  
   Pressing that button will manually crash the program and show you the error screen.
   On error screen there is a "Recover?" button.
   Before pressing it, make sure game is ready to be played (e.g. swap menu is closed, tiles are not shaking).
   Pressing it will perform soft-reset and fix most errors.
3. **Credits**  
   `(c) 2024 Woidly`. That's it. I couldn't even put GitHub link in there, because "the request was made in a sandboxed frame whose 'allow-popups' permission is not set".

> [!WARNING]  
> This code and documentation is still WIP.
