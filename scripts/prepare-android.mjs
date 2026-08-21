import fs from 'node:fs';
const p='android/app/src/main/AndroidManifest.xml';
if(!fs.existsSync(p)) process.exit(0);
let s=fs.readFileSync(p,'utf8');
const permissions=['<uses-permission android:name="android.permission.CAMERA" />','<uses-permission android:name="android.permission.RECORD_AUDIO" />','<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />'];
for(const permission of permissions) if(!s.includes(permission)) s=s.replace('<application',`${permission}\n    <application`);
fs.writeFileSync(p,s);
