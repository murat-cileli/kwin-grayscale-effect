# KWin Grayscale Effect

Configurable grayscale effect for KWin window manager and KDE desktop environment.

![screenshot_20180917_191805](https://user-images.githubusercontent.com/6532000/50812558-3a565e80-1324-11e9-9006-19422928b3fb.png)

![screenshot_20180917_090716](https://user-images.githubusercontent.com/6532000/50812559-3cb8b880-1324-11e9-8b06-0bd04ae763bd.png)

# Installation

1. [Download](https://github.com/murat-cileli/kwin-grayscale-effect/archive/master.zip) or Git Pull
2. Copy "kwin4_effect_grayscale" folder to "/usr/share/kwin/effects", using e.g.
```{.bash}
sudo cp -r kwin4_effect_grayscale /usr/share/kwin/effects
```
3. Copy "kwin4_effect_grayscale.desktop" to "/usr/share/kservices5/kwin", using e.g.
```{.bash}
sudo cp kwin4_effect_grayscale.desktop /usr/share/kservices5/kwin
```
4. Add "kwin4_effect_grayscaleEnabled=true" to "[Plugins]" section in "~/.config/kwinrc" (as a normal user).
In case the [Plugins] section is missing from the kwinrc file, just add it.

To test it for the first time, open `System Settings` > `Desktop Behavior`. In there, open `Desktop Effects`. You should see `Grayscale` in the `Appearance` section. Toggle it a couple of times, and you'll see the grayscale effect at work.


### Known Quirks

- **Settings doesn't apply**:
  - In System Settings, uncheck "Grayscale" and re-check then apply.
  - Make sure the persmissions in are set to `drwxr-xr-x` for the `kwin4_effect_grayscale` folder and its content. If not, run (as root)
    ```{.bash}
    chmod 755 /usr/share/kwin/effects/kwin4_effect_grayscale/
    find /usr/share/kwin/effects/kwin4_effect_login/ -type d -exec chmod 755 {} +.
    ```
