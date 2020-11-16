# FoundryVTT - Syrinscape (Online Player) Integration

This module provides a convenient way of triggering sounds from Syrinscape's online player from within Foundry VTT. Do note that this does not route audio through Foundry - GMs/players must still use the external Syrinscape service.

## How to Use

The main window is accessible via typing _"/syrin"_ in chat. I recommend macroing this command for easy access.

An auth token/API key must be provided in the module's settings. Without it, this module won't really do anything.

The sound URL should be everything leading up to the word "play" or "stop." If copying a URL from the "Show Remote Controls" feature in the Syrinscape online master portal, you'll need to strip part of it out. A typical URL from the online player looks like: "https://www.syrinscape.com/online/frontend-api/elements/9412/play/?auth_token=XXX". You just need this part: "https://www.syrinscape.com/online/frontend-api/elements/9412".

Folders can be used to subdivide sounds into related sections. All content within the Syrinscape window is sorted alphabetically.

## Todo

* Better localization
* Warning dialog when deleting non-empty folders
* General tree traversal optimizations

## Nice to Have (but probably won't do)

* Support drag and drop in the syrinscape window instead of a custom move dialog
