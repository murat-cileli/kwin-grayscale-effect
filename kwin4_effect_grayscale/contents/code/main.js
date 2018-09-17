/********************************************************************
 KWin - the KDE window manager
 This file is part of the KDE project.

 Copyright (C) 2013 Martin Gräßlin <mgraesslin@kde.org>

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*********************************************************************/
/*global effect, effects, animate, cancel, set, animationTime, Effect, QEasingCurve */
/*jslint continue: true */
var grayscaleEffect = {
    startAnimation: function (window, duration) {
        "use strict";
        window.animation = set({
            window: window,
            duration: animationTime(100),
            animations: [{
                type: Effect.Saturation,
                to: 0
            }]
        });
    },
    cancelAnimation: function (window) {
        "use strict";
        if (window.animation !== undefined) {
            cancel(window.animation);
            window.animation = undefined;
        }
    },
    windowClosed: function (window) {
        "use strict";
        grayscaleEffect.cancelAnimation(window);
    },
    desktopChanged: function () {
        "use strict";
        var i, windows, window;
        
        windows = effects.stackingOrder;
        
        for (i = 0; i < windows.length; i += 1) {
            if (windows[i].visible === false) {
                continue;
            }
            grayscaleEffect.cancelAnimation(windows[i]);
            grayscaleEffect.startAnimation(windows[i]);
        }
    },
    init: function () {
        "use strict";
        var i, windows;

        effects.windowClosed.connect(grayscaleEffect.windowClosed);
        effects.windowMinimized.connect(grayscaleEffect.cancelAnimation);
        effects.windowUnminimized.connect(grayscaleEffect.startAnimation);
        effects['desktopChanged(int,int)'].connect(grayscaleEffect.desktopChanged);
        effects.desktopPresenceChanged.connect(grayscaleEffect.cancelAnimation);
        effects.desktopPresenceChanged.connect(grayscaleEffect.startAnimation);

        windows = effects.stackingOrder;

        for (i = 0; i < windows.length; i += 1) {
            if (windows[i].visible === false) {
                continue;
            }
            grayscaleEffect.startAnimation(windows[i]);
        }
    }
};

grayscaleEffect.init();