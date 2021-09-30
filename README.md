```
  ___   _            _   _        
 / __| | |_    ___  | | | |  _  _ 
 \__ \ | ' \  / -_) | | | | | || |
 |___/ |_||_| \___| |_| |_|  \_, |
                             |__/ 
```

a simple jQuery plugin for Web Based Terminal Emulators


### Example of usage

```html
<div class="shell" id="command-line">
</div>
```

```javascript

    let shell = $("#command-line").shell({  
        enableGlitch: false,
        User: "root",
        startup: function (shell) {
            shell.print("Server", "A!");
            shell.print("Server", "A!───────▀▄───▄▀────────");
            shell.print("Server", "A!──────▄█▀███▀█▄───────");
            shell.print("Server", "A!─────█▀███████▀█──────");
            shell.print("Server", "A!─────█─█▀▀▀▀▀█─█──────");
            shell.print("Server", "A!────────▀▀─▀▀─────────");
            shell.print("Server", "A!");
            shell.print("", "A!");
            shell.print("Client", "For help say '/help' <kbd class='carrot'>Enter</kbd>");
            shell.print("Client", "<i class='fab fa-linux carrot'></i>");

        }
    });

    shell.register("/help", function (shell, command) {
        shell.print("", "help : Show commands", 5);
        shell.print("", "clear : Clear the console", 5);
        shell.print("", "version : Version info", 5);
        shell.print("", "about : personal summary", 5);
        shell.error("be aware of errors");
    });

  ``` 

![command line sample 1 ](shell1.gif "sample 1").
![command line sample 2 ](shell2.gif "sample 2").

