const core = require('@actions/core');
const fs = require('fs');
const os = require('os');
const path = require('path');

const expandEnvironmentVariable = (name, ...to) => {
    for (const envVar of to) {
        core.exportVariable(envVar, process.env[name]);
    }
};

const generateMavenSettingsXML = (username, password, ...repoNames) => {
    const m2folder = path.join(os.homedir(), '.m2');
    const settingsPath = path.join(m2folder, 'settings.xml');
    let config = '<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 https://maven.apache.org/xsd/settings-1.0.0.xsd">';
    config += '\n    <servers>';
    for (const repoName of repoNames) {
        config += '\n        <server>';
        config += `\n            <id>${repoName}</id>`;
        config += `\n            <username>${username}</username>`;
        config += `\n            <password>${password}</password>`;
        config += '\n        </server>';
    }
    config += '\n    </servers>';
    config += '\n</settings>';
    config += '\n';

    if (!fs.existsSync(m2folder)) {
        fs.mkdirSync(m2folder, {recursive: true});
    }
    fs.writeFileSync(settingsPath, config);
};

expandEnvironmentVariable('REPO_USERNAME', 'ORG_GRADLE_PROJECT_foxcraftUsername', 'ORG_GRADLE_PROJECT_foxcraft-thirdpartyUsername', 'ORG_GRADLE_PROJECT_foxcraft-releasesUsername', 'ORG_GRADLE_PROJECT_foxcraft-snapshotsUsername');
expandEnvironmentVariable('REPO_PASSWORD', 'ORG_GRADLE_PROJECT_foxcraftPassword', 'ORG_GRADLE_PROJECT_foxcraft-thirdpartyPassword', 'ORG_GRADLE_PROJECT_foxcraft-releasesPassword', 'ORG_GRADLE_PROJECT_foxcraft-snapshotsPassword');
generateMavenSettingsXML(process.env.REPO_USERNAME, process.env.REPO_PASSWORD, 'foxcraft', 'foxcraft-thirdparty', 'foxcraft-releases', 'foxcraft-snapshots');
