/** ******************************************************************
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
******************************************************************** */
/* global effect, effects, animate, cancel, set, animationTime, Effect, QEasingCurve */

'use strict';

const grayscaleEffect = {
  loadConfig() {
    grayscaleEffect.isApplyInactiveWindowsOnly = effect.readConfig(
      'ApplyInactiveWindowsOnly',
      false
    );
    grayscaleEffect.isExcludePanels = effect.readConfig('ExcludePanels', false);
    grayscaleEffect.effectStrength = effect.readConfig('EffectStrength', 100);
  },
  startAnimation(window) {
    // Do not apply invisible windows
    if (!window.visible) return;

    // Do not apply active window by config
    if (
      grayscaleEffect.isApplyInactiveWindowsOnly === true &&
      window === effects.activeWindow
    ) {
      return;
    }

    // Do not apply panels by config
    if (
      grayscaleEffect.isExcludePanels === true &&
      window.windowClass.indexOf('plasmashell') !== -1
    ) {
      return;
    }

    window.animation = set({
      window,
      duration: animationTime(100),
      animations: [
        {
          type: Effect.Saturation,
          to: 1 - grayscaleEffect.effectStrength / 100,
        },
      ],
    });
  },
  cancelAnimation(window) {
    if (window.animation) {
      cancel(window.animation);
      window.animation = undefined;
    }
  },
  restartAnimation(window) {
    grayscaleEffect.cancelAnimation(window);
    grayscaleEffect.startAnimation(window);
  },
  windowActivated(activatedWindow) {
    if (!activatedWindow) return;
    if (grayscaleEffect.isApplyInactiveWindowsOnly)
      grayscaleEffect.cancelAnimation(activatedWindow);
    effects.stackingOrder
      .filter((element) => !element.animation)
      .forEach(grayscaleEffect.startAnimation);
  },
  desktopChanged() {
    effects.stackingOrder.forEach(grayscaleEffect.restartAnimation);
  },
  init() {
    effects.windowActivated.connect(grayscaleEffect.windowActivated);
    effects['desktopChanged(int,int)'].connect(grayscaleEffect.desktopChanged);
    effects.desktopPresenceChanged.connect(grayscaleEffect.restartAnimation);
    effects.windowClosed.connect(grayscaleEffect.cancelAnimation);
    effects.windowMinimized.connect(grayscaleEffect.cancelAnimation);

    grayscaleEffect.loadConfig();

    effects.stackingOrder.forEach(grayscaleEffect.restartAnimation);
  },
};

grayscaleEffect.init();
