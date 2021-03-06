/**
 * author       : liuliyuan
 * createTime   : 2017/9/6 18:00
 * description  : 访问的路径 http://localhost:3000/login?appName=xyj&token=<string>   也可以登录后直接拿 106528 admin
 */

//TODO:测试
export const configData = {
     piwikData : {
         //测试
         URL:'https://t1.servingcloud.com:4433/piwik/',
         siteId:104,
     },
     jump:'http://120.76.154.202:9007',
     address:'https://test.servingcloud.com/',
     homeProjectUrl6:'https://test.servingcloud.com/wims/DispatchAction.do?efFormEname=ISXM02',
     homeProjectUrl5:'https://test.servingcloud.com/wims/DispatchAction.do?efFormEname=IWCPGL',
 }

//TODO:线上
/*export const configData = {
    piwikData : {
        //线上
        URL:'https://t1.servingcloud.com:4433/piwik/',
        siteId:102,
    },
    jump:'http://supplier.servingcloud.com:9007',
    address : 'https://vat.servingcloud.com/',
    homeProjectUrl6:'https://vat.servingcloud.com/wims/DispatchAction.do?efFormEname=ISXM02',
    homeProjectUrl5:'https://vat.servingcloud.com/wims/DispatchAction.do?efFormEname=IWCPGL',
}*/

export const copyRight = 'servingcloud.com ©喜盈佳企业云服务有限公司 粤ICP备16030834号 粤公网安备 44030502000290号';
export const linkList =[
    {
        url:'https://vat.servingcloud.com/wims/login.jsp',
        name:'喜盈佳企业云平台',
    },{
        url:'http://prioritysupplier.com/login',
        name:'映e融供应链金融平台',
    },{
        url:'http://www.jsbchina.cn/',
        name:'江苏银行',
    },{
        url:'http://www.eastraycloud.com/',
        name:'东方瑞云',
    },{
        url:'http://www.xforceplus.com/',
        name:'票易通',
    },{
        url:'http://www.vvupup.com/',
        name:'万科采购平台',
    },
]
export const messageInfo = [
    {
        url:'',
        title:'热烈庆祝供应链金融上线成功！',
    },{
        url:'',
        title:'热烈庆祝喜盈佳门户网站上线成功！',
    }
];
