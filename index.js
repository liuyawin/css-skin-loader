const fs = require('fs');
const path = require('path');
const minimist = require("minimist");
const loaderUtil = require('loader-utils');

module.exports = function (source) {
    const options = loaderUtil.getOptions(this);
    const skinName = minimist(process.argv.slice(2)).skin;
    const configPath = options && options.configPath ? `${this.rootContext}/${options.configPath}` 
                        : `${this.rootContext}/.skinconfig`;

    let callback = this.async();
    fs.readFile(configPath, 'utf-8', (err, data) => {
        const skinConfig = JSON.parse(data);
        let skinData = skinConfig[skinName];
        if (options && !skinData) {
            skinData = skinConfig[options.skinName];
        }
        if (!skinData) {
            console.warn('没有找到对应的皮肤信息');
            return source;
        }

        const filePath = this.resourcePath;
        const component = skinData.component || {};
        const setAttrArr = [];
        let cAttr;
        //取出单独定义的样式
        for (const key in component) {
            if (component.hasOwnProperty(key)) {
                if (filePath.indexOf(path.join('/' + key + '/')) > -1) {
                    cAttr = component[key];
                    break;
                }
            }
        }
        //使用单独定义的样式
        if (cAttr) {
            for (const key in cAttr) {
                if (cAttr.hasOwnProperty(key)) {
                    const val = cAttr[key];
                    const keyReg = new RegExp(`__${key}__`, 'g');
                    source = source.replace(keyReg, val);
                    setAttrArr.push(key);
                }
            }
        }
        //使用通用样式
        for (const key in skinData) {
            if (skinData.hasOwnProperty(key) && key !== 'component' && setAttrArr.indexOf(key) === -1) {
                const val = skinData[key];
                const keyReg = new RegExp(`__${key}__`, 'g');
                source = source.replace(keyReg, val);
                setAttrArr.push(key);
            }
        }
        callback(err, source);
    });
    return;
}