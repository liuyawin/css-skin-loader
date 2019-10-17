# 用法
css：
```
.container{
    width: 80px;
    height: 120px;
    color: __fontColor__;
    background-color: __bgColor__;
    border: 1px solid __borderColor__;
}
```
在项目根目录下放置配置文件.skinconfig:
```
{
    "gray": {
        "bgColor": "#FF4040",
        "fontColor": "#8A2BE2",
        "borderColor": "#333333",
    }
}
```
在webpack配置中css相关的loader最后面添加css-skin-loader配置项：
```
{
    loader: 'css-skin-loader',
    options: {
        skinName: 'gray',
        configPath: '.skinconfig'
    }
}
```
其中skinName为默认皮肤，configPath为默认的配置文件名，配置文件放在项目的最外层。打包后结果为：
```
.container{
    width: 80px;
    height: 120px;
    color: #8A2BE2;
    background-color: #FF4040;
    border: 1px solid #333333;
}
```