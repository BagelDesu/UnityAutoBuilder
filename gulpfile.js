// MODULE IMPORTS
const gulp = require('gulp');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const clean = require('gulp-clean');
const discordHook = require('webhook-discord');

// Paths, Directories, and Variables
const UNITY_PATH = `"F:\\Unity\\Unity\\Hub\\Editor\\2019.1.10f1\\Editor\\Unity.exe"`;
const APP_PATH = `F:\\GitRepos\\ShaderGraphLab`;
const BUILD_OUTPUT = `F:\\Unity\\UnityBulds`;
const BUILD_NAME = `3rdPersonController`;

// Helpers
const UNITY = (unityStartupParams, unityCommand) => 
{
    SendDiscordMessage(`Unity Start Up and command execution: [${unityStartupParams}] [${unityCommand}]`, "Info");

   return exec(`${UNITY_PATH} ${unityStartupParams} ${unityCommand}`, (err, stdout, stderr)=> 
   {
       if(err == null)
       {
           SendDiscordMessage(`Unity Sucessfully Finished [${unityCommand}] ${stdout}`, "Info");
       }
       else
       {
           SendDiscordMessage(`Unity Failed Executing [${unityCommand}] ${stderr}`, "Error");
       }
   });
};

const SendDiscordMessage = (message, type) =>
{
  var Hook = new discordHook.Webhook("https://discordapp.com/api/webhooks/623592585348513810/Ia4HojlVZhqjtvdi_K9Db_0huMTiWgfHcmPdkShun2YPqn98HFXiZqC4AUtQWWWYrsRj");

  switch (type) {
    case "Error":    
       Hook.err("AutoBuilder", `${message} ${LOCAL_TIME}`);
      break;
    case "Info":
        Hook.info("AutoBuilder", `${message} ${LOCAL_TIME}`);
      break;
    case "Warning":
        Hook.warn("AutoBuilder", `${message} ${LOCAL_TIME}`);
      break;
    default:
      break;
  }
}

gulp.task('build', done => {
    UNITY(`-batchmode -quit -logfile ${BUILD_OUTPUT}\\buildlog.txt -projectPath ${APP_PATH}`, 
    `-buildWindows64Player ${BUILD_OUTPUT}\\${BUILD_NAME}.exe`).stdout.on('close', ()=>
    {
        done();
    });
});

// default entry
gulp.task('default', gulp.series(['build']));
// debug entry
gulp.task('debugTaskSeries', gulp.series(['build']))