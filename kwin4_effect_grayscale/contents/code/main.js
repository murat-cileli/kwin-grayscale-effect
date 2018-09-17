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
    loadConfig: function() {
        "use strict";
        grayscaleEffect.isApplyInactiveWindowsOnly = effect.readConfig("ApplyInactiveWindowsOnly", false);
        grayscaleEffect.isExcludePanels = effect.readConfig("ExcludePanels", false);
        grayscaleEffect.effectStrength = effect.readConfig("EffectStrength", 100);
    },
    startAnimation: function (window, duration) {
        "use strict";

        // Do not apply invisible windows
        if (window.visible === false) {
            return false;
        }

        // Do not apply active window by config
        if (grayscaleEffect.isApplyInactiveWindowsOnly === true && window == effects.activeWindow) {
            return false;
        }

        // Do not apply panels by config
        if (grayscaleEffect.isExcludePanels === true && window.windowClass.indexOf('plasmashell') !== -1) {
            return false;
        }

        window.animation = set({
            window: window,
            duration: animationTime(100),
            animations: [{
                type: Effect.Saturation,
                to: 1.0 - parseFloat(grayscaleEffect.effectStrength / 100)
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
    desktopChanged: function () {
        "use strict";
        var i, windows, window;
        
        windows = effects.stackingOrder;
        
        for (i = 0; i < windows.length; i++) {
            grayscaleEffect.cancelAnimation(windows[i]);
            grayscaleEffect.startAnimation(windows[i]);
        }
    },
    init: function () {
        "use strict";
        var i, windows;

        effects.windowClosed.connect(grayscaleEffect.cancelAnimation);
        effects.windowMinimized.connect(grayscaleEffect.cancelAnimation);
        effects.windowUnminimized.connect(grayscaleEffect.startAnimation);
        effects['desktopChanged(int,int)'].connect(grayscaleEffect.desktopChanged);
        effects.desktopPresenceChanged.connect(grayscaleEffect.cancelAnimation);
        effects.desktopPresenceChanged.connect(grayscaleEffect.startAnimation);

        grayscaleEffect.loadConfig();

        windows = effects.stackingOrder;

        for (i = 0; i < windows.length; i++) {
            grayscaleEffect.startAnimation(windows[i]);
        }
    }
};

grayscaleEffect.init();