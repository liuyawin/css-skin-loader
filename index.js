const loaderUtil = require('loader-utils');

module.exports = function (source) {
    const options = loaderUtil.getOptions(this);
    const filePath = this.resourcePath;
    const component = options.component || {};
    const setAttrArr = [];
    let cAttr;
    //取出单独定义的样式
    for (const key in component) {
        if (component.hasOwnProperty(key)) {
            if (filePath.indexOf(key) > -1) {
                cAttr = component[key];
                break;
            }
        }
    }
    //使用单独定义的样式
    if (cAttr) {
        for (const key in cAttr) {
            if (cAttr.hasOwnProperty(key)) {
                const val = options[key];
                const keyReg = new RegExp(`__${key}__`, 'g');
                source = source.replace(keyReg, val);
                setAttrArr.push(key);
            }
        }
    }
    //使用通用样式
    for (const key in options) {
        if (options.hasOwnProperty(key) && key !== 'component' && setAttrArr.indexOf(key) === -1) {
            const val = options[key];
            const keyReg = new RegExp(`__${key}__`, 'g');
            source = source.replace(keyReg, val);
            setAttrArr.push(key);
        }
    }

    return source;
}