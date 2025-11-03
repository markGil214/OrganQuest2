@echo off
echo ====================================
echo OrganQuest APK Builder
echo ====================================
echo.
echo This will build your OrganQuest APK
echo Make sure Android Studio is installed!
echo.
pause

cd android

echo.
echo Building APK...
echo This may take 5-10 minutes on first run...
echo.

gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo SUCCESS! APK Built Successfully
    echo ====================================
    echo.
    echo Your APK is located at:
    echo android\app\build\outputs\apk\release\
    echo.
    echo Files created:
    dir app\build\outputs\apk\release\*.apk /b
    echo.
    echo Transfer the APK to your phone and install!
    echo.
) else (
    echo.
    echo ====================================
    echo BUILD FAILED
    echo ====================================
    echo.
    echo Please check the error messages above.
    echo.
    echo Common fixes:
    echo 1. Make sure Android Studio is installed
    echo 2. Make sure JAVA_HOME is set
    echo 3. Run: android\gradlew.bat clean
    echo.
)

pause
