const { Client } = require('discord-rpc');
const { execSync } = require('child_process');
const { parseTime } = require('./util.js');

const cmd = 'cmus-remote -C status';

const client = new Client({ transport: 'ipc' })

execSync(cmd);
// test once

client.once('ready', () => {
    console.log('Logged in. Ready to work !');
    setInterval(() => {
        const out = execSync(cmd, {
            encoding: 'utf8'
        }).split('\n');
        if (!(out.filter(x => x).length)) {
            // no output, maybe cmus is not running
            console.log('No output obtained from cmus-remote. Are you sure cmus is running?')
            process.exit(1)
        }

        let status = out.find((arg) => arg.startsWith('status')).split(' ')[1];
        status = status.charAt(0).toUpperCase() + status.slice(1);

        let presence = { 
            status,
            time : {
                position : (out.find(arg => arg.startsWith('position')) || []).split(' ')[1],
                duration : (out.find(arg => arg.startsWith('duration')) || []).split(' ')[1]
            },
            metadata : {
                title : (out.find(arg => arg.startsWith('tag title')) || []).split(' ').slice(2).join(' '),
                artist : (out.find(arg => arg.startsWith('tag artist')) || []).split(' ').slice(2).join(' '),
                album: (out.find(arg => arg.startsWith('tag album')) || []).split(' ').slice(2).join(' ')
            }
        };
        
        client.setActivity({
            state: `${presence.status}` + (
                presence.time.position && 
                ` (${parseTime(presence.time.position)} / ${parseTime(presence.time.duration)})`
            ),
            details: (presence.metadata.title ? presence.metadata.title : 'Nothing is playing') + (
                presence.metadata.artist && ` - ${presence.metadata.artist}`
            ) + (presence.metadata.album && ` (${presence.metadata.album})`),
            instance: true
        })
    }, 500);
    console.log('Main loop registered.')
})

client.login({
    clientId: process.env.CMUS_DISCORD_CLIENT_ID || '587954415776825355'
})
