const { default: axios } = require('axios');
const { DOMParser } = require('xmldom');
const { SMS_LayDanhSach_LichGui, SMS_Luu_Log } = require('../data/storedProcedure');
const logger = require('../utils/logger');

function MakeXML(config) {
    const stringParameters = config.PARAMS
    let stringXML = ''
    if (stringParameters.length !== 0) {
        const arrayStringParameters = stringParameters.split(',')
        arrayStringParameters.forEach((parameter,number) => {
            stringXML += `<PARAMS>
            <NUM>${number + 1}</NUM>
            <CONTENT>${config[parameter]}</CONTENT>
        </PARAMS>
        `
        })
    } 
    let RQST =
        `<RQST>
        <name>send_sms_list</name>
        <REQID></REQID>
        <LABELID>${config.LABELID}</LABELID>
        <CONTRACTID>${config.CONTRACTID}</CONTRACTID>
        <CONTRACTTYPEID>${config.CONTRACTTYPEID}</CONTRACTTYPEID>
        <TEMPLATEID>${config.TEMPLATEID}</TEMPLATEID>
        ${stringXML}<SCHEDULETIME></SCHEDULETIME>
        <MOBILELIST>${config.sdt}</MOBILELIST>
        <ISTELCOSUB>${config.ISTELCOSUB}</ISTELCOSUB>
        <AGENTID>${config.AGENTID}</AGENTID>
        <APIUSER>${config.APIUSER}</APIUSER>
        <APIPASS>${config.APIPASS}</APIPASS>
        <USERNAME>${config.USERNAME}</USERNAME>
        <DATACODING>${config.DATACODING}</DATACODING>
    </RQST>`
    return RQST
}

async function GuiTinNhan(idDonVi) {
    let danhSachBenhNhan = await SMS_LayDanhSach_LichGui(idDonVi) ?? []
    danhSachBenhNhan.forEach(async benhNhan => {
        let xml = MakeXML(benhNhan);
        console.log(xml); 
        // await axios
        //     .post(process.env.API_SMS, xml, { 'Content-Type': 'application/xml' })
        //     .then(async response => {
        //         const responseData = response.data
        //         logger.info(`Response data ${benhNhan.hoten}:  + ${responseData}`)
        //         // Parse the XML content within the "data" property
        //         const parser = new DOMParser();
        //         const xmlDoc = parser.parseFromString(responseData, "text/xml");
        //         // Access the values inside the <ERROR> and <ERROR_DESC> elements
        //         const errorCode = xmlDoc.getElementsByTagName("ERROR")[0].textContent;
        //         const errorDescription = xmlDoc.getElementsByTagName("ERROR_DESC")[0].textContent;
        //         await SMS_Luu_Log(`${idDonVi}`, xml, errorDescription, benhNhan.sdt, benhNhan.myt, `${errorCode}`, benhNhan.id)
        //     }).catch(async (error) => {
        //         // Handle any errors here
        //         await SMS_Luu_Log(`${idDonVi}`, xml, error, benhNhan.sdt, benhNhan.myt, '', benhNhan.id)
        //     });
    })
}

module.exports = { GuiTinNhan }