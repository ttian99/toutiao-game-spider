var axios = require('axios');
var csv = require('fast-csv')
var utils = require('./lib/utils');

// var ALL_LIST_URL = 'https://i.snssdk.com/tfe/route/micro_api/list/v1?source=mg_all_list&offset=0&limit=10&manifest_version_code=723&_rticket=1557143827544&iid=71328123953&channel=oppo-cpa&device_type=ONEPLUS%20A5010&language=zh&fp=LSTrL2xuL2GeFlPZF2U1FYKeLrm7&uuid=868233035207578&resolution=1080*2160&openudid=20a22a15ebccb368&update_version_code=72312&ab_group=100168%2C94569%2C102755%2C181429&os_api=28&pos=5r_-9Onkv6e_eCQieCoDeCUfv7G_8fLz-vTp6Pn4v6esrK6zrqykraylsb_x_On06ej5-L-nr66zrKivpa-xv_zw_O3e9Onkv6e_eCQieCoDeCUfv7G__PD87dHy8_r06ej5-L-nrKyus66vpa6upLG__PD87dH86fTp6Pn4v6evrrOsqK2oqaTg&dpi=480&ab_feature=94569%2C102755&ac=wifi&device_id=48128827786&os_version=9&version_code=723&tma_jssdk_version=1.16.1.3&app_name=news_article&ab_version=812271%2C867973%2C668774%2C766808%2C864175%2C855440%2C631594%2C775311%2C765192%2C612374%2C549647%2C472443%2C31211%2C615292%2C546699%2C798353%2C757280%2C862908%2C679100%2C735201%2C767991%2C861913%2C779958%2C660830%2C856474%2C830855%2C859672%2C754087%2C770568%2C859430%2C662176%2C870191%2C762214%2C665174%2C674056%2C751912%2C770486%2C170988%2C643893%2C374116%2C674787%2C550042%2C435213%2C654106%2C649426%2C677128%2C522766%2C416055%2C710077%2C871780%2C801968%2C707372%2C724566%2C799597%2C471407%2C603441%2C789246%2C868824%2C800208%2C783645%2C603382%2C603400%2C603404%2C603406%2C866773%2C833900%2C844799%2C869957%2C661903%2C668775%2C832706%2C848659%2C737591%2C802347%2C820913%2C788012%2C795195%2C792681%2C607361%2C739395%2C764921%2C662099%2C759293%2C661781%2C457481%2C649403%2C815117&version_name=7.2.3&plugin=26958&device_brand=OnePlus&ssmix=a&device_platform=android&aid=13&rom_version=28&did=48128827786';

async function get(url, opts) {
    return axios.get(url, opts)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
            return null;
        })
}

/** 获取编辑推荐 */
async function getEditList() {
    let tempFile = '.temp/editor_list.csv';
    let destFile = 'out/editor_list.' + utils.getDate() + '.csv';
    console.log('destFile = ' + destFile);
    var EDITOR_RECOMMEND_URL = 'https://i.snssdk.com/tfe/route/micro_api/list/v1?source=mg_chosen_list&offset=0&limit=2000';
    let req = await get(EDITOR_RECOMMEND_URL);
    let arr = [];
    if (req && req.status == 0) {
        arr = req.data.list;
        arr = await formatArr(arr);
        await utils.exportJsonToCsv(tempFile, arr);
        await utils.utf8ToGbk(tempFile, destFile);
    } else {
        const err = req ? req.data.message : 'http error';
        console.error('error: ' + err);
    }
}

async function getAllGameByOffset(offset, arr) {
    let limit = 50;
    const url = `https://i.snssdk.com/tfe/route/micro_api/list/v1?source=mg_all_list&offset=${offset}&limit=${limit}&manifest_version_code=723&_rticket=1557143827544&iid=71328123953&channel=oppo-cpa&device_type=ONEPLUS%20A5010&language=zh&fp=LSTrL2xuL2GeFlPZF2U1FYKeLrm7&uuid=868233035207578&resolution=1080*2160&openudid=20a22a15ebccb368&update_version_code=72312&ab_group=100168%2C94569%2C102755%2C181429&os_api=28&pos=5r_-9Onkv6e_eCQieCoDeCUfv7G_8fLz-vTp6Pn4v6esrK6zrqykraylsb_x_On06ej5-L-nr66zrKivpa-xv_zw_O3e9Onkv6e_eCQieCoDeCUfv7G__PD87dHy8_r06ej5-L-nrKyus66vpa6upLG__PD87dH86fTp6Pn4v6evrrOsqK2oqaTg&dpi=480&ab_feature=94569%2C102755&ac=wifi&device_id=48128827786&os_version=9&version_code=723&tma_jssdk_version=1.16.1.3&app_name=news_article&ab_version=812271%2C867973%2C668774%2C766808%2C864175%2C855440%2C631594%2C775311%2C765192%2C612374%2C549647%2C472443%2C31211%2C615292%2C546699%2C798353%2C757280%2C862908%2C679100%2C735201%2C767991%2C861913%2C779958%2C660830%2C856474%2C830855%2C859672%2C754087%2C770568%2C859430%2C662176%2C870191%2C762214%2C665174%2C674056%2C751912%2C770486%2C170988%2C643893%2C374116%2C674787%2C550042%2C435213%2C654106%2C649426%2C677128%2C522766%2C416055%2C710077%2C871780%2C801968%2C707372%2C724566%2C799597%2C471407%2C603441%2C789246%2C868824%2C800208%2C783645%2C603382%2C603400%2C603404%2C603406%2C866773%2C833900%2C844799%2C869957%2C661903%2C668775%2C832706%2C848659%2C737591%2C802347%2C820913%2C788012%2C795195%2C792681%2C607361%2C739395%2C764921%2C662099%2C759293%2C661781%2C457481%2C649403%2C815117&version_name=7.2.3&plugin=26958&device_brand=OnePlus&ssmix=a&device_platform=android&aid=13&rom_version=28&did=48128827786`
    let req = await get(url);
    if (req && req.status == 0) {
        // 拼接数组
        const list = req.data.list;
        arr = arr.concat(list);
        const count = req.data.count;
        offset = offset + limit;

        if (offset >= count) {
            console.log('getAllList over count = ' + count + ' , offset = ' + offset);
            return arr;
        } else {
            return await getAllGameByOffset(offset, arr);
        }
        
    } else {
        var err = req ? req.data.message : 'http error';
        console.error('error offset = ' + offset + ' , error = ' + err);
        return arr;
    }
}

async function getAllList() {
    let tempFile = '.temp/all_list.csv';
    let destFile = 'out/all_list.' + utils.getDate() + '.csv';
    console.log('destFile = ' + destFile);
    let arr = await getAllGameByOffset(0, []);
    arr = await formatArr(arr);
    await utils.exportJsonToCsv(tempFile, arr);
    await utils.utf8ToGbk(tempFile, destFile);
}

/** 格式化输出 */
async function formatArr(arr) {
    for (let i = 0; i < arr.length; i++) {
        const game = arr[i];
        if (game.game_friends) game.game_friends = JSON.stringify(game.game_friends);
        if (game.gid) game.gid = game.gid + '\t';
    }
    return Promise.resolve(arr);
}

async function main() {
    console.log('start spider ');
    await getEditList();
    await getAllList();
    console.log('end spider ');
}

main();