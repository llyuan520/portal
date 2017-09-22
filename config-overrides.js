/**
 * author       : liuliyuan
 * createTime   : 2017/9/7 10:17
 * description  :
 */

const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess(config, env, {
        modifyVars: { "@primary-color": "#108ee9" },
    });

    return config;
};
